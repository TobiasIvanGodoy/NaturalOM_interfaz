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


function crearCampo(entrada, contenedor) {
    const campo = document.createElement("div");
    campo.className = "campo";

    const label = document.createElement("label");
    label.htmlFor = entrada.id;
    label.textContent = entrada.id;

    const input = document.createElement("input");
    input.id = entrada.id;
    input.type = entrada.tipo;
    input.placeholder = entrada.placeholder;

    campo.append(label, input);
    contenedor.appendChild(campo);
}

function nuevoProducto() {

    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);

    const cerrar = document.createElement("div");
    cerrar.classList.add("contenedorRow");
    cerrar.style.justifyContent = "flex-end";
    cerrar.style.width = "100%";
    contenedor.appendChild(cerrar);

    const btnCerrar = document.createElement("button");
    btnCerrar.id = "btnCerrar"
    btnCerrar.textContent = "X"
    cerrar.appendChild(btnCerrar)
    btnCerrar.addEventListener("click", function (){
        overlay.classList.add("oculto")
    })

    const inputs = [
            {id : "producto",
            tipo : "text",
            placeholder : "Ingrese el nombre del producto..."
    },
            {id: "precio",
            tipo: "number",
            placeholder : "Ingrese el precio..."
            },
            {id: "cantidad",
            tipo: "number",
            placeholder : "Ingrese el stock incial..."}
            ]

    for (const i of inputs) {
        crearCampo(i, contenedor);
    }

    const campo = document.createElement("div");
    campo.className = "campo";

    const label = document.createElement("label");
    label.htmlFor = "distribuidores";
    label.textContent = "distribuidor";

    const select = document.createElement("select");
    select.name = "distribuidores";
    select.style.width = "100%";
    select.id = "distribuidores";

    const ph = document.createElement("option");
    ph.textContent = "distribuidores agendados...";
    ph.value = "";
    ph.disabled = true;
    ph.selected = true;

    select.append(ph);


    //lógica del backend para buscar los distribuidores registrados

    campo.append(label, select);
    contenedor.appendChild(campo)

    const btnConfirmar = document.createElement("button");
    btnConfirmar.classList.add("btnAgregar")
    btnConfirmar.textContent = "Confirmar"
    contenedor.appendChild(btnConfirmar)
    btnConfirmar.addEventListener("click", function (){
        overlay.classList.add("oculto")
        //logica de guardado en el backend
    })

}


function reponerStock() {
    
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);

    const cerrar = document.createElement("div");
    cerrar.classList.add("contenedorRow");
    cerrar.style.justifyContent = "flex-end";
    cerrar.style.width = "100%";
    contenedor.appendChild(cerrar);

    const btnCerrar = document.createElement("button");
    btnCerrar.id = "btnCerrar"
    btnCerrar.textContent = "X"
    cerrar.appendChild(btnCerrar)
    btnCerrar.addEventListener("click", function (){
        overlay.classList.add("oculto")
    })

    const campo = document.createElement("div");
    campo.className = "campo";

    const label = document.createElement("label");
    label.htmlFor = "producto";
    label.textContent = "producto";

    const select = document.createElement("select");
    select.name = "producto";
    select.style.width = "100%";
    select.id = "producto";

    const ph = document.createElement("option");
    ph.textContent = "productos guardados...";
    ph.value = "";
    ph.disabled = true;
    ph.selected = true;

    select.append(ph);

    //lógica del backend para buscar los productos guardados

    campo.append(label, select);
    contenedor.appendChild(campo)

    const inputs = [
            {id : "cantidad",
            tipo : "number",
            placeholder : "Cantidad de stock repuesto..."
    },
            {id: "monto",
            tipo: "number",
            placeholder : "Costo de la reposición..."
            }
            ]

    for (const i of inputs) {
        crearCampo(i, contenedor);
    }

    const btnConfirmar = document.createElement("button");
    btnConfirmar.classList.add("btnAgregar")
    btnConfirmar.textContent = "Confirmar"
    contenedor.appendChild(btnConfirmar)
    btnConfirmar.addEventListener("click", function (){
        overlay.classList.add("oculto")
        //logica de guardado en el backend
    })

}

