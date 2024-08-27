import type { ButtonHTMLAttributes } from "react";
import type { RecipeVariantProps} from 'styled-system/css';
import * as Tooltip from '@radix-ui/react-tooltip';

import { css, cva } from 'styled-system/css'
import { SystemStyleObject } from "styled-system/types";
import { styled } from "styled-system/jsx";

export const buttonRecipe = cva({
    base: {
        position: 'relative',
        border: '1px solid',
        borderColor: 'main',
        fontSize: 'md',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',

        _hover: {
            bg: 'main/80',
        },

        _focusVisible: {
            outline: 'none',
            shadow: '0px 0px 0px 2px var(--shadow-color)',
            shadowColor: 'main/50',
        },

        _disabled: {
            cursor: 'initial',
            opacity: '0.5',

            _hover: {
                bg: 'main',
            },
        }
    },
    variants: {
        visual: {
            solid: { bg: 'main', color: 'dark' },
            outline: { borderWidth: '1px', borderColor: 'main', color: 'main', bg: 'dark', _hover: { bg: 'main/10' } }
        },
        size: {
            sm: { padding: '2', fontSize: '0.8rem' },
            md: { padding: '4', fontSize: '1rem' },
            lg: { padding: '8', fontSize: '1.4rem' }
        }
    },
    defaultVariants: {
        visual: 'solid',
        size: 'md'
    }
})

export type ButtonVariants = RecipeVariantProps<typeof buttonRecipe>;


export const Button = ({
    children,
    visual,
    size,
    tooltip,
    css: cssProp,
    ...props }: ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants & { css?: SystemStyleObject; tooltip?: string }) => {
    
    if (tooltip) {
        const buttonProps = buttonRecipe.raw({ visual, size });
        return (
            <Tooltip.Provider>
                <Tooltip.Root delayDuration={200}>
                    <Tooltip.Trigger asChild>
                        <button
                            {...props}
                            className={css(buttonProps, cssProp)}
                        >
                            {children}
                        </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <TooltipContent sideOffset={5}>
                            {tooltip}
                            <TooltipArrow />
                        </TooltipContent>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        );
    }


    return <button {...props} className={buttonRecipe({ visual, size })}>
        {children}
    </button>;
};

const TooltipContent = styled(Tooltip.Content, {
    base: {
        borderRadius: 'md',
        padding: '10px 15px',
        lineHeight: 1,
        color: 'dark',
        backgroundColor: 'white',
        boxShadow:
            'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
        userSelect: 'none',
        animationDuration: '200ms',
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
        '&[data-state="delayed-open"]': {
            '&[data-side="top"]': { animationName: 'slideDownAndFade' },
            '&[data-side="right"]': { animationName: 'slideLeftAndFade' },
            '&[data-side="bottom"]': { animationName: 'slideUpAndFade' },
            '&[data-side="left"]': { animationName: 'slideRightAndFade' },
        },
    },
});

const TooltipArrow = styled(Tooltip.Arrow, {
    base: {
        fill: 'white',
    },
});