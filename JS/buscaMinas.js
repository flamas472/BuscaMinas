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
        this.revelar = this.crearMapa;
        this.minasEnContacto = 0;
        this.estado = 'oculto';        
        this.contenedor = document.createElement('div');
        this.contenedor.className = 'casilla';
        this.contiene = new CasillaOculta(this);
        this.contenedor.appendChild(this.contiene.contenido);
        this.contenedor.addEventListener('contextmenu', e => e.preventDefault());
        this.contenedor.addEventListener('selectionchange', e => e.preventDefault());
    }
    llenarConMina() {
        this.revelar = this.revelarMina;
    }
    llenarConSegura() {
        this.revelar = this.revelarNumero;
    }
    crearMapa() {
        this.mapa.llenarCasillas(this.position);
        //aca debería llamar al mapa para que cree las minas
    }
    revelarNumero(doDefault = true) {
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
            if(doDefault) {
                this.mapa.revisarCasillasSeguras();
            }
        }
    }
    revelarMina(doDefault = true) {
        if(this.estado != 'banderita') {
            this.contenedor.className = 'casilla revelada mina';
            this.contenedor.innerHTML = '<i class="fas fa-bomb"></i>';
            if(doDefault) {
                this.contenedor.style.backgroundColor = 'red';
                this.mapa.perder();                
            }
        } else {
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

    alternarResaltar() {
        if(this.estado == 'oculto') {
            this.contenedor.classList.toggle('revelada');
        }
    }
    alternarResaltarAdyacentes() {
        this.mapa.alternarResaltarAdyacentes(this.position);
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
        //this.contenido.addEventListener('contextmenu', this.clickDerecho.bind(this));
        this.contenido.addEventListener('mousedown', this.mouseDown.bind(this));
        this.contenido.addEventListener('mouseup', this.mouseUp.bind(this));
    }
    clickDerecho(e) {
        e.preventDefault();
        this.casilla.revelarAdyacentes();

    }
    mouseDown(e) {
        e.preventDefault();
        if(e.button == 2) {
            this.casilla.alternarResaltarAdyacentes()
        }
    }
    mouseUp(e) {
        e.preventDefault();
        if(e.button == 2) {
            this.casilla.alternarResaltarAdyacentes()
            this.casilla.revelarAdyacentes();
        }
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

class Mapa {
    constructor(ancho = 9, alto = 9, cantidadDeMinas = 10) {
        this.ancho = ancho;
        this.alto = alto;
        this.matriz = [];
        if(cantidadDeMinas >= this.ancho * this.alto) {
            this.cantidadDeMinas = this.ancho * this.alto / 4;
        } else {
            this.cantidadDeMinas = cantidadDeMinas;
        }
        this.minas = [];
        this.llenarMatriz(ancho, alto);
        this.contenedor = document.createElement('div');
        this.contenedor.id = 'map';
        this.llenarMapa();
        this.contenedor.style.width = 25*this.ancho + 'px';
        this.contenedor.style.height = 25*this.alto + 'px';
        this.contenedor.style.gridTemplate = 'repeat('+ alto +', 1fr)/repeat('+ ancho +', 1fr)';
    }

    llenarMinas(positionIgnore = new Position(this.ancho, this.alto)) {
        while(this.minas.length < this.cantidadDeMinas) {
            this.añadirMina(positionIgnore);
        }
    }

    añadirMina(positionIgnore = new Position(this.ancho, this.alto)) {
        let x = Math.floor(Math.random()*this.ancho);
        let y = Math.floor(Math.random()*this.alto);
        let pos = new Position(x, y);
        if(this.minas.some(aPos => aPos.equals(pos)) || pos.equals(positionIgnore)) {
            console.log(pos.toString() + 'ignorado');
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

    llenarMatriz(ancho, alto) {
        for(let y = 0; y < alto; y++) {
            const thisRow = []
            for(let x = 0; x < ancho; x++) {
                thisRow.push(new Position(x, y));
            }
            this.matriz.push(thisRow);
        }
    }

    llenarMapa() {
        this.casillasSeguras = [];
        this.mapa = this.matriz.map(row => {
            let casillasRow = row.map(pos => {
                let casilla = new Casilla(pos.x, pos.y, this);
                if(this.hayMinaPos(pos)) {
                    //casilla.llenarConMina();
                } else {
                    //casilla.llenarConSegura();
                    //this.casillasSeguras.push(casilla);
                }
                this.contenedor.appendChild(casilla.contenedor);
                return casilla;
            });
            return casillasRow;
        });
        //this.minas.forEach(pos => this.actualizarCasillas(pos))
    }

    llenarCasillas(position) {
        this.llenarMinas(position);
        this.mapa.forEach(row => {
            row.forEach(casilla => {
                if(this.hayMinaPos(casilla.position)) {
                    casilla.llenarConMina();
                } else {
                    casilla.llenarConSegura();
                    this.casillasSeguras.push(casilla);
                }
            });
        });

        this.minas.forEach(pos => this.actualizarCasillas(pos));
        this.mapa[position.y][position.x].revelar();
    }

    actualizarCasillas(pos) {
        pos.adyacentes(this.ancho, this.alto).forEach(mina => {
            this.mapa[mina.y][mina.x].agregarMinaEnContacto();
        });
    }

    revelarAdyacentes(position) {
        let adyacentes = position.adyacentes(this.ancho, this.alto);
        let minas = this.mapa[position.y][position.x].minasEnContacto;
        if(minas <= this.banderitasAdyacentes(position)) {
            //solo revela adyacentes si tiene en contacto tantas banderas como minas tiene
            adyacentes.forEach(pos => {
                this.mapa[pos.y][pos.x].revelar();
            })
        }
    }

    alternarResaltarAdyacentes(position) {
        let adyacentes = position.adyacentes(this.ancho, this.alto);
        let minas = this.mapa[position.y][position.x].minasEnContacto;
        adyacentes.forEach(pos => {
            this.mapa[pos.y][pos.x].alternarResaltar();
        })
    }

    revelarMapa() {
        this.mapa.forEach(row => {
            row.forEach(casilla => {
                casilla.revelar(false);
            });
        });
    }

    banderitasAdyacentes(position) {
        let adyacentes = position.adyacentes(this.ancho, this.alto);
        return adyacentes.reduce((banderitas, pos) => {
            if(this.mapa[pos.y][pos.x].estado == 'banderita') {
                banderitas++;
            }
            return banderitas;
        }, 0);
        let minas = this.mapa[position.y][position.x].minasEnContacto;

    }

    perder() {
        
        this.revelarMapa();
        console.log('Perdiste');
        alert('PERDISTE');
    }

    ganar() {
        console.log('Ganaste');
        alert('GANASTE');
    }

    revisarCasillasSeguras() {
        if(this.casillasSeguras.every(casilla => casilla.estado == 'revelado')) {
            this.ganar();
        }
    }
}

class Buscaminas {
    constructor(id = 'buscaMinas') {
        //agregar hoja de estilos
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'Styles.css';
        document.getElementsByTagName('head')[0].appendChild(link);
        //obtener contenedor
        this.contenedor = document.getElementById(id);
        this.contenedor.style.display = 'flex';
        this.contenedor.style.flexDirection = 'column';
        //agregar botones
        this.contenedor.appendChild(this.insertarFormularioNuevoJuego());
        //this.insertarFormularioNuevoJuego();
        //this.contenedor.appendChild();

        //agregar mapa
        this.insertarNuevoMapa(9, 9, 10);
        //this.mapa = new Mapa(9, 9, 10);
        //this.contenedor.appendChild(this.mapa.contenedor);
    }

    insertarNuevoMapa(ancho = 9, alto = 9, minas = 10) {
        if(this.contenedor.childElementCount > 1) {
            this.contenedor.removeChild(this.mapa.contenedor);
        }

        this.mapa = new Mapa(ancho, alto, minas);
        this.contenedor.appendChild(this.mapa.contenedor);
    }

    insertarFormularioNuevoJuego() {
        let formNuevoJuego = document.createElement('form');

        let divAncho = document.createElement('div');
        let labelAncho = document.createElement('label');
        labelAncho.innerText = 'Ancho:';
        labelAncho.htmlFor = 'ancho';
        let inputAncho = document.createElement('input');
        inputAncho.id = 'ancho';
        inputAncho.type = 'number';
        inputAncho.value = '9';
        divAncho.appendChild(labelAncho);
        divAncho.appendChild(inputAncho);

        let divAlto = document.createElement('div');
        let labelAlto = document.createElement('label');
        labelAlto.innerText = 'Alto:';
        labelAlto.htmlFor = 'alto';
        let inputAlto = document.createElement('input');
        inputAlto.id = 'alto';
        inputAlto.type = 'number';
        inputAlto.value = '9';
        divAlto.appendChild(labelAlto);
        divAlto.appendChild(inputAlto);

        let divMinas = document.createElement('div');
        let labelMinas = document.createElement('label');
        labelMinas.innerText = 'Minas:';
        labelMinas.htmlFor = 'Minas';
        let inputMinas = document.createElement('input');
        inputMinas.id = 'Minas';
        inputMinas.type = 'number';
        inputMinas.value = '10';
        divMinas.appendChild(labelMinas);
        divMinas.appendChild(inputMinas);

        formNuevoJuego.appendChild(divAncho);
        formNuevoJuego.appendChild(divAlto);
        formNuevoJuego.appendChild(divMinas);

        let modificarNiveles = (ancho, alto, minas) => {
            inputAncho.value = ancho;
            inputAlto.value = alto;
            inputMinas.value = minas;

        }

        let nivel = document.createElement('div');
        let btnPrincipiante = document.createElement('button');
        btnPrincipiante.innerText = 'Principiante';
        btnPrincipiante.onclick = (e) => {
            e.preventDefault();
            modificarNiveles(9,9,10);
        };
        let btnIntermedio = document.createElement('button');
        btnIntermedio.innerText = 'Intermedio';
        btnIntermedio.onclick = (e) => {
            e.preventDefault();
            modificarNiveles(16,16,40);
        };
        let btnExperto = document.createElement('button');
        btnExperto.innerText = 'Experto';
        btnExperto.onclick = (e) => {
            e.preventDefault();
            modificarNiveles(30,16,99);
        };
        nivel.style.display = 'flex';
        nivel.appendChild(btnPrincipiante);
        nivel.appendChild(btnIntermedio);
        nivel.appendChild(btnExperto);
        formNuevoJuego.appendChild(nivel);

        let btnSubmit = document.createElement('input');
        btnSubmit.type = 'submit';
        btnSubmit.value = 'Nuevo Juego';
        formNuevoJuego.appendChild(btnSubmit);
        formNuevoJuego.style.display = 'flex';
        formNuevoJuego.style.flexDirection = 'column';
        formNuevoJuego.onsubmit = (e) => {
            e.preventDefault();
            if(inputMinas.value >= inputAncho.value * inputAlto.value) {
                alert('demasiadas minas');
            } else {
                this.insertarNuevoMapa(inputAncho.value, inputAlto.value, inputMinas.value);
            }
        }
        return formNuevoJuego;
    }
    

}



let buscaMinas = new Buscaminas('buscaMinas');
//const buscaMinas = document.getElementById("buscaMinas");
//const mapa = new Mapa(9, 9, 10);
//buscaMinas.appendChild(mapa.contenedor);


