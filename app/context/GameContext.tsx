import type { GameState } from "messages";
import { createContext, useContext } from "react";
import { GAME_STATUS } from "~/game/constants";

export const GameContext = createContext<{
    gameState: GameState
}>({
    gameState: {
        id: '',
        cells: [],
        size: 0,
        status: GAME_STATUS.LOBBY,
        players: [],
        playerToPlay: null,
        winner: null
    }
});

export const useGameState = () => useContext(GameContext);