function añadirGasto() {
    
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);

    const cerrar = document.createElement("div");
    cerrar.classList.add("contenedorRow");
    cerrar.style.justifyContent = "flex-end";
    cerrar.style.width = "100%";
    contenedor.appendChild(cerrar);

    const btnCerrar = document.createElement("button");
    btnCerrar.id = "btnCerrar"
    btnCerrar.textContent = "X"
    cerrar.appendChild(btnCerrar)
    btnCerrar.addEventListener("click", function (){
        overlay.classList.add("oculto")
    })

    const campo = document.createElement("div");
    campo.className = "campo";

    const label = document.createElement("label");
    label.htmlFor = "categoria";
    label.textContent = "categoria";

    const select = document.createElement("select");
    select.name = "categoria";
    select.style.width = "100%";
    select.id = "categoria";

    const ph = document.createElement("option");
    ph.textContent = "categorias registradas...";
    ph.value = "";
    ph.disabled = true;
    ph.selected = true;

    select.append(ph);

    const nuevo = document.createElement("option");
    nuevo.textContent = "...";
    nuevo.value = "...";

    select.append(nuevo);

    //lógica del backend para buscar las categorias registradas

    campo.append(label, select);
    contenedor.appendChild(campo)

    const inputs = [
            {id: "monto",
            tipo: "number",
            placeholder : "Monto del gasto..."
            }
            ]

    for (const i of inputs) {
        crearCampo(i, contenedor);
    }

    const btnConfirmar = document.createElement("button");
    btnConfirmar.classList.add("btnAgregar")
    btnConfirmar.textContent = "Confirmar"
    contenedor.appendChild(btnConfirmar)
    btnConfirmar.addEventListener("click", function (){
        overlay.classList.add("oculto")
        //logica de guardado en el backend
    })

}

function agregarDistribuidor() {
    
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);

    const cerrar = document.createElement("div");
    cerrar.classList.add("contenedorRow");
    cerrar.style.justifyContent = "flex-end";
    cerrar.style.width = "100%";
    contenedor.appendChild(cerrar);

    const btnCerrar = document.createElement("button");
    btnCerrar.id = "btnCerrar"
    btnCerrar.textContent = "X"
    cerrar.appendChild(btnCerrar)
    btnCerrar.addEventListener("click", function (){
        overlay.classList.add("oculto")
    })

    const inputs = [
            {id: "nombre",
            tipo: "text",
            placeholder : "Nombre del distribuidor..."
            },
            {id: "dirección",
            tipo: "text",
            placeholder : "Dirección del distribuidor..."
            },
            {id: "página web",
            tipo: "text",
            placeholder : "Página web del distribuidor..."
            }
            ]

    for (const i of inputs) {
        crearCampo(i, contenedor);
    }

    const btnConfirmar = document.createElement("button");
    btnConfirmar.classList.add("btnAgregar")
    btnConfirmar.textContent = "Confirmar"
    contenedor.appendChild(btnConfirmar)
    btnConfirmar.addEventListener("click", function (){
        overlay.classList.add("oculto")
        //logica de guardado en el backend
    })

}

function crearGraficos() {
    //solo un placeholder para tener algo.
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);
    
    const btnConfirmar = document.createElement("button");
    btnConfirmar.classList.add("btnAgregar")
    btnConfirmar.textContent = "Confirmar"
    contenedor.appendChild(btnConfirmar)
    btnConfirmar.addEventListener("click", function (){
        overlay.classList.add("oculto")
    })


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

        modificarOverlay : nuevoProducto
    },

    {
        boton: btnMovStock,

        atributos: ["Categoria", "Producto", "Cantidad", "Monto", "Fecha", "Hora"],

        agregar: "Reponer stock",

        id: "tablaMovStock",

        modificarOverlay : reponerStock
    },

    {
        boton: btnGastos,

        atributos: ["Categoria", "Monto", "Fecha", "Hora"],

        agregar: "Añadir gasto",

        id: "tablaGastos",

        modificarOverlay : añadirGasto
    },

    {
        boton: btnDistribuidores,

        atributos: ["Nombre", "Dirección", "Página"],

        agregar: "Agregar distribuidor",

        id: "tablaDistribuidores",

        modificarOverlay : agregarDistribuidor
    },

    {
        boton: btnStats,

        atributos: [],

        agregar: "En construcción",

        id: "tablaEstadisticas",

        modificarOverlay : crearGraficos
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
        boton.classList.add("btnAgregar");

        boton.addEventListener("click", function(){
            overlay.innerHTML = "";
            overlay.classList.remove("oculto");
            configuracion.modificarOverlay();
        })
        seccionActual.appendChild(boton);
    })
}