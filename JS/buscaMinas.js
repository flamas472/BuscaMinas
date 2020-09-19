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
}

class Casilla {
    
    constructor(x, y) {
        //this.minasEnContacto = 0;
        
        this.position = new Position(x, y);
        this.html = document.createElement('div');
        this.html.className = 'casilla';
        this.html.addEventListener('click', this.revelar.bind(this));
        this.html.addEventListener('contextmenu', this.ponerBanderita.bind(this));
        
    }
    
    
    revelar() {
        this.html.style.backgroundColor = 'white';
        this.html.innerText = this.position.toString();
        //this.html.removeEventListener('click', )
        return 'casilla';
    }

    ponerBanderita(e) {
        e.preventDefault();
        this.html.innerHTML = '<i class="fas fa-flag"></i>';
    }
}

class Mina extends Casilla {
    constructor(x, y) {
        super(x, y);
    }
    revelar() {
        this.html.style.backgroundColor = 'red';
        this.html.innerHTML = '<i class="fas fa-bomb"></i>';
        return 'mina';
    }
}


class Mapa {
    constructor(ancho, alto, cantidadDeMinas = (ancho + alto) / 2 +1) {
        this.mapa = [];
        this.minas = [new Position(1,1), new Position(1,1), new Position(1,1),new Position(1,1)];
        //this.cantidadDeMinas = 
        this.llenarMapa(ancho, alto);
        this.html = document.createElement('div');
        this.html.id = 'map';
        this.llenarhtml();
        this.html.style.gridTemplate = 'repeat('+ alto +', 1fr)/repeat('+ ancho +', 1fr)';
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
        this.mapa.forEach(row =>  {
            row.forEach(position => {

                let casilla = new Casilla(position.x, position.y);
                if(position.x == position.y) {
                    this.html.appendChild((new Mina(position.x, position.y)).html);
                } else {
                    this.html.appendChild(casilla.html);
                }
            });
            
        });
    }
}

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'Styles.css';


document.getElementsByTagName('head')[0].appendChild(link);
const buscaMinas = document.getElementById("buscaMinas");
const mapa = new Mapa(6, 6, 3);
buscaMinas.appendChild(mapa.html);


