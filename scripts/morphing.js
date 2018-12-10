const RATE = 15;
const STEP = 0.005;

function morphing(model) {
    var currStep = 0, currCan = 0, inc = 1;
    var tab1 = model[0].tab, tab2 = model[1].tab;

    model.morphing = true;
    changeStateButtons(false);

    addPointIfEmpty(model);

    var dif = tab2.length - tab1.length;

    if (dif > 0) {
        tab1 = addPointsSegs(tab1, dif);
    } else if (dif < 0) {
        tab2 = addPointsSegs(tab2, -dif);
    }

    var id = setInterval(function() {
        model.out.tab = nextStep(tab1, tab2, currStep);
        repaint(model);

        currStep += STEP;
        if (currStep > 1 + STEP) {
            currStep = 0;
            currCan += inc;

            if (currCan >= model.length - 1 || currCan <= 0) {
                if (inc === 1) {
                    inc = -inc;
                    tab1 = model[currCan].tab;
                    tab2 = model[currCan + inc].tab;
                } else {
                    clearInterval(id);
                    model.morphing = false;
                    changeStateButtons(true);
                }
            }

            if (currCan + inc >= 0) {
                tab1 = model[currCan].tab;
                tab2 = model[currCan + inc].tab;

                dif = tab2.length - tab1.length;
                if (dif > 0) {
                    tab1 = addPointsSegs(tab1, dif);
                } else if (dif < 0) {
                    tab2 = addPointsSegs(tab2, -dif);
                }
            }
        }
    }, RATE);
}

function nextStep(tab1, tab2, s) {
    var res = [];

    var i;
    for (i = 0; i < tab1.length; i += 1) {
        res.push(tab1[i].average(tab2[i], s));
    }

    return (res);
}

function addPointsSeg(seg, div) {
    if (div <= 0) {
        return [seg];
    }

    var res = [];
    var j, mids = seg.split(div + 1);
    
    res.push(new Segment(seg.p1, mids[0]));
    for (j = 1; j < div; j += 1) {
        res.push(new Segment(mids[j - 1], mids[j]));
    }
    res.push(new Segment(mids[div - 1], seg.p2));

    return (res);
}

function addPointsSegs(tab, n) {
    var res = [];

    var div = parseInt(n / tab.length) ;
    var rest = n % tab.length;

    var i;
    if (rest === 0) {
        for (i = 0; i < tab.length; i += 1) {
            res = res.concat(addPointsSeg(tab[i], div));
        }
    } else {
        for (i = 0; i < tab.length; i += 1) {
            res = res.concat(addPointsSeg(tab[i], (i < rest? div + 1 : div)));
        }
    }

    return (res);
}

function addPointIfEmpty(model) {
    var p = new Point(200, 150);

    var i;
    for (i = 0; i < model.length; i += 1) {
        if (model[i].tab.length === 0) {
            model[i].tab.push(new Segment(p, p));
            paintAll(model[i]);
        }
    }
}
