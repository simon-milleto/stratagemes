import * as Popover from '@radix-ui/react-popover';
import { LuGem } from "react-icons/lu";
import { Button, Flex } from "@radix-ui/themes";
import type { Board } from '~/types/game';
import type { CellColorType } from '~/game/constants';
import { CELL_COLOR } from '~/game/constants';

const StratagemBoard = ({
    board,
    onCellClick
}: {
    board: Board;
    onCellClick: (row: number, col: number, color: CellColorType) => void;
}) => {

    return (
        <section className="board" style={{
            '--board-size': board.size
        } as React.CSSProperties}>
            {board.cells.map((row, i) => (
                <div className="row" key={i}>
                    {row.map((cell, j) => (
                        <Popover.Root key={`popover-${i}-${j}`}><Popover.Trigger asChild key={`trigger-${i}-${j}`}>
                            <button
                                aria-label="cell"
                                disabled={!cell.isEnabled}
                                className={`cell cell-${cell.color}`}
                            >
                                {cell.color !== CELL_COLOR.EMPTY && (
                                    <LuGem />
                                )}
                            </button>
                        </Popover.Trigger>
                            <Popover.Content sideOffset={5} key={`content-${i}-${j}`}>
                                Vos gèmes
                                <Flex gap="3" mt="3" justify="center" align="center">
                                    {/* {currentPlayer.hasYellowStone() &&
                                        <Popover.Close asChild>
                                            <Button
                                                className="color-btn choose-yellow"
                                                onClick={() => onCellClick(i, j, CELL_COLOR.YELLOW)}
                                                radius="full"
                                                size="1"></Button>
                                        </Popover.Close>
                                    }
                                    {currentPlayer.hasWhiteStone() &&
                                        <Popover.Close asChild>
                                            <Button
                                                className="color-btn choose-white"
                                                onClick={() => onCellClick(i, j, CELL_COLOR.WHITE)}
                                                radius="full"
                                                size="1"></Button>
                                        </Popover.Close>
                                    }
                                    {currentPlayer.hasBlackStone() &&
                                        <Popover.Close asChild>
                                            <Button
                                                className="color-btn choose-black"
                                                onClick={() => onCellClick(i, j, CELL_COLOR.BLACK)}
                                                radius="full"
                                                size="1"></Button>
                                        </Popover.Close>
                                    }
                                    {currentPlayer.hasGreenStone() &&
                                        <Popover.Close asChild>
                                            <Button
                                                className="color-btn choose-green"
                                                onClick={() => onCellClick(i, j, CELL_COLOR.GREEN)}
                                                radius="full"
                                                size="1"></Button>
                                        </Popover.Close>
                                    }
                                    {currentPlayer.hasRedStone() &&
                                        <Popover.Close asChild>
                                            <Button
                                                className="color-btn choose-red"
                                                onClick={() => onCellClick(i, j, CELL_COLOR.RED)}
                                                radius="full"
                                                size="1"></Button>
                                        </Popover.Close>
                                    }
                                    {currentPlayer.hasBlueStone() &&
                                        <Popover.Close asChild>
                                            <Button
                                                className="color-btn choose-blue"
                                                onClick={() => onCellClick(i, j, CELL_COLOR.BLUE)}
                                                radius="full"
                                                size="1"></Button>
                                        </Popover.Close>
                                    } */}

                                </Flex>
                            </Popover.Content>
                        </Popover.Root>
                    ))}
                </div>
            ))}
        </section>
    )
}

export default StratagemBoard