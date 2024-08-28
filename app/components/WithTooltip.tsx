import * as Tooltip from '@radix-ui/react-tooltip';

import { styled } from "styled-system/jsx";

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

export function WithTooltip({ children, tooltip }: { children: React.ReactNode, tooltip: string }) {
    return (
        <Tooltip.Provider>
            <Tooltip.Root delayDuration={200}>
                <Tooltip.Trigger asChild>
                    {children}
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