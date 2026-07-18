const url = "http://localhost:5000"

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


function crearBtnCerrar(contenedor) {

    const cerrar = document.createElement("div");
    cerrar.classList.add("contenedorRow");
    cerrar.style.justifyContent = "flex-end";
    cerrar.style.width = "100%";
    cerrar.style.height = "4vh";
    contenedor.appendChild(cerrar);

    const btnCerrar = document.createElement("button");
    btnCerrar.id = "btnCerrar";
    cerrar.appendChild(btnCerrar);

    const img = document.createElement("img");
    img.alt = "cerrar ventana";
    img.src = "diseño/btnCerrar.png";
    btnCerrar.appendChild(img)

    btnCerrar.addEventListener("click", function (){
        overlay.classList.add("oculto")
    })

}

// nuevo producto 

function nuevoProducto() {

    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);

    crearBtnCerrar(contenedor);

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

// reponer stock

function reponerStock() {
    
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);

    crearBtnCerrar(contenedor);

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

// añadir gasto

function añadirGasto() {
    
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);

    crearBtnCerrar(contenedor);

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

// agregar distribuidor

function agregarDistribuidor() {
    
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);

    crearBtnCerrar(contenedor);

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

// crear gráficos

function crearGraficos() {
    //solo un placeholder para tener algo.
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);
    
    crearBtnCerrar(contenedor);

}

// construccion de tablas 
async function operar(operacion, producto) {

}


function construirBtn(tipo, producto, imagen) {
    const boton = document.createElement("button");
    const img = document.createElement("img");
    img.alt = tipo;
    img.src = imagen;
    boton.append(img);

    boton.addEventListener("click", function() {
        operar(tipo, producto);
    })
    return boton
}

function mostrarProductos(registro) {
    const fila = document.createElement("tr");
    
    for (const celda in registro) {
        let valor = document.createElement("td")
        if (celda === "cantidad") {

            const btnMenos = construirBtn("btnMenos", registro["producto"], "diseño/btnMenos.png");

            const p = document.createElement("p");
            p.textContent = registro[celda];

            const btnMas = construirBtn("btnMas", registro["producto"], "diseño/btnMas.png");

            const elementos = [btnMenos, p, btnMas];

            for (const elem of elementos) {
                valor.append(elem)
            }
            
        } else {
            valor.textContent = registro[celda];
        }
        fila.append(valor)
    }
}

function mostrarTabla(registro) {
    const fila = document.createElement("tr");
    for (const celda of registro) {
        const valor = document.createElement("td")
        valor.textContent = celda;
        fila.append(valor)
    }
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

        modificarOverlay : nuevoProducto,

        titulo: "productos",

        ruta : "diseño/productos.png"
    },

    {
        boton: btnMovStock,

        atributos: ["Categoria", "Producto", "Cantidad", "Monto", "Fecha", "Hora"],

        agregar: "Reponer stock",

        id: "tablaMovStock",

        mostrarTabla: mostrarMovimientos,

        titulo: "movimientos",

        ruta : "diseño/mov_stock.png"
    },

    {
        boton: btnGastos,

        atributos: ["Categoria", "Monto", "Fecha", "Hora"],

        agregar: "Añadir gasto",

        id: "tablaGastos",

        modificarOverlay : añadirGasto,

        titulo: "gastos",

        ruta : "diseño/gastos.png"
    },

    {
        boton: btnDistribuidores,

        atributos: ["Nombre", "Dirección", "Página"],

        agregar: "Agregar distribuidor",

        id: "tablaDistribuidores",

        modificarOverlay : agregarDistribuidor,

        titulo: "distribuidores",

        ruta : "diseño/distribuidores.png"
    },

    {
        boton: btnStats,

        atributos: [],

        agregar: "En construcción",

        id: "tablaEstadisticas",

        modificarOverlay : crearGraficos,

        titulo: "graficos",

        ruta : "diseño/estadisticas.png"
    }
];

// ==========================================================================
// CONSTRUCCION DINÁMICA DE TABLAS
// ==========================================================================

for (const configuracion of botonesAgregados) {

    configuracion.boton.addEventListener("click", async function () {
        configuracion.boton.innerHTML = "";
        const tablaActual = document.createElement("div");
        tablaActual.id = "tablaActual";
        tablaActual.classList.add("contenedorTabla");

        for (const otraConfiguracion of botonesAgregados) {
            if (configuracion.boton !== otraConfiguracion.boton) {
                otraConfiguracion.boton.innerHTML = "";
                const img = document.createElement("img");
                img.alt = otraConfiguracion.titulo;
                img.src = otraConfiguracion.ruta;
                otraConfiguracion.boton.appendChild(img)
            }
        }
        configuracion.boton.textContent = configuracion.titulo;

        const tabla = document.createElement("table");
        
        tabla.id = configuracion.id;

        for (const atributo of configuracion.atributos) {
            const columna = document.createElement("th");
            columna.textContent = atributo;
            tabla.appendChild(columna);
        }

        if (configuracion.id !== btnStats) {
            const respuesta = await fetch(`${url}/obtener/${configuracion.id}`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            const datos = await respuesta.json();

            for (const registro of datos.registros) {
                if (configuracion.id === "tablaProductos") {
                    mostrarProductos(registro)
                } else {
                    mostrarTabla(registro)
                }
            }
        }
        
        tablaActual.appendChild(tabla);
        seccionActual.innerHTML = "";
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