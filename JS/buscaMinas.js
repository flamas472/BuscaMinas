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
        this.contenedor = document.createElement('div');
        this.contenedor.className = 'casilla';
        this.contiene = new CasillaOculta(this);
        this.contenedor.appendChild(this.contiene.contenido);
        this.contenedor.addEventListener('contextmenu', e => e.preventDefault());
        this.contenedor.addEventListener('selectionchange', e => e.preventDefault());
    }
    revelar() {
        
        if(this.estado == 'revelado') {
            //si ya esta revelada no hace nada
        } else if(this.estado == 'oculto'){
            //si está oculta cambio estado a revelado
            this.contenedor.removeChild(this.contiene.contenido);
            this.contenedor.className = 'casilla revelada';
            //this.contiene = null;
            this.estado = 'revelado';
            if(this.minasEnContacto == 0) {
                //si no tiene minas en contacto revelo adyacentes
                this.revelarAdyacentes();
            } else {
                //si tiene minas en contacto coloco el numero y el boton delante
                 //this.contenedor.innerText = this.minasEnContacto;
                 let numero = new CasillaNumero(this);
                 this.contenedor.append(numero.contenido);
            }
        }
        
    }
    revelarAdyacentes() {
        this.mapa.revelarAdyacentes(this.position);
    }
    ponerBanderita(e) {
        this.estado = 'banderita';
        this.contenedor.removeChild(this.contiene.contenido);
        this.contiene = new Banderita(this);
        this.contenedor.appendChild(this.contiene.contenido);
    }
    quitarBanderita() {
        this.estado = 'oculto';
        this.contenedor.removeChild(this.contiene.contenido);
        this.contiene = new CasillaOculta(this);
        this.contenedor.appendChild(this.contiene.contenido);
    }
    agregarMinaEnContacto() {
        this.minasEnContacto++;
    }
}
class CasillaMina extends Casilla {
    revelar() {
        if(this.estado != 'banderita') {
            this.contenedor.className = 'casilla revelada mina';
            this.contenedor.innerHTML = '<i class="fas fa-bomb"></i>';
            this.mapa.perder();
        } else {
        }
    }
}
//Refactorizar poner objetos en las casillas con referencia a la misma
class CasillaOculta {
    constructor(casilla) {
        this.casilla = casilla;
        this.contenido = document.createElement('div');
        this.contenido.style.height = '100%';
        this.contenido.style.width = '100%';
        this.contenido.className = 'casillaocultasdasd';
        this.contenido.addEventListener('click', this.clickIzquierdo.bind(this));
        this.contenido.addEventListener('contextmenu', this.clickDerecho.bind(this));
        
    }
    clickIzquierdo() {
        this.casilla.revelar();
    }
    clickDerecho(e) {
        e.preventDefault();
        this.casilla.ponerBanderita();
    }
}
class CasillaNumero {
    constructor(casilla) {
        this.casilla = casilla;
        this.contenido = document.createElement('div');
        this.contenido.innerText = casilla.minasEnContacto;
        this.contenido.className = 'contenido numero' + this.casilla.minasEnContacto;
        this.contenido.addEventListener('contextmenu', this.clickDerecho.bind(this));
    }
    clickDerecho(e) {
        e.preventDefault();
        this.casilla.revelarAdyacentes();
    }
}
class Banderita {
    constructor(casilla) {
        this.casilla = casilla;
        this.contenido = document.createElement('i');
        this.contenido.className = 'fas fa-flag';
        this.contenido.addEventListener('click', this.clickIzquierdo.bind(this));
    }
    clickIzquierdo() {
        this.casilla.quitarBanderita();
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
        this.cantidadDeMinas = cantidadDeMinas;
        this.minas = [];
        this.llenarMinas();
        this.llenarMapa(ancho, alto);
        this.contenedor = document.createElement('div');
        this.contenedor.id = 'map';
        this.llenarhtml();
        this.contenedor.style.width = 25*this.ancho + 'px';
        this.contenedor.style.height = 25*this.alto + 'px';
        this.contenedor.style.gridTemplate = 'repeat('+ alto +', 1fr)/repeat('+ ancho +', 1fr)';
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
                    poshtml = new CasillaMina(pos.x, pos.y, this);
                } else {
                    poshtml = new Casilla(pos.x, pos.y, this)
                }
                this.contenedor.appendChild(poshtml.contenedor);
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
        let adyacentes = position.adyacentes(this.ancho, this.alto);
        let minas = this.mapahtml[position.y][position.x].minasEnContacto;
        if(minas <= this.banderitasAdyacentes(position)) {
            //solo revela adyacentes si tiene en contacto tantas banderas como minas tiene
            adyacentes.forEach(pos => {
                this.mapahtml[pos.y][pos.x].revelar();
            })
        }
    }

    banderitasAdyacentes(position) {
        let adyacentes = position.adyacentes(this.ancho, this.alto);
        return adyacentes.reduce((banderitas, pos) => {
            if(this.mapahtml[pos.y][pos.x].estado == 'banderita') {
                banderitas++;
            }
            return banderitas;
        }, 0);
        let minas = this.mapahtml[position.y][position.x].minasEnContacto;

    }

    perder() {
        console.log('Perdiste');
        alert('PERDISTE');

    }

}

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'Styles.css';


document.getElementsByTagName('head')[0].appendChild(link);
const buscaMinas = document.getElementById("buscaMinas");
const mapa = new Mapa(16, 16, 40);
buscaMinas.appendChild(mapa.contenedor);


