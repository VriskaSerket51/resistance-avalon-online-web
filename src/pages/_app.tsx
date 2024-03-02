import { Outlet } from "react-router-dom";

import Popup from "@/components/popup";

export default function RootLayout() {
  return (
    <>
      <Popup.DialogContainer />
      <Popup.LoadingComponent />
      <Outlet />
    </>
  );
}
