import type { Toast } from "@radix-ui/react-toast";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";

export type Toast = {
    id?: number;
    open?: boolean;
    title: string;
    subtitle: string;
    timer?: number;
    infinite?: boolean;
    mode?: "info" | "positive" | "negative";
}

export const useToast = () => {
    const [, setToast] = useAtom(toastAtom);

    return ({ timer = 3000, ...toast }: Toast) => {
        const id = Date.now() + Math.random();

        setToast((state) => {
            state.list = [...state.list, { id, timer, ...toast }];
        });
    };
};


export const toastAtom = atomWithImmer<{ list: Array<Toast> }>({ list: [] });