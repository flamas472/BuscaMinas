
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'Styles.css';
document.getElementsByTagName('head')[0].appendChild(link);

const buscaMinas = document.getElementById("buscaMinas");


const mapaHTML = document.createElement('div');
mapaHTML.id = 'map';
buscaMinas.appendChild(mapaHTML);

let ancho = 10;
let alto = 10;

mapaHTML.style.gridTemplate = 'repeat('+ alto +', 1fr)/repeat('+ ancho +', 1fr)';
for(let i = 0; i < ancho*alto;i++) {
    let casilla = document.createElement('div');
    casilla.className = 'casilla';
    casilla.addEventListener('click', () => {
        casilla.style.backgroundColor = 'white';
    });
    mapaHTML.appendChild(casilla);
}

