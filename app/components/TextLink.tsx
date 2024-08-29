import { Link } from "@remix-run/react";
import { HTMLAttributes } from "react";
import { RecipeVariantProps, css, cva } from 'styled-system/css'

export const linkRecipe = cva({
    base: {
        position: 'relative',
        display: 'block',
        textDecoration: 'none',
        fontWeight: 'bold',
        borderBottom: '1px solid',
        borderColor: 'secondary',
    }
})

export type LinkVariants = RecipeVariantProps<typeof linkRecipe>;

export const TextLink = ({
    children,
    to = '',
    css: cssProp,
    ...props }: HTMLAttributes<HTMLAnchorElement> & LinkVariants & { to: string; css?: Parameters<typeof css>[0]; }) => {
    if (!children) return null;

    return <Link {...props} to={to} className={`${linkRecipe()} ${css(cssProp)}`}>
        {children}
    </Link>;
};