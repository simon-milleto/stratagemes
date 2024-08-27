import { LuGem } from "react-icons/lu";
import { styled } from "styled-system/jsx";
import type { Gem } from "~/types/game";

const Icon = styled(LuGem, {
    variants: {
        color: {
            red: {
                color: 'gem.red',
            },
            blue: {
                color: 'gem.blue',
            },
            green: {
                color: 'gem.green',
            },
            yellow: {
                color: 'gem.yellow',
            },
            white: {
                color: 'gem.white',
            },
            black: {
                color: 'gem.black',
            },
            empty: {
                color: 'white',
            }
        },
    }
});

export default function GemIcon({ gem }: { gem: Gem }) {
    return <Icon color={gem.color} />;
}
