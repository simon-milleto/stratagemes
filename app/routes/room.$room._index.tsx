import { useState } from 'react';
import { json, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { usePartySocket } from "partysocket/react";
import { useSocketConfig } from "~/context/SocketContext";
import type { LoaderFunctionArgs } from 'partymix';
import { getSession, commitSession } from '~/services/sessions';
import type { GameState } from 'messages';
import StratagemBoard from '~/components/StratagemBoard';
import { GAME_STATUS, type CellColorType } from '~/game/constants';
import { v4 as uuidv4 } from 'uuid';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    );

    if (params.room) {
        session.set("lastRoomId", params.room);
    }

    if (!session.has("userId")) {
        session.set("userId", uuidv4());
    }

    return json({
        username: session.get("username") || "New wizard",
        userId: session.get("userId"),
    }, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export default function GameRoom() {
    const { username, userId } = useLoaderData<typeof loader>();
    const { room } = useParams<{ room: string }>();
    const [gameState, setGameState] = useState<GameState | null>(null);

    const { host } = useSocketConfig();
    const navigate = useNavigate();

    usePartySocket({
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
        },
    });

    const onCellClick = (row: number, col: number, color: CellColorType) => {
        console.log(row, col, color);
    }

    if (!gameState) return <div>Loading...</div>;

    console.log(gameState);

    return (
        <div>
            <h1>Game Room: {room}</h1>
            <h2>Username: {username}</h2>
            <ul>
                <li>Nombre de joueurs: {gameState.players.length}</li>
                <li>Statut du jeu: {gameState.status}</li>
            </ul>
            {/* Render your game board here using gameState */}
            <StratagemBoard board={gameState} onCellClick={onCellClick} />
            {/* Add buttons or UI elements to call makeMove */}
        </div>
    );
}