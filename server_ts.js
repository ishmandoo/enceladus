class Player {
    constructor() {
    }
}
class ClusterPos {
    constructor(posX, posY) {
        this._x = posX;
        this._y = posY;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    set x(newX) {
        if (Number.isInteger(newX) && newX > 0) {
            this._x = newX;
        }
        else {
            throw new TypeError("cluster positions must be integers greater than 0");
        }
    }
    set y(newY) {
        if (Number.isInteger(newY) && newY > 0) {
            this._x = newY;
        }
        else {
            throw new TypeError("cluster positions must be integers greater than 0");
        }
    }
    add(pos2) {
        return new ClusterPos(this._x + pos2.x, this._y + pos2.y);
    }
}
class Pos {
    constructor(posX, posY) {
        this.x = posX;
        this.y = posY;
    }
    add(pos2) {
        return new Pos(this.x + pos2.x, this.y + pos2.y);
    }
}
