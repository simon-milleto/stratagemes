import type { CellColorType, GameStatus, RoundStatus } from "~/game/constants"

export type Stone = {
    color: CellColorType
}

export type Player = {
    id: string
    username: string
    stoneWons: Stone[]
    handStones: Stone[]
    secretColor: CellColorType | null
    isAdmin: boolean
}

export type Cell = {
    color: CellColorType
    row: number
    col: number
    isEnabled: boolean
}

export type Board = {
    id: string
    cells: Cell[][]
    size: number
    status: GameStatus
    roundStatus: RoundStatus
    players: Player[]
    currentPlayer: Player | null
}