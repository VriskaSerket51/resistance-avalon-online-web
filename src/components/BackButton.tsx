import { useNavigate } from "@/router";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", justifyContent: "flex-start" }}>
      <IconButton
        onClick={() => {
          navigate(-1);
        }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Box>
  );
}
