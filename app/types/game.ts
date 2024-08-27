import type { CellColorType, GameStatus, PlayerRoundStatus, PlayerStatus } from "~/game/constants"

export type Gem = {
    color: CellColorType
    id: string
}

export type Player = {
    id: string
    username: string
    gemWons: Gem[]
    handGems: Gem[]
    secretColor: CellColorType | null
    isAdmin: boolean
    status: PlayerStatus
    roundStatus: PlayerRoundStatus
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
    players: Player[]
    playerToPlay: Player | null
}