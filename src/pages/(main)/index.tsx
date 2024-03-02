import { Box, Button, Container, Grid, IconButton, Stack } from "@mui/material";
import { Lock as LockIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";

import Popup from "@/components/popup";
import * as Server from "@/utils/Server";
import { RoomAvailable } from "colyseus.js";
import { Text } from "@/components/StyledText";
import { useNavigate } from "@/router";
import { RoomMetadata } from "@/lib/types";
import DialogTitle from "@/constants/DialogTitle";
import { changeNickname, useNickname } from "@/hooks/useNickname";
import { hashPassword } from "@/utils/Crypto";

export default function MainScreen() {
  const [rooms, setRooms] = useState<RoomAvailable<RoomMetadata>[]>([]);
  const { nickname } = useNickname();
  const navigate = useNavigate();

  const refresh = () => {
    Server.getAvailableRooms()
      .then(setRooms)
      .catch(() => {
        Popup.stopLoading();
        Popup.openConfirmDialog(
          DialogTitle.Alert,
          "서버와 통신에 실패했습니다."
        );
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Container
      maxWidth="md"
      sx={{
        margin: "30px auto 50px",
      }}
    >
      <Box
        sx={{
          padding: "50px 30px 30px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Text variant="h4">레지스탕스 아발론 온라인</Text>
        <Text variant="h5">안녕하세요, {nickname}님!</Text>
        <Box display="flex" alignItems="center" gap={1}>
          <Text variant="h6">참여 가능한 방 목록</Text>
          <IconButton onClick={refresh}>
            <RefreshIcon />
          </IconButton>
        </Box>
        <Box display="flex" width="100%" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            onClick={() => {
              const nickname = prompt("닉네임을 입력해 주세요. (10 자 이내)");
              if (nickname) {
                changeNickname(nickname.substring(0, 10));
              }
            }}
          >
            <Text variant="body1">닉네임 설정</Text>
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/room/create");
            }}
          >
            <Text variant="body1">방 만들기</Text>
          </Button>
        </Box>
        <Stack spacing={2} width="100%">
          {rooms.map((room) => {
            if (room.metadata) {
              const metadata = room.metadata;
              return (
                <Room
                  key={room.roomId}
                  roomId={room.roomId}
                  title={metadata.title}
                  hasPassword={metadata.hasPassword}
                  players={room.clients}
                  maxPlayers={room.maxClients}
                />
              );
            }
          })}
        </Stack>
      </Box>
    </Container>
  );
}

type RoomProps = {
  roomId: string;
  title: string;
  hasPassword: boolean;
  players: number;
  maxPlayers: number;
};

function Room(props: RoomProps) {
  const { roomId, title, hasPassword, players, maxPlayers } = props;
  const navigate = useNavigate();

  return (
    <Button
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        textDecoration: "none",
        p: "12px",
      }}
      onClick={() => {
        let password: string | undefined = undefined;
        if (hasPassword) {
          password = prompt("비밀번호를 입력해 주세요.") || undefined;
          if (!password) {
            return;
          }
        }
        navigate(
          {
            pathname: "/room/:roomId",
            search: password && `p=${hashPassword(password)}`,
          },
          { params: { roomId: roomId } }
        );
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={8.5}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              color: "primary.dark",
            }}
          >
            {hasPassword && <LockIcon />}
            <Text noWrap>{title}</Text>
          </Box>
        </Grid>
        <Grid item xs={3.5}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              color: "gray",
            }}
          >
            <Text noWrap>
              ({players} / {maxPlayers})
            </Text>
          </Box>
        </Grid>
      </Grid>
    </Button>
  );
}
