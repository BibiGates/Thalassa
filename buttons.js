function clear(can) {
    clearCanvas(can);
    can.tab = [];
    can.redo = [];
    can.axis = [];
}

function undo(can) {
    if (can.tab.length > 0) {
        can.redo.push(can.tab.pop());
        clearCanvas(can);
        paintAxis(can);
        paintAll(can);
    }
}

function redo(can) {
    if (can.redo.length > 0) {
        can.tab.push(can.redo.pop());
        clearCanvas(can);
        paintAxis(can);
        paintAll(can);
    }
}

function paste(can) {
    console.log("Pas encore fait");
}

function vertSymTab(tab) {
    var res = []

    var i;
    for (i = 0; i < tab.length; i += 1) {
        res.push(tab[i].verticalSymmetry(200));
    }

    return (res);
}

function vertSym(can) {
    can.tab = vertSymTab(can.tab);
    clearCanvas(can);
    paintAll(can);

    can.redo = vertSymTab(can.redo);
}

function horizSymTab(tab) {
    var res = []

    var i;
    for (i = 0; i < tab.length; i += 1) {
        res.push(tab[i].horizontalSymmetry(150));
    }

    return (res);
}

function horizSym(can) {
    can.tab = horizSymTab(can.tab);
    clearCanvas(can);
    paintAll(can);

    can.redo = horizSymTab(can.redo);
}

function setAxis(can) {
    can.axis = [];
    clearCanvas(can);
    paintAll(can);
    can.settingAxis = true;
}

function pointSym(pt, a, b, c) { // pour ax + by = c, une équation cartésienne d'une droite
    var cm = a * pt.x + b * pt.y;
    var n = a * a + b * b;
    var x = pt.x + 2 * a * (c - cm) / n;
    var y = pt.y + 2 * b * (c - cm) / n;

    return new Point(x, y);
}

function axisSymTab(tab, axis) {
    var res = [];

    const a = -axis.p2.y + axis.p1.y;
    const b = axis.p2.x - axis.p1.x;
    const c = a * axis.p1.x + b * axis.p1.y;

    var i;
    for (i = 0; i < tab.length; i += 1) {
        let p1 = pointSym(tab[i].p1, a, b, c);
        let p2 = pointSym(tab[i].p2, a, b, c);

        res.push(new Segment(p1, p2));
    }

    return (res);
}

function axisSym(can) {
    if (can.axis.length === 2) {
        var seg = new Segment(can.axis[0], can.axis[1], "rgba(255,0,0,0.5)");

        can.tab = axisSymTab(can.tab, seg);
        clearCanvas(can);
        paintAll(can);
        paintSeg(can, seg.extend());

        can.redo = axisSymTab(can.redo, seg);
    }
}

// ################################################### //

function addEventToButtons(can, buttons) {
    var funcs = [clear, vertSym, horizSym, undo, setAxis, redo, axisSym];
    var i;
    for (i = 0; i < buttons.length; i += 1) {
        !function(_i) {
            buttons[i].addEventListener("click", function() { funcs[_i](can); }, false);
        }(i);
    }
}
function createFirstTr(texts, model) {
    var tr = document.createElement("tr");
    var td = document.createElement("td");

    td.setAttribute("rowspan", "3");
    td.setAttribute("colspan", "2");

    var canvas = document.createElement("canvas");

    canvas.setAttribute("class", "in");
    canvas.setAttribute("width", "400");
    canvas.setAttribute("height", "300");

    td.appendChild(canvas);
    tr.appendChild(td);

    model.addCan(canvas);

    tr.appendChild(createBtnTd(texts[0], model.length));
    td = createBtnTd(texts[1], model.length);
    td.appendChild(createBtnTd(texts[2], model.length).firstChild);
    tr.appendChild(td);

    return (tr);
}
function createBtnTd(text, ind) {
    var td = document.createElement("td");
    var but = document.createElement("button");
    but.setAttribute("class", ind);
    but.textContent = text;

    td.appendChild(but);

    return (td);
}

function addCanvas(model, table) {
    var before = document.getElementById("bef");

    // Increase out canvas values
    var out = document.getElementById("out");
    out.setAttribute("rowspan", Number(out.getAttribute("rowspan")) + 3);
    out.firstElementChild.setAttribute("height", Number(out.firstElementChild.getAttribute("height")) + 320);

    var texts = ["Clear", "Vert. Sym.", "Horiz. Sym", "Undo", "Set Axis", "Redo", "Axis Sym."];

    var tr = createFirstTr(texts, model);

    table.insertBefore(tr, before);

    var i;
    for (i = 3; i < texts.length; i += 2) {
        tr = document.createElement("tr");
        tr.appendChild(createBtnTd(texts[i], model.length));
        tr.appendChild(createBtnTd(texts[i + 1], model.length));

        table.insertBefore(tr, before);
    }

    var c = model[model.length - 1];
    c.canvas.addEventListener("click", function(event) {
        if (!model.morphing) {
            if (c.settingAxis) {
                drawAxis(event, c);
            } else {
                draw(event, c);
            }
        }
    }, false);
    addEventToButtons(c, document.getElementsByClassName(model.length));
}

function delCanvas(model) {
    var bef = document.getElementById("bef");
    var i;
    for (i = 0; i < 3; i += 1) {
        let prevSib = bef.previousElementSibling;
        prevSib.parentNode.removeChild(prevSib);
    }

    var out = document.getElementById("out");
    out.setAttribute("rowspan", Number(out.getAttribute("rowspan")) - 3);
    out.firstElementChild.setAttribute("height", Number(out.firstElementChild.getAttribute("height")) - 320);

    model.delCan();
}

function changeStateButtons(val) {
    var buttons = document.getElementsByTagName("BUTTON");

    var i;
    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].disabled = !val;
    }
}
