import { styled } from 'styled-system/jsx';
import type { GameState } from 'messages';
import BoardCell from './BoardCell';

const Board = styled('div', {
    base: {
        '--board-size': '0',
        display: 'grid',
        gridTemplateColumns: 'repeat(var(--board-size), 1fr)',
        border: '1px solid',
        borderColor: 'main',
        alignSelf: 'center',
    }
});

const Row = styled('div', {
    base: {
        display: 'flex',
        flexDirection: 'column'
    }
});

const StratagemBoard = ({
    board,
}: {
    board: GameState
}) => {
    return (
            <Board style={{
                '--board-size': board.size
            } as React.CSSProperties}>
                {board.cells.map((row, i) => (
                    <Row key={i}>
                        {row.map((cell, j) => (
                                <BoardCell
                                    cell={cell}
                                    key={`cell-${i}-${j}`}
                                />
                        ))}
                    </Row>
                ))}
            </Board>
    )
}

export default StratagemBoard