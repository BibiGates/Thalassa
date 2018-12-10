function Point(x, y) {
    Object.defineProperty(this, "x",
        {
            value: x,
            writable: false,
            enumerable: true,
            configurable: false
        });

    Object.defineProperty(this, "y",
        {
            value: y,
            writable: false,
            enumerable: true,
            configurable: false
        });
}

Point.prototype.horizontalSymmetry = function(n) {
    return new Point(this.x, 2 * n - this.y);
};

Point.prototype.verticalSymmetry = function(n) {
    return new Point(2 * n - this.x, this.y);
};

Point.prototype.average = function(p, alpha) {
    var x = this.x * (1 - alpha) + p.x * alpha;
    var y = this.y * (1 - alpha) + p.y * alpha;
    return new Point(x, y);
};

Point.prototype.clone = function() {
    return new Point(this.x, this.y);
};

function Segment(p1, p2, c = "rgb(0, 0, 0)") {
    Object.defineProperty(this, "p1",
        {
            value: p1,
            writable: false,
            enumerable: true,
            configurable: false
        });

    Object.defineProperty(this, "p2",
        {
            value: p2,
            writable: false,
            enumerable: true,
            configurable: false
        });

    Object.defineProperty(this, "color",
        {
            value: c,
            writable: false,
            enumerable: true,
            configurable: false
        });

    Object.defineProperty(this, "isPoint",
        {
            get: function() {
                return (this.p1.x === this.p2.x && this.p1.y === this.p2.y);
            }
        });
}

Segment.prototype.horizontalSymmetry = function(n) {
    var p1 = this.p1.horizontalSymmetry(n);
    var p2 = this.p2.horizontalSymmetry(n);

    return new Segment(p1, p2, this.color);
};

Segment.prototype.verticalSymmetry = function(n) {
    var p1 = this.p1.verticalSymmetry(n);
    var p2 = this.p2.verticalSymmetry(n);

    return new Segment(p1, p2, this.color);
};

Segment.prototype.average = function(p, alpha) {
    var p1 = this.p1.average(p.p1, alpha);
    var p2 = this.p2.average(p.p2, alpha);

    return new Segment(p1, p2, this.color);
};

Segment.prototype.split = function(n) {
    var pts = [];

    var i;
    for (i = 1; i < n; i += 1) {
        let x = ((n - i) * this.p1.x + i * this.p2.x) / n;
        let y = ((n - i) * this.p1.y + i * this.p2.y) / n;
        pts.push(new Point(x, y));
    }
    
    return (pts);
};

Segment.prototype.coefDir = function() {
    return (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
};

Segment.prototype.valAtZero = function() {
    return (this.p1.y - (this.coefDir() * this.p1.x));
}

Segment.prototype.extend = function() {
    var a = this.coefDir();
    
    if (a >= 50 || a <= -50) {
        return new Segment(new Point(this.p1.x, 0), new Point(this.p1.x, 300), this.color);
    }
    if (a >= -1 / 50 && a <= 1 / 50) {
        return new Segment(new Point(0, this.p1.y), new Point(400, this.p1.y), this.color);
    }

    var b = this.valAtZero();

    var p1 = new Point(0, b);
    var p2 = new Point(400, a * 400 + b);

    return new Segment(p1, p2, this.color);
}

function Can(canvas) {
    this.tab = [];
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.redo = [];

    Object.defineProperty(this, "lastIsPoint", {
        get: function() {
            return (this.tab[this.tab.length - 1].isPoint);
        }
    });

    this.settingAxis = false;
    this.axis = [];
}

function MODEL(listCanIn, canOut) {
    var i;
    for (i = 0; i < listCanIn.length; i += 1) {
        Object.defineProperty(this, i, {
            value: new Can(listCanIn[i]),
            writable: false,
            enumerable: true,
            configurable: true
        });
    }

    Object.defineProperty(this, "atLeastOne", {
        get: function() {
            let i;
            for (i = 0; i < this.length; i += 1) {
                if (this[i].tab.length !== 0) {
                    return (true);
                }
            }

            return (false);
        }
    });

    this.length = listCanIn.length;
    this.out = new Can(canOut);
    this.morphing = false;
}

MODEL.prototype.addCan = function(can) {
    Object.defineProperty(this, this.length, {
        value: new Can(can),
        writable: false,
        enumerable: true,
        configurable: true
    });

    this.length += 1;
};

MODEL.prototype.delCan = function() {
    this.length -= 1;
    this[this.length] = undefined;
}
