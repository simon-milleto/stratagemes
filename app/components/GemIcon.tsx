import { LuGem } from "react-icons/lu";
import { styled } from "styled-system/jsx";
import type { CellColorType } from "~/game/constants";
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

export default function GemIcon({ gem, color }: { gem?: Gem; color?: CellColorType }) {
    return <Icon color={gem?.color || color} />;
}
