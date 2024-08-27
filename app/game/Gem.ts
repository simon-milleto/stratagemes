import type { CellColorType} from "./constants";
import { CELL_COLOR } from "./constants";
import { v4 as uuidv4 } from 'uuid';


export class Gem {
    public id: string;

    constructor(
        private color: CellColorType
    ) {
        this.id = uuidv4();
    }

    getColor(): CellColorType {
        return this.color;
    }

    setRandomColor(colors: CellColorType[] = [CELL_COLOR.RED, CELL_COLOR.BLUE, CELL_COLOR.GREEN]): void {
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    toString(): string {
        return this.color.charAt(0).toUpperCase() + this.color.slice(1);
    }

    static fromRandomColor(colors: CellColorType[] = [CELL_COLOR.RED, CELL_COLOR.BLUE, CELL_COLOR.GREEN]): Gem {
        return new Gem(colors[Math.floor(Math.random() * colors.length)]);
    }
    
    toJson() {
        return {
            id: this.id,
            color: this.color
        }
    }
}