import { Container, Paper, TextField } from "@mui/material";

import Popup from "@/components/popup";
import { Text } from "@/components/StyledText";
import BackButton from "@/components/BackButton";
import { SubmitButton } from "@/components/StyledButton";
import * as Server from "@/utils/Server";
import * as Storage from "@/utils/Storage";
import { enterRoom } from "@/hooks/useRoom";
import { useNavigate } from "@/router";
import DialogTitle from "@/constants/DialogTitle";
import { hashPassword } from "@/utils/Crypto";

export default function CreateScreen() {
  const navigate = useNavigate();

  const onSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = data.get("title")?.toString();
    const password = data.get("password")?.toString();
    if (!title) {
      return;
    }

    Popup.startLoading("방을 생성하는 중입니다...");
    Server.createRoom(
      { title: title, password: password && hashPassword(password) },
      { nickname: Storage.getNickname() }
    )
      .then((room) => {
        Popup.stopLoading();
        enterRoom(room);
        navigate(
          {
            pathname: "/room/:roomId",
            search: password && `p=${hashPassword(password)}`,
          },
          { params: { roomId: room.roomId } }
        );
      })
      .catch((error) => {
        console.error(error);
        Popup.stopLoading();
        Popup.openConfirmDialog(
          DialogTitle.Alert,
          "서버와 통신에 실패했습니다."
        );
      });
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        margin: "30px auto 50px",
      }}
    >
      <Paper
        component="form"
        onSubmit={onSubmit}
        sx={{
          padding: "50px 30px 30px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <BackButton />

        <Text variant="h4">방 만들기</Text>

        <TextField
          size="small"
          label="방 이름"
          name="title"
          fullWidth
          required
          inputProps={{ maxLength: 10 }}
        />
        <TextField
          size="small"
          label="비밀번호"
          name="password"
          fullWidth
          inputProps={{ maxLength: 10 }}
        />

        <SubmitButton backgroundColor="primary.main" width="25%">
          생성
        </SubmitButton>
      </Paper>
    </Container>
  );
}
