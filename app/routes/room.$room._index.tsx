import { useState } from 'react';
import { json, useNavigate, useParams } from "@remix-run/react";
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';

import { usePartySocket } from "partysocket/react";
import { useSocketConfig } from "~/context/SocketContext";
import type { LoaderFunctionArgs } from 'partymix';
import { getSession, commitSession } from '~/services/sessions';
import type { GameState, MessageFromClient } from 'messages';
import StratagemBoard from '~/components/StratagemBoard';
import { GAME_STATUS, PLAYER_ROUND_STATUS } from '~/game/constants';
import { TextHeading } from '~/components/TextHeading';
import { Flex, styled } from 'styled-system/jsx';
import { useUser } from '~/context/UserContext';
import PlayerHand from '~/components/PlayerHand';
import type { Cell, Gem } from '~/types/game';
import { useToast } from '~/hooks/useToast';
import GameResume from '~/components/GameResume';
import { GameContext } from '~/context/GameContext';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    );

    if (params.room) {
        session.set("lastRoomId", params.room);
    }

    return json({}, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

const HeadingTitle = styled(TextHeading, {
    base: {
        fontSize: '6xl',
    }
});

const Section = styled('section', {
    base: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem',
        alignSelf: 'flex-start',
    }
});

export default function GameRoom() {
    const { username, userId } = useUser();
    const { room } = useParams<{ room: string }>();
    const [gameState, setGameState] = useState<GameState | null>(null);

    const { host } = useSocketConfig();
    const navigate = useNavigate();
    const toast = useToast();

    const partySocket = usePartySocket({
        host,
        party: "game",
        room,
        query: { username, userId },
        onMessage(evt) {
            const data = JSON.parse(evt.data) as GameState;
            setGameState(data);

            if (data.status === GAME_STATUS.LOBBY) {
                navigate(`/room/${data.id}/lobby`);
            }

            const currentPlayerPreviousState = gameState?.players.find(player => player.id === userId);
            const currentPlayer = data?.players.find(player => player.id === userId);

            if (currentPlayerPreviousState?.roundStatus === PLAYER_ROUND_STATUS.WAITING
                && currentPlayer?.roundStatus === PLAYER_ROUND_STATUS.PLAYING
            ) {
                toast({
                    title: "À votre tour !",
                    subtitle: "Placez une gemme sur le plateau",
                })
            }

            if (gameState && !gameState.winner && data.winner) {
                toast({
                    title: "Partie terminée !",
                    subtitle: `${data.winner.username} a gagné !`,
                    mode: "info"
                });
            }
        },
    });

    if (!gameState) return <div>Loading...</div>;

    const currentPlayer = gameState.players.find(player => player.id === userId);

    if (!currentPlayer) return <div>Loading...</div>;

    const handleExchange = (gems: Gem[]) => {
        partySocket.send(JSON.stringify({
            type: 'exchange',
            userId: userId,
            gems
        }));
    }

    const handleDragEnd = (event: DragEndEvent) => {
        if (event.over && event.over.id.toString().startsWith('cell-')) {
            const cell = event.over.data.current as Cell;
            const gem = event.active.data.current as Gem;

            if (cell.isEnabled) {
                partySocket.send(JSON.stringify({
                    type: 'move',
                    userId: userId,
                    row: cell.row,
                    col: cell.col,
                    gem: gem
                } satisfies MessageFromClient));
            }
        }
    }

    const handlePlayAgain = () => {
        partySocket.send(JSON.stringify({
            type: 'play-again'
        } satisfies MessageFromClient));
    }

    return (
        <GameContext.Provider value={{ gameState }}>
            <Section>
                <HeadingTitle>
                    Stratagèmes
                </HeadingTitle>
                <DndContext onDragEnd={handleDragEnd}>
                    <Flex
                        direction={{
                            base: 'column',
                            md: 'row'
                        }}
                        gap="2rem"
                        width="100%">
                        <Flex
                            gap="2rem"
                            flex="1 1 60%"
                            direction="column">
                            <StratagemBoard />
                            <PlayerHand
                                onExchange={handleExchange}
                                currentPlayer={currentPlayer} />
                        </Flex>
                        <Flex direction="column">
                            <GameResume onPlayAgain={handlePlayAgain} />
                        </Flex>
                    </Flex>
                </DndContext>
            </Section>
        </GameContext.Provider>
    );
}