import { Board } from './Board';
import { Gem } from './Gem';
import type { Player as PlayerJson, Gem as GemJson } from "~/types/game";
import type { CellColorType, PlayerGameStatus, PlayerRoundStatus, PlayerConnexionStatus } from "~/game/constants";
import { CELL_COLOR, PLAYER_GAME_STATUS, PLAYER_CONNEXION_STATUS, PLAYER_ROUND_STATUS} from "~/game/constants";

export class Player {
    private _board!: Board;
    gemWons: Gem[] = [];
    handGems: Gem[] = [];
    secretColor: CellColorType | null = null;
    gameStatus: PlayerGameStatus = PLAYER_GAME_STATUS.IN_LOBBY;
    connexionStatus: PlayerConnexionStatus = PLAYER_CONNEXION_STATUS.WAITING;
    roundStatus: PlayerRoundStatus = PLAYER_ROUND_STATUS.WAITING;
    isAdmin = false;

    constructor(
        private username: string,
        private id: string,
    ) {
    }

    set board(board: Board) {
        this._board = board;

        this.handGems = Array.from({
            length: Math.max(3, this.board.players.length)
        }, () => Gem.fromRandomColor(this.board.availableColors));
    }

    get board() {
        return this._board;
    }

    getId() {
        return this.id;
    }

    makeExchange(gems: GemJson[]) {
        console.log('player ' + this.username + ' exchanges ' + gems.length + ' gems');
        // Pick new gems of exchange
        for (const gem of gems) {
            this.handGems = this.handGems.filter(handGem => handGem.id !== gem.id);
            this.handGems.push(Gem.fromRandomColor(this.board.availableColors));
        }

        // Pick new gem of move
        while (this.handGems.length < this.board.availableColors.length) {
            console.log('player ' + this.username + ' has ' + this.handGems.length + ' gems. ADD ONE');
            this.handGems.push(Gem.fromRandomColor(this.board.availableColors));
        }

        this.roundStatus = PLAYER_ROUND_STATUS.WAITING;
    }

    getUsername(): string {
        return this.username;
    }

    makeMove(row: number, col: number, gem: GemJson): boolean {
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

        this.board.getCell(row, col)?.setColor(gem.color);

        // Remove the played gem
        this.handGems = this.handGems.filter(handGem => handGem.id !== gem.id);

        const capturedGems = this.board.captureCells(row, col, gem.color);
        this.gemWons.push(...capturedGems);

        const hasWon = this.checkWinCondition();

        if (hasWon) {
            this.board.winner = this;
        }

        this.roundStatus = PLAYER_ROUND_STATUS.DRAW_GEMS;

        return hasWon;
    }

    checkWinCondition(): boolean {
        if (this.board.checkWinCondition()) {
            return true;
        }

        // If 5 gem of the same color are captured, the player wins
        const countGems: Record<string, number> = {};
        for (const gem of this.gemWons) {
            countGems[gem.getColor()] = (countGems[gem.getColor()] || 0) + 1;
        }

        for (const color in countGems) {
            if (countGems[color] >= 5) {
                return true;
            }
        }


        return false;
    }

    printCurrentGems(): void {
        console.log('Player ' + this.username + ' has ' + this.gemWons.length + ' gems');
    }

    toJson(): PlayerJson {
        return {
            id: this.id,
            username: this.username,
            gemWons: this.gemWons.map((gem) => gem.toJson()),
            handGems: this.handGems.map((gem) => gem.toJson()),
            secretColor: this.secretColor,
            isAdmin: this.isAdmin,
            gameStatus: this.gameStatus,
            connexionStatus: this.connexionStatus,
            roundStatus: this.roundStatus
        }
    }
}
