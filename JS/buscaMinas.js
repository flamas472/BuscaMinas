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
        this.mapa = mapa;//referencia al mapa al cual pertenece|
        this.minasEnContacto = 0;
        this.estado = 'oculto';        
        this.html = document.createElement('div');
        this.html.className = 'casilla';
        let casillaOculta = new CasillaOculta(this);
        this.html.appendChild(casillaOculta.contenido);
        this.html.addEventListener('contextmenu', e => e.preventDefault());
        this.html.addEventListener('selectionchange', e => e.preventDefault());
    }

    revelar() {
        this.html.innerText = this.minasEnContacto;
        if(this.estado == 'oculto' && this.minasEnContacto == 0) {
            this.estado = 'revelado';
            this.mapa.revelarAdyacentes(this.position);
        } else {
            this.estado = 'revelado';
        }
        this.html.className = 'casilla revelada numero' + this.minasEnContacto;
    }

    ponerBanderita(e) {
        let banderita = new Banderita(this);
        this.html.appendChild(banderita.contenido);
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
        this.html.className = 'casilla revelada mina';
        this.html.innerHTML = '<i class="fas fa-bomb"></i>';
        //aca debería perder, recordar que tiene referencia al mapa (this.mapa)
    }
}
//Refactorizar poner objetos en las casillas con referencia a la misma

class CasillaOculta {
    constructor(casilla) {
        this.casilla = casilla;
        this.contenido = document.createElement('div');
        this.contenido.style.height = '100%';
        this.contenido.style.width = '100%';
        this.contenido.addEventListener('click', this.clickIzquierdo.bind(this));
        this.contenido.addEventListener('contextmenu', this.clickDerecho.bind(this));
        
    }

    clickIzquierdo() {
        this.casilla.html.removeChild(this.contenido);
        this.casilla.revelar();
    }
    clickDerecho(e) {
        e.preventDefault();
        this.casilla.html.removeChild(this.contenido);
        this.casilla.ponerBanderita();
    }
}
class CasillaMina {
    constructor(casilla) {
        this.casilla = casilla;

    }
}
class CasillaSegura {
    constructor(casilla) {
        this.casilla = casilla;
        this.contenido = document.createElement('div');
        this.contenido.innerText = casilla.minasEnContacto;
        this.contenido.className = 'casilla revelada numero' + this.minasEnContacto;
    }
}
class Banderita {
    constructor(casilla) {
        this.casilla = casilla;
        this.contenido = document.createElement('i');
        this.contenido.className = 'fas fa-flag';

        this.contenido.addEventListener('click', this.quitarBanderita.bind(this));
    }
    
    //quitarBanderita remueve la bandera y coloca nuevamente la casilla oculta
    quitarBanderita() {
        this.casilla.html.removeChild(this.contenido);
        let casillaOculta = new CasillaOculta(this.casilla);
        this.casilla.html.appendChild(casillaOculta.contenido);
    }
}

class Mina2 {
    constructor(casilla) {
        this.casilla = casilla;
        this.contenido = document.createElement('i');
        this.contenido.className = 'fas fa-bomb';
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
        this.html.style.width = 25*this.ancho + 'px';
        this.html.style.height = 25*this.alto + 'px';
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
const mapa = new Mapa(16, 16, 40);
buscaMinas.appendChild(mapa.html);


