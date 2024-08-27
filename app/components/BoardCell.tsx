import { LuGem } from "react-icons/lu";
import { CELL_COLOR } from '~/game/constants';
import { styled } from 'styled-system/jsx';
import { useDroppable } from '@dnd-kit/core';
import type { Cell as CellType } from '~/types/game';

const Cell = styled('button', {
    base: {
        position: 'relative',
        width: '40px',
        height: '40px',
        border: '1px solid',
        borderColor: 'main',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.6em',
        fontWeight: '500',
        fontFamily: 'inherit',
        backgroundColor: 'white',
        cursor: 'pointer',
        transition: 'border-color 0.25s',

        _before: {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '2px solid',
            transition: 'all 0.300s ease-in-out',
        },
    },
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
        isOver: {
            true: {
                _before: {
                    borderColor: '#708090'
                }
            },
            false: {
                _before: {
                    borderColor: 'transparent'
                }
            }
        }
    }
});

const BoardCell = ({
    cell
}: {
    cell: CellType;
}) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `cell-${cell.row}-${cell.col}`,
        data: cell
    });

    return (
        <Cell
            ref={setNodeRef}
            isOver={isOver && cell.isEnabled}
            aria-label="cell"
            color={cell.color}
        >
            {cell.color !== CELL_COLOR.EMPTY && (
                <LuGem />
            )}
        </Cell>
    )
}

export default BoardCell