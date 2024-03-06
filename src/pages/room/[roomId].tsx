import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { Chat as ChatIcon, Share as ShareIcon } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";

import Popup from "@/components/popup";
import { enterRoom, leaveRoom, useRoom } from "@/hooks/useRoom";
import { useNavigate, useParams } from "@/router";
import * as Server from "@/utils/Server";
import * as Storage from "@/utils/Storage";
import DialogTitle from "@/constants/DialogTitle";
import { Text } from "@/components/StyledText";
import { SubmitButton } from "@/components/StyledButton";
import {
  ChooseMemberRequest,
  GameChatRequest,
  GameChatRespone,
  GameEvent,
  GameTerminatedEvent,
  KickPlayerRequest,
  KillMerlinRequest,
  QuestRequest,
  QuestResponse,
  RoleSelectEvent,
  VoteEvent,
  VoteRequest,
  VoteResponse,
} from "@/lib/types/GameEvent";
import { ExitCode, GameState } from "@/lib/types";
import { Player } from "@/lib/schemas/Player";
import { CrownIcon } from "@/components/icons";
import { QuestPlayers, Roles } from "@/lib/consts";
import { GameRoomState } from "@/lib/schemas/GameRoomState";
import Spinner from "@/components/Spinner";
import { useSearchParams } from "react-router-dom";
import { addChat, useChatWindow } from "@/hooks/useChatWindow";

export default function RoomScreen() {
  const { room } = useRoom();
  const navigate = useNavigate();
  const { roomId } = useParams("/room/:roomId");
  const [searchParams] = useSearchParams();

  const onDisconnected = useCallback(
    (code: number) => {
      if (code == ExitCode.Kick) {
        Popup.openConfirmDialog(
          DialogTitle.Info,
          "강제 퇴장 당하셨습니다.",
          () => {
            navigate("/");
            leaveRoom();
          }
        );
      } else if (code < 4000) {
        Popup.openYesNoDialog(
          DialogTitle.Info,
          "서버와 통신에 실패했습니다.\n다시 접속하시겠습니까?",
          () => {
            location.reload();
          },
          () => {
            navigate("/");
            leaveRoom();
          }
        );
      }
    },
    [navigate]
  );

  const joinRoomAsync = useCallback(async () => {
    const reconnectToken = Storage.getReconnectToken();
    if (reconnectToken) {
      try {
        const room = await Server.reconnectRoom(reconnectToken);
        enterRoom(room);
        room.onLeave(onDisconnected);
        return;
      } catch (reason) {
        console.error(reason);
      }
    }

    try {
      const room = await Server.joinRoom(roomId, {
        nickname: Storage.getNickname(),
        password: searchParams.get("p")?.replace(/ /g, "+") || undefined,
      });
      enterRoom(room);
      room.onLeave(onDisconnected);
    } catch (reason) {
      const error = reason as Error;
      if (error.message == "wrong password") {
        Popup.openConfirmDialog(
          DialogTitle.Info,
          "비밀번호가 틀렸습니다!",
          () => {
            navigate("/");
          }
        );
      } else {
        Popup.openConfirmDialog(
          DialogTitle.Info,
          "방이 존재하지 않습니다!",
          () => {
            navigate("/");
          }
        );
      }
    }
  }, [roomId, navigate, searchParams, onDisconnected]);

  useEffect(() => {
    if (!room || !room.connection.isOpen) {
      joinRoomAsync();
    } else {
      room.onLeave(onDisconnected);
    }
  }, [room, joinRoomAsync, onDisconnected]);

  return (
    <Container
      maxWidth="md"
      sx={{
        margin: "30px auto 50px",
      }}
    >
      <Room />
    </Container>
  );
}

