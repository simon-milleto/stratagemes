import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import type { ReactNode } from "react";

export type Dialog = {
    title: string;
    description: string;
    content: ReactNode;
}

export const useDialog = () => {
    const [, setDialog] = useAtom(dialogAtom);

    return (dialog: Dialog | null) => {
        setDialog((state) => {
            state.dialog = dialog;
        });
    };
};


export const dialogAtom = atomWithImmer<{ dialog: Dialog | null }>({ dialog: null });