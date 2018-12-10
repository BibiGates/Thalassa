// paint functions

function paintSeg(can, seg) {
    can.ctx.beginPath();
    can.ctx.lineWidth = 4.0;
    can.ctx.lineCap = "round";

    can.ctx.moveTo(seg.p1.x, seg.p1.y);
    can.ctx.lineTo(seg.p2.x, seg.p2.y);

    can.ctx.strokeStyle = seg.color;
    can.ctx.stroke();
}

function paintAxis(can) {
    if (can.axis.length === 2) {
        var seg = new Segment(can.axis[0], can.axis[1], "rgba(255,0,0,0.5)");
        paintSeg(can, seg.extend());
    }
}

function paintAll(can, out = false) {
    var i;
    for (i = 0; i < can.tab.length; i += 1) {
        let seg = can.tab[i];
        if (out) {
            let offset = window.pageYOffset;
            let p1 = new Point(seg.p1.x, seg.p1.y + offset);
            let p2 = new Point(seg.p2.x, seg.p2.y + offset);
            seg = new Segment(p1, p2);
        }

        paintSeg(can, seg);
    }
}

function repaint(model) {
    clearCanvas(model.out);
    paintAll(model.out, true);
}

function draw(event, can) {
    var pt = computeCoordinates(event);
    var tab = can.tab;
    var ind = tab.length - 1;

    var seg;
    if (tab.length === 0 || event.shiftKey) {
        if (tab.length !== 0 && tab[ind].isPoint) {
            tab.pop();
            clearCanvas(can);
            paintAll(can);
        }

        seg = new Segment(pt, pt);
    } else {
        seg = new Segment(tab[ind].p2, pt);

        if (can.lastIsPoint) {
            tab.pop();
        }
    }

    paintSeg(can, seg);
    tab.push(seg);

    can.redo = [];
}

function drawAxis(event, can) {
    var pt = computeCoordinates(event);
    
    if (can.axis.length === 1) {
        can.axis.push(pt);
        can.settingAxis = false;
        paintAxis(can);
    } else {
        can.axis.push(pt);
    }
}

// others

function computeCoordinates(event) {
    let offset = -5; // à cause du border des canvas;

    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left + offset;
    const y = event.clientY - rect.top + offset;

    return new Point(x, y);
}

function clearCanvas(can) {
    can.ctx.clearRect(0, 0, can.canvas.width, can.canvas.height);
}