function Room() {
  const { room } = useRoom();
  const { count, addCount, open, close } = useChatWindow();
  const [init, setInit] = useState(false);
  const [state, setState] = useState<GameRoomState | null>(null);
  const [quest, setQuest] = useState(true);
  const [roleSelect, setRoleSelect] = useState<RoleSelectEvent>();
  const navigate = useNavigate();

  useEffect(() => {
    if (room && !init) {
      setInit(true);
      room.onMessage(
        GameEvent.GameTerminatedEvent,
        (event: GameTerminatedEvent) => {
          Popup.stopLoading();
          Popup.openConfirmDialog(DialogTitle.Alert, event.message);
        }
      );
      room.onMessage(
        GameEvent.GameChatResponse,
        (response: GameChatRespone) => {
          const { name, text, datetime } = response;
          addChat({ name: name, text: text, datetime: datetime });
          addCount();
        }
      );
      room.onMessage(GameEvent.StartGameResponse, () => {
        Popup.stopLoading();
      });
      room.onMessage(GameEvent.ResetRoomResponse, () => {
        Popup.stopLoading();
      });
      room.onMessage(GameEvent.RoleSelectEvent, (event: RoleSelectEvent) => {
        setRoleSelect(event);
      });
      room.onMessage(GameEvent.ChooseMemberResponse, () => {
        Popup.stopLoading();
      });
      room.onMessage(GameEvent.VoteEvent, (event: VoteEvent) => {
        const { members } = event;

        Popup.openYesNoDialog(
          DialogTitle.Info,
          <Text>{`원정대 명단: ${members.join(
            ", "
          )}\n원정대 파견에 찬성하시겠습니까?`}</Text>,
          () => {
            const request: VoteRequest = {
              approved: true,
            };
            room.send(GameEvent.VoteRequest, request);
          },
          () => {
            const request: VoteRequest = {
              approved: false,
            };
            room.send(GameEvent.VoteRequest, request);
          }
        );
      });
      room.onMessage(GameEvent.VoteResponse, (response: VoteResponse) => {
        const { approved, disapproved } = response;

        Popup.openConfirmDialog(
          DialogTitle.Info,
          <Text>
            {`파견 찬성: ${approved.join(", ")}\n파견 반대: ${
              disapproved.join(", ") || "없음"
            }`}
          </Text>
        );
      });
      room.onMessage(GameEvent.QuestEvent, () => {
        setQuest(true);
      });
      room.onMessage(GameEvent.QuestResponse, (response: QuestResponse) => {
        const { succeed, failed } = response;

        Popup.openConfirmDialog(
          DialogTitle.Info,
          <Text>{`원정 성공: ${succeed} 명\n원정 실패: ${failed} 명`}</Text>
        );
      });
      room.onMessage(GameEvent.KillMerlinResponse, () => {
        Popup.stopLoading();
      });
      room.onStateChange((newState) => {
        const wrapper = { ...newState } as GameRoomState;
        setState(wrapper);
      });
    }
  }, [room, init, addCount]);

  if (!room || !state) {
    return <Spinner text="방에 접속하는 중입니다..." />;
  }
  const me = state.players.get(room.sessionId);
  if (!me) {
    return null;
  }

  const players: Player[] = [];

  state.players.forEach((player) => {
    players.push(player);
  });

  return (
    <Box>
      <Stack spacing={2}>
        {state.gameState == GameState.Wait && (
          <Box display="flex" alignItems="center" gap={2}>
            <Text variant="h4">{state.title}</Text>
            <Button
              variant="contained"
              startIcon={<ShareIcon fontSize="large" />}
              onClick={() => {
                try {
                  navigator.share({
                    title: "레지스탕스 아발론 온라인",
                    text: "레지스탕스 아발론 온라인에 초대되셨습니다!",
                    url: location.href,
                  });
                } catch (error) {
                  navigator.clipboard.writeText(location.href);
                  Popup.openConfirmDialog(
                    DialogTitle.Info,
                    "클립보드에 복사되었습니다!"
                  );
                }
              }}
            >
              <Text>공유하기</Text>
            </Button>
          </Box>
        )}

        {state.gameState == GameState.Wait && me.isMaster && (
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              room.send(GameEvent.StartGameRequest);
              Popup.startLoading("잠시 뒤 게임이 시작됩니다!");
            }}
          >
            <Stack spacing={2} direction="row">
              <SubmitButton
                disabled={state.players.size < 5}
                backgroundColor="primary.main"
              >
                게임 시작
              </SubmitButton>
              <Alert severity="info">
                <Text>게임 시작 최소 인원은 5명입니다.</Text>
              </Alert>
            </Stack>
          </Box>
        )}

        {state.gameState == GameState.Result && me.isMaster && (
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              room.send(GameEvent.ResetRoomRequest);
              Popup.startLoading("게임을 초기화하는 중입니다...");
            }}
          >
            <Stack spacing={2} direction="row">
              <SubmitButton backgroundColor="primary.main">
                게임 초기화
              </SubmitButton>
            </Stack>
          </Box>
        )}

        {state.gameState != GameState.Wait && (
          <Grid container>
            <Grid
              item
              xs={6}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Text variant="h4">원정 성공</Text>
              <Text variant="h4" color="success.main">
                {state.questSucceed} 회
              </Text>
            </Grid>
            <Grid
              item
              xs={6}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Text variant="h4">원정 실패</Text>
              <Text variant="h4" color="error.main">
                {state.questFailed} 회
              </Text>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Text variant="h5">원정대 해산</Text>
              <Text variant="h5" color="error.main">
                연속 {state.noQuestCount} 회
              </Text>
            </Grid>
          </Grid>
        )}

        {state.gameState != GameState.Wait && (
          <Text variant="h5">직업 목록: {state.roles.join(", ")}</Text>
        )}

        {state.gameState != GameState.Wait && roleSelect && (
          <Alert severity="info">
            <Text>
              당신은 {roleSelect.role.name}입니다.{"\n"}
              {roleSelect.view.length > 0 &&
                `당신의 눈에 ${roleSelect.view.join(", ")}이(가) 보입니다.`}
            </Text>
          </Alert>
        )}

        {state.gameState == GameState.Choose && me.id == state.leader.id && (
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              const members = new FormData(e.currentTarget)
                .getAll("player")
                .map((v) => v.toString());
              if (members.length != QuestPlayers[players.length][state.round]) {
                return;
              }
              const request: ChooseMemberRequest = { memberIds: members };
              room.send(GameEvent.ChooseMemberRequest, request);
              Popup.startLoading("원정대를 꾸리는 중입니다...");
            }}
          >
            <Stack spacing={2} direction="row">
              <Alert severity="info">
                <Text>
                  당신은 원정대장입니다! 원정대에 파견할 사람{" "}
                  {QuestPlayers[players.length][state.round]} 명을 뽑으세요!
                </Text>
              </Alert>
              <SubmitButton backgroundColor="primary.main">
                선택 완료
              </SubmitButton>
            </Stack>
            <FormGroup row>
              {players.map((player) => (
                <FormControlLabel
                  key={player.id}
                  control={<Checkbox />}
                  label={player.name}
                  name="player"
                  value={player.id}
                />
              ))}
            </FormGroup>
          </Box>
        )}

        {state.gameState == GameState.Quest && quest && roleSelect && (
          <Card variant="outlined">
            <CardContent>
              <Text>
                {roleSelect.role.team == "citizen"
                  ? "당신은 성배를 찾기 위한 원정에 나섰습니다...\n그리고 원정을 성공시켰습니다."
                  : "당신은 성배를 찾기 위한 원정에 나섰습니다.\n원정을 성공시키겠습니까?"}
              </Text>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setQuest(false);
                  const request: QuestRequest = {
                    succeed: true,
                  };
                  room.send(GameEvent.QuestRequest, request);
                }}
              >
                성공
              </Button>
              {roleSelect.role.team == "mafia" && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setQuest(false);
                    const request: QuestRequest = {
                      succeed: false,
                    };
                    room.send(GameEvent.QuestRequest, request);
                  }}
                >
                  실패
                </Button>
              )}
            </CardActions>
          </Card>
        )}

        {state.gameState == GameState.End &&
          roleSelect &&
          roleSelect.role.id == Roles.Assassin.id && (
            <Box
              component="form"
              display="flex"
              flexDirection="column"
              gap={1}
              onSubmit={(e) => {
                e.preventDefault();
                const merlin = new FormData(e.currentTarget)
                  .get("merlin")
                  ?.toString();
                if (!merlin) {
                  return;
                }
                const request: KillMerlinRequest = {
                  merlinId: merlin,
                };
                room.send(GameEvent.KillMerlinRequest, request);
                Popup.startLoading("해당 플레이어가 멀린인지 확인 중입니다...");
              }}
            >
              <Alert severity="error">
                <Text>어떤 플레이어를 암살하시겠습니까?</Text>
              </Alert>
              <Stack spacing={2} direction="row">
                <FormControl sx={{ m: 1, width: 300 }}>
                  <Select name="merlin" color="error" defaultValue="">
                    {players.map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <SubmitButton backgroundColor="error.main">암살</SubmitButton>
              </Stack>
            </Box>
          )}

        {state.gameState == GameState.Result && (
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 4,
              gap: 1,
            }}
          >
            <Box display="flex" justifyContent="center">
              <Text variant="h4" color="primary.main">
                {state.winTeam == "citizen" && "선팀의 승리!"}
              </Text>
              <Text variant="h4" color="error.main">
                {state.winTeam == "mafia" && "악팀의 승리!"}
              </Text>
            </Box>
            {state.result.map((player) => {
              return (
                <Box
                  key={player.id}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Text variant="h5">{player.name}</Text>
                  <Text
                    variant="h5"
                    color={
                      player.team == "citizen" ? "primary.main" : "error.main"
                    }
                  >
                    {player.role}
                  </Text>
                </Box>
              );
            })}
          </Paper>
        )}

        <Box display="flex" justifyContent="space-between">
          <Text variant="h5">플레이어 목록 ({state.players.size} / 10)</Text>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              room.leave();
              navigate("/");
              leaveRoom();
            }}
          >
            나가기
          </Button>
        </Box>
        <Stack spacing={1}>
          {players
            .sort((a, b) => a.index - b.index)
            .map((player) => (
              <Box
                key={player.id}
                display="flex"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center" gap="4px">
                  <Text variant="h6">
                    {player.isMaster && "[방장] "}
                    {player.name}
                  </Text>
                  <Text variant="body1" color="text.secondary">
                    {!player.isConnected && " (연결 끊김)"}
                  </Text>
                  {state.gameState != GameState.Wait &&
                    player.id == state.leader.id && (
                      <CrownIcon style={{ width: "1.5em", height: "1.5em" }} />
                    )}
                </Box>
                {me.isMaster && player.id != me.id && player.isConnected && (
                  <Button
                    color="error"
                    onClick={() => {
                      const request: KickPlayerRequest = {
                        id: player.id,
                      };
                      room.send(GameEvent.KickPlayerRequest, request);
                    }}
                  >
                    강퇴
                  </Button>
                )}
              </Box>
            ))}
        </Stack>
      </Stack>
      <Box
        sx={{
          position: "absolute",
          left: "calc(50% - 28px)",
          bottom: "32px",
        }}
      >
        <Badge badgeContent={count} color="secondary">
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => {
              open();
              Popup.openCancelableDialog("채팅", <ChatWindow />, close);
            }}
          >
            <ChatIcon />
          </Button>
        </Badge>
      </Box>
    </Box>
  );
}

function ChatWindow() {
  const { chats } = useChatWindow();
  const { room } = useRoom();
  const inputRef = useRef<TextFieldProps>(null);

  return (
    <Box
      component="form"
      sx={{
        maxHeight: "100%",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const chat = data.get("chat")?.toString();
        if (!chat || !room) {
          return;
        }

        if (inputRef.current) {
          inputRef.current.value = null;
        }

        const request: GameChatRequest = {
          text: chat,
          datetime: new Date().getTime(),
        };
        room.send(GameEvent.GameChatRequest, request);
      }}
    >
      {chats
        .sort((a, b) => a.datetime - b.datetime)
        .map((chat, i) => (
          <Text key={i}>
            {chat.name}: {chat.text}
          </Text>
        ))}
      <Box display="flex" gap={1} mt={1}>
        <TextField inputRef={inputRef} size="small" fullWidth name="chat" />
        <SubmitButton backgroundColor="primary.main">전송</SubmitButton>
      </Box>
    </Box>
  );
}
