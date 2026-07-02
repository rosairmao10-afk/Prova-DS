var ps = 15; // A variavel ps é a velocidade das raquetes dos players

var w = 600; // largura do campo
var h = 400; // altura do campo

var mapa = []; // guarda o estado das teclas
onkeydown = onkeyup = function (e) {
    e = e || event; // to deal with IE
    mapa[e.keyCode] = e.type == 'keydown';
}

var raq2 = document.getElementById('raquete2');
var raq1 = document.getElementById('raquete1');

function nfp(valor) {
    var n = parseFloat(valor);
    return isNaN(n) ? 0 : n;
}

// ==============================================
// | Função para as raquetes serem movimentadas |
// ==============================================

function movimentoRaquete() {

    // raquete2 -> setas cima/baixo
    if (mapa[38]) { // seta de cima
        if (nfp(raq2.style.top) - ps < 0)
            raq2.style.top = 0 + "px";
        else
            raq2.style.top = nfp(raq2.style.top) - ps + "px";
    }
    else if (mapa[40]) { // seta de baixo
        if (nfp(raq2.style.top) + ps > h - 200)
            raq2.style.top = h - 200 + "px";
        else
            raq2.style.top = nfp(raq2.style.top) + ps + "px";
    }

    // raquete1 -> teclas w/s
    if (mapa[87]) { // tecla w
        if (nfp(raq1.style.top) - ps < 0)
            raq1.style.top = 0 + "px";
        else
            raq1.style.top = nfp(raq1.style.top) - ps + "px";
    }
    else if (mapa[83]) { // tecla s
        if (nfp(raq1.style.top) + ps > h - 200)
            raq1.style.top = h - 200 + "px";
        else
            raq1.style.top = nfp(raq1.style.top) + ps + "px";
    }

    //40 seta baixo, 38 seta cima
    //letra w 87, letra s 83
}

setInterval(movimentoRaquete, 20);