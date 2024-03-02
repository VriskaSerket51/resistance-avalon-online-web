import { Button, ButtonProps, TypographyProps } from "@mui/material";
import { ReactNode } from "react";

import { Text } from "@/components/StyledText";

type SubmitButtonProps = ButtonProps & {
  backgroundColor: string;
  width?: string;
  height?: string;
  children?: ReactNode;
  textProps?: TypographyProps;
};

export function SubmitButton(props: SubmitButtonProps) {
  const { backgroundColor, children, sx, textProps, ...rest } = props;

  return (
    <Button
      {...rest}
      type="submit"
      variant="contained"
      sx={[
        ...(Array.isArray(sx) ? sx : [sx]),
        {
          backgroundColor: backgroundColor,
          "&:hover": {
            backgroundColor: "#fff",
            color: backgroundColor,
          },
        },
      ]}
    >
      <Text {...textProps}>{children}</Text>
    </Button>
  );
}
