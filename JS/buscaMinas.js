class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return '(' + this.x + ',' + this.y + ')';
    }
}

class Casilla {
    contructor(x, y) {
        this.position = new Position(x, y);
        this.html = document.createElement('div');
        html.className = 'casilla';
        html.addEventListener('click', () => {
            html.style.backgroundColor = 'white';
            html.innerText = position.toString();
        });
        
    }

}

class Mapa {
    constructor(ancho, alto) {
        this.mapa = [];
        this.llenarMapa();
        this.html = document.createElement('div');
        this.html.id = 'map';

    }

    

    llenarMapa(ancho, alto) {
        for(let y = 0; y < alto; y++) {
            const thisRow = []
            for(let x = 0; x < ancho; x++) {
                thisRow.push(new Position(x, y));
            }
            mapa.push(thisRow);
        }
    }
}

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'Styles.css';
document.getElementsByTagName('head')[0].appendChild(link);
const buscaMinas = document.getElementById("buscaMinas");
const mapaHTML = document.createElement('div');
mapaHTML.id = 'map';
buscaMinas.appendChild(mapaHTML);

let ancho = 6;
let alto = 6;
const map = [];
for(let y = 0; y < alto; y++) {
    const thisRow = []
    for(let x = 0; x < ancho; x++) {
        thisRow.push(new Position(x, y));
    }
    map.push(thisRow);
}

mapaHTML.style.gridTemplate = 'repeat('+ alto +', 1fr)/repeat('+ ancho +', 1fr)';

map.forEach(row =>  {
    row.forEach(position => {
        let casilla = document.createElement('div');
        casilla.className = 'casilla';
        casilla.addEventListener('click', () => {
            casilla.style.backgroundColor = 'white';
            casilla.innerText = position.toString();
        });
        mapaHTML.appendChild(casilla);
    });
    
});