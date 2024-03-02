import { create } from "zustand";
import { ReactNode } from "react";

type Dialog = {
  id: number;
  isOpened: boolean;
  title: ReactNode;
  content: ReactNode;
  onYes?: VoidFunction;
  onNo?: VoidFunction;
  onCancel?: VoidFunction;
  close: VoidFunction;
};

type DialogContainerProps = {
  dialogs: Dialog[];
};

export const useDialogContainerStore = create<DialogContainerProps>(() => ({
  dialogs: [],
}));

export const openDialog = (
  title: ReactNode,
  content: ReactNode,
  onYes?: VoidFunction,
  onNo?: VoidFunction,
  onCancel?: VoidFunction
) => {
  const dialogs = useDialogContainerStore.getState().dialogs;

  let target: Dialog | null = null;
  let id: number = 0;
  for (const dialogObject of dialogs) {
    id = dialogObject.id;
    if (!dialogObject.isOpened) {
      target = dialogObject;
      break;
    }
  }

  if (target == null) {
    id++;
    target = {
      id: id,
      isOpened: true,
      title: title,
      content: content,
      onYes: onYes,
      onNo: onNo,
      onCancel: onCancel,
      close: () => {
        closeDialog(id);
      },
    };

    useDialogContainerStore.setState({
      dialogs: [...dialogs, target],
    });
  } else {
    useDialogContainerStore.setState({
      dialogs: dialogs.map((dialog) => {
        if (dialog.id == id) {
          return {
            ...dialog,
            isOpened: true,
            title: title,
            content: content,
            onYes: onYes,
            onNo: onNo,
            onCancel: onCancel,
          };
        }
        return dialog;
      }),
    });
  }

  return id;
};

export const closeDialog = (id: number) => {
  const dialogs = useDialogContainerStore.getState().dialogs;

  useDialogContainerStore.setState({
    dialogs: dialogs.map((dialog) => {
      if (dialog.id == id) {
        return {
          ...dialog,
          isOpened: false,
        };
      }
      return dialog;
    }),
  });
};

export const closeAll = () => {
  const dialogs = useDialogContainerStore.getState().dialogs;

  useDialogContainerStore.setState({
    dialogs: dialogs.map((dialog) => {
      return {
        ...dialog,
        isOpened: false,
      };
    }),
  });
};

export const openConfirmDialog = (
  title: ReactNode,
  content: ReactNode,
  onYes?: VoidFunction
) => {
  return openDialog(title, content, onYes || (() => {}));
};

export const openYesNoDialog = (
  title: ReactNode,
  content: ReactNode,
  onYes?: VoidFunction,
  onNo?: VoidFunction
) => {
  return openDialog(title, content, onYes || (() => {}), onNo || (() => {}));
};

export const openCancelableDialog = (
  title: ReactNode,
  content: ReactNode,
  onCancel?: VoidFunction
) => {
  return openDialog(
    title,
    content,
    undefined,
    undefined,
    onCancel || (() => {})
  );
};

type LoadingProps = {
  isLoading: boolean;
  text: string;
};

export const useLoadingStore = create<LoadingProps>(() => ({
  isLoading: false,
  text: "",
}));

export const startLoading = (text: string) => {
  useLoadingStore.setState({
    isLoading: true,
    text: text,
  });
};

export const stopLoading = () => {
  useLoadingStore.setState({
    isLoading: false,
  });
};
