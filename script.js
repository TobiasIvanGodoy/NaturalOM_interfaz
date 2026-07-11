// botones 

const btnProducto = document.getElementById("btnProducto")
const btnMovimiento = document.getElementById("btnMovimiento")
const btnConfirmarP = document.getElementById("btnConfirmarP")
const btnConfirmarM = document.getElementById("btnConfirmarM")


// Variables

let saldo = document.getElementById("saldo")

// Tablas

const tablaProductos = document.getElementById("tablaProductos")
const tablaMovimientos = document.getElementById("tablaMovimientos")

// Otros

const mensaje = document.getElementById("mensaje")
const overlay = document.getElementById("overlay")
const agregarProducto = document.getElementById("agregarProducto")
const agregarMovimiento = document.getElementById("agregarMovimiento")

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.classList.remove("oculto")
    mensaje.classList.add(tipo)
}

btnProducto.addEventListener(
    "click",
    function () {
        overlay.classList.remove("oculto")
        agregarProducto.classList.remove("oculto")
    }
)

btnMovimiento.addEventListener(
    "click",
    function () {
        overlay.classList.remove("oculto")
        agregarMovimiento.classList.remove("oculto")
    }
)

btnConfirmarP.addEventListener(
    "click",
    function () {
        overlay.classList.add("oculto")
        agregarProducto.classList.add("oculto")
    }
)

btnConfirmarM.addEventListener(
    "click",
    function () {
        overlay.classList.add("oculto")
        agregarMovimiento.classList.add("oculto")
    }
)