import type { GameStatus, CellColorType } from '~/game/constants';
import type { Cell as CellJson } from "~/types/game";
import { DIRECTIONS, GAME_STATUS, CELL_COLOR, PLAYER_ROUND_STATUS, PLAYER_GAME_STATUS } from '~/game/constants';
import { Cell } from './Cell';
import type { Player } from './Player';
import { Gem } from './Gem';

export class Board {
    private cells: Cell[][] = [];
    public size = 0;
    public round = 0;
    public id: string;
    public availableColors: CellColorType[] = [CELL_COLOR.RED, CELL_COLOR.BLUE, CELL_COLOR.GREEN];
    public availablePlayerColors: CellColorType[] = [];
    public players: Player[] = [];
    public winner: Player | null = null;
    public status: GameStatus = GAME_STATUS.LOBBY;

    constructor(id: string) {
        this.id = id;
    }

    cleanupGame() {
        this.winner = null;
        this.round = 0;
        for (const player of this.players) {
            player.roundStatus = PLAYER_ROUND_STATUS.WAITING;
        }
    }

    startGame() {
        switch (this.players.length) {
            case 2:
            case 3:
                this.size = 5;
                break;
            case 4:
                this.availableColors.push(CELL_COLOR.YELLOW);
                this.size = 6;
                break;
            case 5:
                this.availableColors.push(CELL_COLOR.YELLOW, CELL_COLOR.BLACK);
                this.size = 6;
                break;
            case 6:
                this.availableColors.push(CELL_COLOR.YELLOW, CELL_COLOR.BLACK, CELL_COLOR.WHITE);
                this.size = 7;
                break;
            default:
                throw new Error('Invalid number of players');
        }

        this.availablePlayerColors = [...this.availableColors];
        this.cells = [];
        this.round = 0;

        for (let i = 0; i < this.size; i++) {
            this.cells[i
            ] = [];
            for (let j = 0; j < this.size; j++) {
                this.cells[i][j] = new Cell(CELL_COLOR.EMPTY, i, j);
            }
        }

        for (const player of this.players) {
            player.board = this;
            const indexColor = Math.floor(Math.random() * this.availablePlayerColors.length);
            player.secretColor = this.availablePlayerColors[indexColor];
            player.gameStatus = PLAYER_GAME_STATUS.IN_GAME;

            this.availablePlayerColors.splice(indexColor, 1);
        }

        this.status = GAME_STATUS.PLAYING;
    }

    randomPlayerStarts() {
        if (!this.getCurrentPlayer()) {
            const indexPlayer = Math.floor(Math.random() * this.players.length);
            this.players[indexPlayer].roundStatus = PLAYER_ROUND_STATUS.PLAYING;
        }
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    removePlayerById(id: string) {
        this.players = this.players.filter(player => player.getId() !== id);
    }

    getPlayerById(id: string): Player | undefined {
        return this.players.find(player => player.getId() === id);
    }

    getNextPlayer(): Player | null {
        const currentPlayerIndex = this.players.findIndex(player => player.roundStatus !== PLAYER_ROUND_STATUS.WAITING);
        
        if (currentPlayerIndex === -1) return null;

        return this.players[(currentPlayerIndex + 1) % this.players.length];
    }

    getCurrentPlayer(): Player | null {
        const currentPlayerIndex = this.players.findIndex(player => player.roundStatus !== PLAYER_ROUND_STATUS.WAITING);

        if (currentPlayerIndex === -1) return null;

        return this.players[currentPlayerIndex];
    }

    ensureAdminIsSet() {
        const adminPlayer = this.players.find(player => player.isAdmin);
        const firstPlayer = this.players[0];
        if (!adminPlayer && firstPlayer) {
            firstPlayer.isAdmin = true;
        }
    }

    getCenter(): Cell | null {
        return this.cells[Math.floor(this.size / 2)][Math.floor(this.size / 2)];
    }

    cellIsEnabled(row: number, col: number): boolean {
        const cell = this.getCell(row, col);
        if (!cell) return false;

        const surroundingColors = this.getSurroundingColors(row, col);

        const hasSurrondingColors = surroundingColors.some(color => color !== CELL_COLOR.EMPTY)

        return (
            (this.round !== 0 || cell === this.getCenter()) &&
            (this.round === 0 || hasSurrondingColors) &&
            cell.getColor() === CELL_COLOR.EMPTY
        )
    }

    getCurrentCellsState(): CellJson[][] {
        return this.cells.map((row) => row.map((cell) => {
            cell.isEnabled = this.cellIsEnabled(cell.getRow(), cell.getCol());

            return cell.toJson();
        }));
    }

    getCells(): Cell[][] {
        return this.cells;
    }

    getCell(row: number, col: number): Cell | null {
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            return this.cells[row][col];
        }

        return null;
    }


    getSurroundingColors(row: number, col: number): CellColorType[] {
        return Object.keys(DIRECTIONS).map(key => {
            const [dx, dy] = DIRECTIONS[key as keyof typeof DIRECTIONS];
            return this.getCell(row + dx, col + dy)?.getColor();
        }).filter(color => color !== undefined) as CellColorType[];
    }

    captureCells(row: number, col: number, playerColor: CellColorType): Gem[] {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        const capturedGem: Gem[] = [];
        for (const [dx, dy] of directions) {
            capturedGem.push(...this.checkCapture(row, col, dx, dy, playerColor));
        }

        return capturedGem;
    }

    checkCapture(row: number, col: number, dx: number, dy: number, playerColor: CellColorType): Gem[] {
        let x = row + dx;
        let y = col + dy;
        const capturedCells: [number, number][] = [];
        const gemWons: Gem[] = [];

        while (true) {
            const cell = this.getCell(x, y);
            if (!cell) break;

            if (cell.getColor() === CELL_COLOR.EMPTY) break;
            if (capturedCells.length >= 2) break;
            if (cell.getColor() === playerColor) {
                // Capture all cells between
                for (const [cx, cy] of capturedCells) {
                    gemWons.push(new Gem(this.getCell(cx, cy)!.getColor()));

                    this.getCell(cx, cy)!.setColor(CELL_COLOR.EMPTY);
                }
                break;
            }

            capturedCells.push([x, y]);
            x += dx;
            y += dy;
        }

        return gemWons;
    }

    checkWinCondition(): boolean {
      const directions = [
        [0, 1],  // horizontal
        [1, 0],  // vertical
        [1, 1],  // diagonal down-right
        [1, -1]  // diagonal down-left
      ];

      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          const currentColor = this.cells[row][col].getColor();
          if (currentColor === CELL_COLOR.EMPTY) continue;

          for (const [dx, dy] of directions) {
            if (this.checkLine(row, col, dx, dy, currentColor)) {
              return true;
            }
          }
        }
      }

      return false;
    }

    private checkLine(row: number, col: number, dx: number, dy: number, color: CellColorType): boolean {
      for (let i = 0; i < 4; i++) {
        const cell = this.getCell(row + i * dx, col + i * dy);
        if (!cell || cell.getColor() !== color) {
          return false;
        }
      }
      return true;
    }

    getGameState() {
        return {
            id: this.id,
            cells: this.getCurrentCellsState(),
            players: this.players.map((player) => player.toJson()),
            size: this.size,
            status: this.status,
            playerToPlay: this.getCurrentPlayer()?.toJson() || null,
            winner: this.winner?.toJson() || null,
        }
    }
}
