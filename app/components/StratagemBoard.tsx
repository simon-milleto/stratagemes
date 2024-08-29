import { styled } from 'styled-system/jsx';
import BoardCell from './BoardCell';
import { useGameState } from '~/context/GameContext';

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

const StratagemBoard = () => {
    const { gameState } = useGameState();

    return (
            <Board style={{
                '--board-size': gameState.size
            } as React.CSSProperties}>
                {gameState.cells.map((row, i) => (
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