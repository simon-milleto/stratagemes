import type { CellColorType} from "./constants";
import { CELL_COLOR } from "./constants";


export class Stone {
    constructor(
        private color: CellColorType
    ) { }

    getColor(): CellColorType {
        return this.color;
    }

    setRandomColor(colors: CellColorType[] = [CELL_COLOR.RED, CELL_COLOR.BLUE, CELL_COLOR.GREEN]): void {
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    toString(): string {
        return this.color.charAt(0).toUpperCase() + this.color.slice(1);
    }

    static fromRandomColor(colors: CellColorType[] = [CELL_COLOR.RED, CELL_COLOR.BLUE, CELL_COLOR.GREEN]): Stone {
        return new Stone(colors[Math.floor(Math.random() * colors.length)]);
    }
    
    toJson() {
        return {
            color: this.color
        }
    }
}