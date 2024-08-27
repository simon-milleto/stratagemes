import type { PropsWithChildren } from "react";
import { cva } from "styled-system/css";

type TextHeadingProps = PropsWithChildren<{
    heading?: `h1` | `h2` | `h3` | `h4` | `h5` | `h6`;
    className?: string;
    underlined?: boolean;
    animated?: boolean;
}>;

export const headingRecipe = cva({
    base: {
        position: 'relative',
        fontWeight: 'bold',
        color: 'main',
        textShadow: '0 0 2px var(--text-shadow-color)',
        textShadowColor: 'dark',
        letterSpacing: '0.05em',
    },
});

export const TextHeading = ({
    children,
    heading = 'h1',
    className
}: TextHeadingProps) => {
    const HeadingComponent = heading || 'h1';

    return (
        <HeadingComponent
            className={`${headingRecipe()} ${className}`}>
            {children}
        </HeadingComponent>
    );
};