window.onload = function() {
    // Assigne les événements aux canvas d'entrée

    var listCanIn = document.getElementsByClassName("in");
    var canOut = document.getElementsByClassName("out")[0];
    var model = new MODEL(listCanIn, canOut);

    var i;
    for (i = 0; i < listCanIn.length; i += 1) {
        let can = model[i];
        can.canvas.addEventListener("click", function(event) {
            if (!model.morphing) {
                if (can.settingAxis) {
                    drawAxis(event, can);
                } else {
                    draw(event, can);
                }
            }
        }, false);
    }

    // Assigne les événements aux boutons
    
    for (i = 0; i < model.length; i += 1) {
        let buttons = document.getElementsByClassName(i + 1);
        addEventToButtons(model[i], buttons);
    }

    var butAdd = document.getElementById("add");
    butAdd.addEventListener("click", function() {
        if (model.length < 5) {
            addCanvas(model, document.getElementById("thalassa"));
        } else {
            alert("Pas plus de 5, désolé.");
        }
    }, false);

    var butDel = document.getElementById("del");
    butDel.addEventListener("click", function() {
        if (model.length > 2) {
            delCanvas(model, document.getElementById("thalassa"));
        } else {
            alert("Laisses-en au moins 2, s'te plaît.");
        }
    }, false);

    // Assigne l'événement au canvas de sortie
    
    canOut.addEventListener("click", function() { 
        if (!model.morphing && model.atLeastOne) {
            morphing(model);
        }
    }, false);
};
