import { Typography, TypographyProps } from "@mui/material";

export function Text(props: TypographyProps) {
  return (
    <Typography
      {...props}
      whiteSpace="pre-wrap"
      sx={[
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        { fontFamily: "NotoSansKR", wordBreak: "keep-all" },
      ]}
    >
      {props.children}
    </Typography>
  );
}
