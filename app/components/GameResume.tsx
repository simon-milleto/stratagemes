import { GameState } from "messages";
import { Flex, styled } from "styled-system/jsx";
import GemIcon from "./GemIcon";
import { PLAYER_ROUND_STATUS } from "~/game/constants";

const PanelTitle = styled('span', {
    base: {
        fontSize: '2xl',
        color: 'main',
        fontWeight: 'bold',
    }
});

const Container = styled('div', {
    base: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: 'dark.secondary',
        shadow: '0px 0px 0px 2px var(--shadow-color)',
        shadowColor: 'dark.secondary/50',
        color: 'dark'
    }
});

const PlayersContainer = styled('div', {
    base: {
        display: 'flex',
        gap: '1rem',
    }
});

const Player = styled('div', {
    base: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem',
        shadow: '0px 0px 0px 2px var(--shadow-color)',
        shadowColor: 'main/50',
        backgroundColor: 'main.light',

    },
    variants: {
        active: {
            false: {
                opacity: '0.8',
            },
            true: {
                animation: 'currentPlayerFlash 0.5s infinite alternate ease-in-out',
            }
        }
    }
});


const PlayerLabel = styled('span', {
    base: {
        fontSize: 'md',
        color: 'dark',
        fontWeight: 'bold',
    }
});
export default function GameResume({ gameState }: { gameState: GameState }) {
    return (
        <Container>
            <PanelTitle>
                Résumé
            </PanelTitle>
            <PlayersContainer>
                {gameState.players.map((player) => (
                    <Player
                        key={player.id}
                        active={player.roundStatus === PLAYER_ROUND_STATUS.PLAYING}>
                        <PlayerLabel>{player.username}</PlayerLabel>
                        {player.gemWons.length === 0 ? (
                            <>
                                Aucun gemme gagnée
                            </>
                        ) : (<>
                            Gemmes gagnées

                            <Flex>
                                {player.gemWons.map((gem) => (
                                    <GemIcon key={gem.id} gem={gem} />
                                ))}
                            </Flex>

                        </>)}
                    </Player>
                ))}
            </PlayersContainer>
        </Container>
    )
}