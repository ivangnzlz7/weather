const formulario = document.querySelector('#enviar');
const container = document.querySelector('#formulario');
const resultado2 = document.querySelector('.temperaturas div:first-child');
const resultado3 = document.querySelector('.temperaturas div:last-child');
const dias = document.querySelector('#parcial section div');
const body = document.querySelector('body');

const dotenv = require('dotenv');

dotenv.config();

var ahora = new Date();
var diaDeS = ahora.getDay();
var horas = ahora.getHours();

const dia = d => {
    return d == 0 ? 'Domingo' :
        d == 1 ? 'Lunes' :
            d == 2 ? 'Martes' :
                d == 3 ? 'Miercoles' :
                    d == 4 ? 'Jueves' :
                        d == 5 ? 'Viernes' :
                            d == 6 ? 'Sabado' :
                                'Undefined'
} 

function actualizarHora() {

    // Hora Local
    var now = new Date();
    var horas = now.getHours();
    var minutos = now.getMinutes();

    horas = horas < 10 ? '0' + horas : horas;
    minutos = minutos < 10 ? '0' + minutos : minutos;

    var tiempo = horas + ':' + minutos;
    return tiempo

}

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})

const paisesYCiudades = {
    AR: "Buenos aires",
    CO: "Bogota",
    CR: "San Jose",
    ES: "Madrid",
    US: "Washington D. C.",
    MX: "Ciudad de México",
    PE: "Lima",
    UY: "Montevideo",
    BR: "Brasilia",
    EC: "Quito",
    HN: "Tegucigalpa",
    BO: "Sucre",
    PY: "Asunción",
    NI: "Managua",
    GT: "Ciudad de Guatemala",
    SV: "San Salvador",
    PR: "San Juan"
}

function buscarClima(e) {
    e.preventDefault();


    // Validar
    let pais = document.querySelector('#pais').value;
    let ciudad = document.querySelector('#ciudad').value;

    if ([pais, ciudad].includes('')) {
        aviso('Los campos son obligatorios');
        return;
    }

    let letter = ciudad[0].toUpperCase()
    let ciuda2 = ciudad.slice(1, ciudad.length)
    let ciudadNueva = letter + ciuda2
    
    if (paisesYCiudades[pais] !== ciudadNueva) {
        aviso('El campo es incorrecto')
        return;
    }
    // Consultar la API

    consultarApi(ciudadNueva, pais);

}

function aviso(mensaje) {
    const alerta = document.querySelector('.error')

    if (!alerta) {
        // Crear una alerta
        const alerta = document.createElement('div');
        alerta.classList.add('error');

        alerta.innerHTML = `
        <p style="text-align: center; font-size: 22px; color: red;">${mensaje}</p>
        `
        container.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 6000);
    }
}

function consultarApi(ciudad, pais) {
    

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    spinnerC()

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML();
            limpiarClima();
            console.log(datos);
            if (datos.cod === '404') {
                aviso('Ciudad no encontrada');
                return
            }
            // Imprime la respuesta en el HTML
            mostrarClima(datos)
        })
}

const resultWeather = estado => {
    return estado === "Clear" ? '<img src=./imgWeather/bxs-sun.svg alt=sol id=weather>' :
        estado === "Rain" ? '<img src=./imgWeather/cloud-rain-solid.svg alt=lluvia id=weather>' :
            estado === "Clouds" ? '<img src=./imgWeather/cloud-solid.svg alt=nubes id=weather>' :
                estado === "Thunderstorm" ? '<img src=./imgWeather/poo-storm-solid.svg alt=tormentas id=weather>' :
                    estado === "Drizzle" ? '<img src=./imgWeather/bx-cloud-drizzle.svg alt=lluvioso id=weather>' :
                        'no se encontro ninguno';
}

function mostrarClima(datos) {
    const { main: { temp, temp_max, temp_min }, name, weather: [{ main }] } = datos

    const tempCurry = KelACen(temp);
    const tempMax = KelACen(temp_max);
    const tempMin = KelACen(temp_min);

    // Temperatura Maxima
    const max = document.createElement('h3');
    max.innerHTML = `Maxima: ${tempMax} º C`;
    resultado2.appendChild(max);

    // Temperatura minima
    const min = document.createElement('h3');
    min.innerHTML = `Minima: ${tempMin} º C`;
    resultado3.appendChild(min);


    // ciudad
    const city = document.createElement('h1');
    city.innerHTML = `${name}`
    dias.appendChild(city)

    // icon clima
    const iconWeather = document.createElement('span');
    iconWeather.innerHTML = resultWeather(main);
    dias.appendChild(iconWeather);

    // Temperatura Actual
    const actual = document.createElement('h3')
    actual.innerHTML = `${tempCurry} º C`;
    dias.appendChild(actual);

    // Mostrar dia
    const diaHoy = document.createElement('p');
    diaHoy.innerHTML = `${dia(diaDeS)}, ${actualizarHora()}`;
    dias.appendChild(diaHoy);


}

// Actualiza la hora cada segundo
setInterval(actualizarHora, 1000)

// Inicializa inmediatamente
actualizarHora();

// Obteniendo los grados
const KelACen = grados => Math.round(grados - 273.15);

function limpiarHTML() {
    while (dias.firstChild) {
        dias.removeChild(dias.firstChild);
    }
}

function limpiarClima() {
    while (resultado2.firstChild) {
        resultado2.removeChild(resultado2.firstChild);
        resultado3.removeChild(resultado3.firstChild);
    }
}

function spinnerC() {

    limpiarHTML()
    limpiarClima()

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    dias.appendChild(divSpinner)
}



