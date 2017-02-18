class Player {
    pos: ClusterPos;
    constructor(){

    }
}

class ClusterPos {
    private _x: number;
    private _y: number;
    constructor(posX: number, posY:number) {
        this._x = posX;
        this._y = posY;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    set x(newX: number) {
        if (Number.isInteger(newX) && newX > 0) {
            this._x = newX;
        } else {
            throw new TypeError("cluster positions must be integers greater than 0");
        }
    }

    set y(newY: number) {
        if (Number.isInteger(newY) && newY > 0) {
            this._x = newY;
        } else {
            throw new TypeError("cluster positions must be integers greater than 0");
        }
    }

    add(pos2: ClusterPos): ClusterPos {
        return new ClusterPos(this._x + pos2.x, this._y + pos2.y);
    }
}

class Pos {
    x: number;
    y: number;
    constructor(posX: number, posY:number) {
        this.x = posX;
        this.y = posY;
    }
    
    add(pos2: Pos): Pos {
        return new Pos(this.x + pos2.x, this.y + pos2.y);
    }
}