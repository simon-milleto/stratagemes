import type { CellColorType } from "./constants";

export class Cell {
    public isEnabled = false;

    constructor(
        private color: CellColorType,
        private row: number,
        private col: number
    ) { }

    getColor(): CellColorType {
        return this.color;
    }

    setColor(color: CellColorType): void {
        this.color = color;
    }

    getRow(): number {
        return this.row;
    }

    getCol(): number {
        return this.col;
    }

    clone(): Cell {
        return new Cell(this.color, this.row, this.col);
    }

    toJson() {
        return {
            color: this.color,
            row: this.row,
            col: this.col,
            isEnabled: this.isEnabled
        }
    }
}