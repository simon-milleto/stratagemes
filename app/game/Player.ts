import { Board } from './Board';
import { Stone } from './Stone';
import type { Player as PlayerJson } from "~/types/game";
import type { CellColorType } from "~/game/constants";
import {CELL_COLOR} from "~/game/constants";

export class Player {
    private _board!: Board;
    stoneWons: Stone[] = [];
    handStones: Stone[] = [];
    secretColor: CellColorType | null = null;
    hasWon = false;
    isAdmin = false;

    constructor(
        private username: string,
        private id: string,
    ) {
    }

    set board(board: Board) {
        this._board = board;

        this.handStones = Array.from({
            length: Math.max(3, this.board.players.length)
        }, () => Stone.fromRandomColor(this.board.availableColors));
    }

    get board() {
        return this._board;
    }

    getId() {
        return this.id;
    }

    hasRedStone(): boolean {
        return this.handStones.some(stone => stone.getColor() === CELL_COLOR.RED);
    }

    hasBlueStone(): boolean {
        return this.handStones.some(stone => stone.getColor() === CELL_COLOR.BLUE);
    }

    hasGreenStone(): boolean {
        return this.handStones.some(stone => stone.getColor() === CELL_COLOR.GREEN);
    }

    hasYellowStone(): boolean {
        return this.handStones.some(stone => stone.getColor() === CELL_COLOR.YELLOW);
    }

    hasBlackStone(): boolean {
        return this.handStones.some(stone => stone.getColor() === CELL_COLOR.BLACK);
    }

    hasWhiteStone(): boolean {
        return this.handStones.some(stone => stone.getColor() === CELL_COLOR.WHITE);
    }

    getusername(): string {
        return this.username;
    }

    makeMove(row: number, col: number, color: CellColorType): boolean {
        const surroundingColors = this.board.getSurroundingColors(row, col);

        if (this.board.round === 0) {
            if (row !== this.board.getCenter()!.getRow() || col !== this.board.getCenter()!.getCol()) {
                console.log('Invalid move, you must place your piece in the center on the first move');
                return false;
            }
        } else if (!surroundingColors.some(color => color !== CELL_COLOR.EMPTY)) {
            console.log('Invalid move, no cell next to you');
          return false;
        }

        this.board.getCell(row, col)?.setColor(color);

        this.handStones
            .find(stone => stone.getColor() === color)!
            .setRandomColor(this.board.availableColors);

        this.board.round++;

        const capturedStones = this.board.captureCells(row, col, color);
        this.stoneWons.push(...capturedStones);

        this.hasWon = this.checkWinCondition();

        return this.hasWon;
    }

    checkWinCondition(): boolean {
        if (this.board.checkWinCondition()) {
            return true;
        }

        // If 5 stone of the same color are captured, the player wins
        const countStones: Record<string, number> = {};
        for (const stone of this.stoneWons) {
            countStones[stone.getColor()] = (countStones[stone.getColor()] || 0) + 1;
        }

        for (const color in countStones) {
            if (countStones[color] >= 5) {
                return true;
            }
        }


        return false;
    }

    printCurrentStones(): void {
        console.log('Player ' + this.username + ' has ' + this.stoneWons.length + ' stones');
    }

    toJson(): PlayerJson {
        return {
            id: this.id,
            username: this.username,
            stoneWons: this.stoneWons.map((stone) => stone.toJson()),
            handStones: this.handStones.map((stone) => stone.toJson()),
            secretColor: this.secretColor,
            isAdmin: this.isAdmin, 
        }
    }
}
