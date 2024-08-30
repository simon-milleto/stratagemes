import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useAtom } from "jotai";
import { IoMdClose } from "react-icons/io";
import { dialogAtom, useDialog } from "~/hooks/useDialog";
import { styled } from "styled-system/jsx";

const Overlay = styled(DialogPrimitives.Overlay, {
    base: {
        backgroundColor: 'var(--black-a9)',
        position: 'fixed',
        inset: 0,
        animation: `overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    }
});
const Content = styled(DialogPrimitives.Content, {
    base: {
        backgroundColor: 'white',
        borderRadius: '6px',
        boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        maxWidth: '650px',
        maxHeight: '85vh',
        padding: '25px',
        overflow: 'auto',
        animation: `contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
        '&:focus': {
            outline: 'none',
        },
    }
});
const Title = styled(DialogPrimitives.Title, {
    base: {
        margin: 0,
        fontWeight: 'bold',
        color: 'dark',
        fontSize: '4xl',
    }
});
const Description = styled(DialogPrimitives.Description, {
    base: {
        margin: '10px 0 20px',
        color: 'dark',
        fontSize: '15px',
        lineHeight: 1.5,
    }
});

const IconButton = styled('button', {
    base: {
        fontFamily: 'inherit',
        borderRadius: '100%',
        height: '25px',
        width: '25px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'dark',
        position: 'absolute',
        top: '10px',
        right: '10px',
        '&:hover': {
            backgroundColor: 'dark/20',
        },
    }
});


const Dialog = () => {
    const [{ dialog }] = useAtom(dialogAtom);
    const dialogTrigger = useDialog();
    if (!dialog) return null;

    return (
    <DialogPrimitives.Root open>
        <DialogPrimitives.Portal>
            <Overlay />
            <Content>
                <Title>{dialog.title}</Title>
                <Description>
                        {dialog.description}
                </Description>
                    {dialog.content}
                <DialogPrimitives.Close asChild>
                    <IconButton aria-label="Close" onClick={() => dialogTrigger(null)}>
                        <IoMdClose />
                    </IconButton>
                </DialogPrimitives.Close>
            </Content>
        </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
    );
}

export default Dialog;