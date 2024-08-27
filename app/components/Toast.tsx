import { IoMdClose } from "react-icons/io";

import * as Toast from "@radix-ui/react-toast";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { toastAtom } from "~/hooks/useToast";
import { css } from "styled-system/css";
import { styled } from "styled-system/jsx";


const Viewport = styled(Toast.Viewport, {
    base: {
        '--viewport-padding': '25px',
        position: 'fixed',
        bottom: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--viewport-padding)',
        gap: '10px',
        width: '390px',
        maxWidth: '100vw',
        margin: 0,
        listStyle: 'none',
        zIndex: 2147483647,
        outline: 'none',
    }
})

const Toaster = () => {
    const [{ list }] = useAtom(toastAtom);

    return (
        <Toast.Provider swipeDirection="right">
            {list.map((props) => (
                <SingleToast {...props} key={props.id} />
            ))}
            <Viewport className={css({
                '--viewport-padding': '25px',
                position: 'fixed',
                bottom: '0',
                right: '0',
                display: 'flex',
                flexDirection: 'column',
                padding: 'var(--viewport-padding)',
                gap: '10px',
                width: '390px',
                maxWidth: '100vw',
                margin: '0',
                listStyle: 'none',
                zIndex: '2147483647',
                outline: 'none',
            })} />
        </Toast.Provider>
    );
};

const Root = styled(Toast.Root, {
    base: {
        backgroundColor: 'white',
        boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
        padding: '15px',
        display: 'grid',
        gridTemplateAreas: `'title action' 'description action'`,
        gridTemplateColumns: 'auto max-content',
        columnGap: '15px',
        alignItems: 'center',

        '&[data-state="open"]': {
            animation: `toastSlideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
        },
        '&[data-state="closed"]': {
            animation: `hide 100ms ease-in`,
        },
        '&[data-swipe="move"]': {
            transform: 'translateX(var(--radix-toast-swipe-move-x))',
        },
        '&[data-swipe="cancel"]': {
            transform: 'translateX(0)',
            transition: 'transform 200ms ease-out',
        },
        '&[data-swipe="end"]': {
            animation: `toastSwipeOut 100ms ease-out`,
        },
    }
})

const Title = styled(Toast.Title, {
    base: {
        gridArea: 'title',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: 'dark',
        fontSize: '15px',
    }
})

const Description = styled(Toast.Description, {
    base: {
        gridArea: 'description',
        margin: 0,
        color: 'dark',
        fontSize: '13px',
        lineHeight: 1.3,
    }
})

const Action = styled(Toast.Action, {
    base: {
        gridArea: 'action',
    }
})

const Close = styled(Toast.Close, {
    base: {
        borderWidth: '1px',
        h: '8',
        w: '8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'dark',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',

        _hover: {
            bg: 'dark',
            color: 'white',
        },
    }
})

const SingleToast = ({
    id,
    open = true,
    title = "",
    subtitle = "",
    mode = "info",
    timer = 3000,
    infinite = false,
}: {
    id?: number;
    open?: boolean;
    title: string;
    subtitle: string;
    mode?: string;
    timer?: number;
    infinite?: boolean;
}) => {
    const [, setToast] = useAtom(toastAtom);
    const timerRef = useRef<NodeJS.Timeout | undefined>();

    const removeToast = () => {
        setToast((state) => {
            state.list = state.list.filter((toast) => toast.id != id);
        });
        timerRef.current && clearTimeout(timerRef.current);
    };

    const setTimer = () => {
        timerRef.current = setTimeout(() => {
            removeToast();
            clearTimeout(timerRef.current);
        }, timer + 1000);
    };

    useEffect(() => {
        !infinite && setTimer();
    }, []);

    return (
        <Root
            duration={Infinity}
        >
            <Title>{title}</Title>
            <Description>{subtitle}</Description>
            <Action asChild altText="Dismiss">
                <Close
                    aria-label="Close"
                    onClick={removeToast}
                >
                    <IoMdClose />
                </Close>
            </Action>
        </Root>
    );
};

export default Toaster;