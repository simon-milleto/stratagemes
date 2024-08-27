import { styled } from "styled-system/jsx";
import { LuGem } from "react-icons/lu";
import { useDraggable } from '@dnd-kit/core';

import type { Player, Gem as GemType} from "~/types/game";
import { PLAYER_ROUND_STATUS } from "~/game/constants";
import { useState } from "react";
import { Button } from "./Button";

const PanelTitle = styled('span', {
    base: {
        fontSize: '2xl',
        color: 'dark',
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
        backgroundColor: 'main.light',
        shadow: '0px 0px 0px 2px var(--shadow-color)',
        shadowColor: 'main/50',
    }
});

const GemContainer = styled('div', {
    base: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
    }
});

const Gem = styled('div', {
    base: {
        display: 'flex',
        fontSize: '1.6em',
    },
    variants: {
        disabled: {
            true: {
                cursor: 'not-allowed',
                opacity: '0.5',
                transform: 'scale(1)',
            },
            false: {
                _hover: {
                    cursor: 'grab',
                    transform: 'scale(1.2)',
                }
            }
        },
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
        }
    }
});

const DrawLabel = styled('p', {
    base: {
        fontSize: 'lg',
        color: 'dark'
    }
});

const GemSelect = styled('button', {
    base: {
        fontSize: '1.6em',
        padding: '0.5rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out',

        _hover: {
            bg: 'dark/20'
        }
    },
    variants: {
        selected: {
            true: {
                color: 'main',
                bg: 'dark/30',

                _hover: {
                    bg: 'dark/40'
                }
            },
        },
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
        }
    }
});

const GemHand = ({ gem, shouldPlay }: { gem: GemType, shouldPlay: boolean }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: gem.id,
        data: gem
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <Gem
            disabled={!shouldPlay}
            color={gem.color}
            ref={setNodeRef}
            style={style}
            {...(shouldPlay && { ...listeners })}
            {...(shouldPlay && { ...attributes })}>
            <LuGem />
        </Gem>
    );
}

const PlayerHand = ({ currentPlayer, onExchange }: { currentPlayer: Player | null, onExchange: (gems: GemType[]) => void }) => {
    const [selectedGems, setSelectedGems] = useState<GemType[]>([]);

    if (!currentPlayer) return null;

    const handleToggleGem = (gem: GemType) => {
        if (selectedGems.find(selectedGem => selectedGem.id === gem.id)) {
            setSelectedGems(selectedGems.filter(selectedGem => selectedGem.id !== gem.id));
        } else {
            setSelectedGems([...selectedGems, gem]);
        }
    }

    const handleExchange = () => {
        onExchange(selectedGems);
        setSelectedGems([]);
    }

    return (
        <Container>
            <PanelTitle>
                Votre main
            </PanelTitle>
            <GemContainer>
            {currentPlayer
                && currentPlayer.roundStatus !== PLAYER_ROUND_STATUS.DRAW_GEMS
                && currentPlayer.handGems.map((gem) => (
                        <GemHand
                            shouldPlay={currentPlayer.roundStatus === PLAYER_ROUND_STATUS.PLAYING}
                            key={gem.id}
                            gem={gem} />
                        ))}
            </GemContainer>
            {currentPlayer.roundStatus === PLAYER_ROUND_STATUS.DRAW_GEMS && (<>
                <DrawLabel>
                    Sélectionnez les gèmes que vous souhaitez échanger
                </DrawLabel>
                <GemContainer>
                    {currentPlayer.handGems.map((gem) => (
                        <GemSelect
                            key={gem.id}
                            color={gem.color}
                            selected={Boolean(selectedGems.find(selectedGem => selectedGem.id === gem.id))}
                            onClick={() => handleToggleGem(gem)}>
                            <LuGem />
                        </GemSelect>
                    ))}
                </GemContainer>
                <Button onClick={handleExchange}>
                    Échanger
                </Button>
            </>)}
        </Container>
    )
}

export default PlayerHand;