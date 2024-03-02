import crownIcon from "@/assets/imgs/crown.png";
import { CSSProperties } from "react";

type IconProps = {
  style?: CSSProperties;
};

export function CrownIcon(props: IconProps) {
  const { style } = props;

  return <img src={crownIcon} style={style} />;
}
