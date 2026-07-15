// ==========================================================================
// BOTONES
// ==========================================================================

const btnProducto = document.getElementById("btnProducto");
const btnMovStock = document.getElementById("btnMovStock");
const btnGastos = document.getElementById("btnGastos");
const btnDistribuidores = document.getElementById("btnDistribuidores");
const btnStats = document.getElementById("btnStats");

// ==========================================================================
// CONTENEDORES
// ==========================================================================

const seccionActual = document.getElementById("seccionActual");
const saldo = document.getElementById("saldo");
const overlay = document.getElementById("overlay");

// ==========================================================================
// FUNCIONES
// ==========================================================================

function cerrarMenu(elementos) {
    overlay.classList.add("oculto");

    for (const elemento of elementos) {
        elemento.remove();
    }
}

function crearCampo(id, placeholder, tipo) {

    const campo = document.createElement("div");
    campo.className = "campo";

    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = id;

    const input = document.createElement("input");
    input.id = id;
    input.type = tipo;
    input.placeholder = placeholder;

    campo.append(label, input);
    contenedor.appendChild(campo);

    return campo;
}

function abrirMenu(diccionario) {

    const elementos = [];

    for (const id in diccionario) {

        const placeholder = diccionario[id][0];
        const tipo = diccionario[id][1];

        const campo = crearCampo(id, placeholder, tipo);

        elementos.push(campo);
    }

    return elementos;
}

function crearBoton(id, texto, contenedor, clases = []) {

    const boton = document.createElement("button");

    boton.id = id;
    boton.textContent = texto;

    boton.classList.add(...clases);

    contenedor.appendChild(boton);

    return boton;
}

function modificarOverlay() {
    
}
// ==========================================================================
// CONFIGURACIÓN
// ==========================================================================

const botonesAgregados = [

    {
        boton: btnProducto,

        atributos: ["Producto", "Precio", "Cantidad", "Distribuidor"],

        agregar: "Nuevo producto",

        id: "tablaProductos",

        campos: []
    },

    {
        boton: btnMovStock,

        atributos: ["Categoria", "Producto", "Cantidad", "Monto", "Fecha"],

        agregar: "Reponer stock",

        id: "tablaMovStock"
    },

    {
        boton: btnGastos,

        atributos: ["Categoria", "Monto", "Fecha"],

        agregar: "Añadir gasto",

        id: "tablaGastos"
    },

    {
        boton: btnDistribuidores,

        atributos: ["Nombre", "Dirección", "Página"],

        agregar: "Agregar distribuidor",

        id: "tablaDistribuidores"
    },

    {
        boton: btnStats,

        atributos: [],

        agregar: "En construcción",

        id: "tablaEstadisticas"
    }
];

// ==========================================================================
// CONSTRUCCION DINÁMICA DE TABLAS
// ==========================================================================

for (const configuracion of botonesAgregados) {

    configuracion.boton.addEventListener("click", function () {
        seccionActual.innerHTML = "";
        const tablaActual = document.createElement("div");
        tablaActual.id = "tablaActual";
        tablaActual.classList.add("contenedorTabla");

        const tabla = document.createElement("table");
        
        tabla.id = configuracion.id;

        for (const atributo of configuracion.atributos) {
            const columna = document.createElement("th");
            columna.textContent = atributo;
            tabla.appendChild(columna);
        }

        tablaActual.appendChild(tabla);
        seccionActual.appendChild(tablaActual);

        const boton = document.createElement("button");
        boton.textContent = configuracion.agregar;
        boton.id = "btnAgregar";

        boton.addEventListener("click", function(){
            modificarOverlay();
        })
        seccionActual.appendChild(boton);
    })
}