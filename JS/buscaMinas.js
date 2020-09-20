class Position {
    constructor(x, y) {
        
        this.x = x;
        this.y = y;
    }
    toString() {
        return '(' + this.x + ',' + this.y + ')';
    }
    distancia(pos) {
        return Math.abs(this.x - pos.x) + Math.abs(this.y - pos.y)
    }
    equals(pos) {
        return this.distancia(pos) == 0;
    }
    adyacentes(ancho, alto) {
        let posicionesAdyacentes = [];
        posicionesAdyacentes.push(new Position(this.x-1, this.y-1));
        posicionesAdyacentes.push(new Position(this.x-1, this.y));
        posicionesAdyacentes.push(new Position(this.x-1, this.y+1));
        posicionesAdyacentes.push(new Position(this.x, this.y-1));
        posicionesAdyacentes.push(new Position(this.x, this.y+1));
        posicionesAdyacentes.push(new Position(this.x+1, this.y-1));
        posicionesAdyacentes.push(new Position(this.x+1, this.y));
        posicionesAdyacentes.push(new Position(this.x+1, this.y+1));

        return posicionesAdyacentes.filter(pos => {
            let dentro = true;
            if(pos.x < 0 || pos.y < 0 || pos.x == ancho || pos.y == alto) {
                dentro = false;
            }
            return dentro;
        });
    }
}

class Casilla {
    
    constructor(x, y, mapa) {
        this.position = new Position(x, y);
        this.mapa = mapa;
        this.minasEnContacto = 0;
        this.estado = 'oculto';
        this.html = document.createElement('div');
        this.html.className = 'casilla';
        this.html.addEventListener('click', this.revelar.bind(this));
        this.html.addEventListener('contextmenu', this.ponerBanderita.bind(this));
        
    }

    revelar() {
        
        this.html.style.backgroundColor = 'white';
        this.html.innerText = this.minasEnContacto;
        if(this.estado == 'oculto' && this.minasEnContacto == 0) {
            this.estado = 'revelado';
            this.mapa.revelarAdyacentes(this.position);
        } else {
            this.estado = 'revelado';
        }
        //this.html.removeEventListener('click', )
        return 'casilla';
    }

    ponerBanderita(e) {
        e.preventDefault();
        this.html.innerHTML = '<i class="fas fa-flag"></i>';
        this.estado = 'bandera';
    }

    agregarMinaEnContacto() {
        this.minasEnContacto++;
    }
}

class Mina extends Casilla {
    constructor(x, y) {
        super(x, y);
    }
    revelar() {
        this.html.style.backgroundColor = 'red';
        this.html.innerHTML = '<i class="fas fa-bomb"></i>';
        //perder
        return 'mina';
    }
}

class Mapa {
    constructor(ancho, alto, cantidadDeMinas = Math.floor((ancho + alto) / 2 +1)) {
        this.ancho = ancho;
        this.alto = alto;
        this.mapa = [];
        //this.mapahtml = [];
        this.cantidadDeMinas = cantidadDeMinas;
        this.minas = [];
        this.llenarMinas();
        this.llenarMapa(ancho, alto);
        this.html = document.createElement('div');
        this.html.id = 'map';
        //this.llenarhtml();
        this.llenarhtml();
        this.html.style.gridTemplate = 'repeat('+ alto +', 1fr)/repeat('+ ancho +', 1fr)';
    }

    llenarMinas() {
        while(this.minas.length < this.cantidadDeMinas) {
            this.añadirMina();
        }
    }

    añadirMina() {
        let x = Math.floor(Math.random()*this.ancho);
        let y = Math.floor(Math.random()*this.alto);
        let pos = new Position(x, y);
        if(this.minas.some(aPos => aPos.equals(pos))) {
        } else {
            this.minas.push(pos);
        }
        
    }

    hayMinaPos(position) {
        return this.minas.some(pos => pos.equals(position));
    }

    hayMinaXY(x, y) {
        return this.hayMinaPos(new Position(x, y));
    }

    llenarMapa(ancho, alto) {
        for(let y = 0; y < alto; y++) {
            const thisRow = []
            for(let x = 0; x < ancho; x++) {
                thisRow.push(new Position(x, y));
            }
            this.mapa.push(thisRow);
        }
    }

    llenarhtml() {
        this.mapahtml = this.mapa.map(row => {
            let rowhtml = row.map(pos => {
                let poshtml;
                if(this.hayMinaPos(pos)) {
                    poshtml = new Mina(pos.x, pos.y, this);
                } else {
                    poshtml = new Casilla(pos.x, pos.y, this)
                }
                this.html.appendChild(poshtml.html);
                return poshtml;
            });
            return rowhtml;
        });
        this.minas.forEach(pos => this.actualizarCasillas(pos))
    }

    actualizarCasillas(pos) {
        pos.adyacentes(this.ancho, this.alto).forEach(mina => {
            this.mapahtml[mina.y][mina.x].agregarMinaEnContacto();
        });
    }

    revelarAdyacentes(position) {
        position.adyacentes(this.ancho, this.alto).forEach(pos => {
            this.mapahtml[pos.y][pos.x].revelar();
        })
    }

}

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'Styles.css';


document.getElementsByTagName('head')[0].appendChild(link);
const buscaMinas = document.getElementById("buscaMinas");
const mapa = new Mapa(9,9);
buscaMinas.appendChild(mapa.html);


