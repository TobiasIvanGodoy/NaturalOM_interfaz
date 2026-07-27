`Tareas restantes:
Todo el tema de graficos y dataScience
modularizar.(siempre se puede modularizar más)
`

const url = "http://localHost:5000"

const btnProducto = document.getElementById("btnProducto");
const btnMovStock = document.getElementById("btnMovStock");
const btnGastos = document.getElementById("btnGastos");
const btnDistribuidores = document.getElementById("btnDistribuidores");
const btnStats = document.getElementById("btnStats");

const seccionActual = document.getElementById("seccionActual");
const saldo = document.getElementById("saldo");
saldo.style.fontSize = "2vh";
const overlay = document.getElementById("overlay");

async function mostrarbalance() {
    const saldo = document.getElementById("saldo")

    const respuesta = await fetch(`${url}/balance`, 
        {method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        }
    )

    const datos = await respuesta.json()

    saldo.textContent = `$${datos.balance}`
}

mostrarbalance()

// configuraciones 
const botonesAgregados = [

    {
        boton: btnProducto,

        atributos: ["producto", "precio", "cantidad", "distribuidor"],

        agregar: "Nuevo producto",

        id: "tablaProductos",

        modificarOverlay : nuevoProducto,

        titulo: "productos",

        ruta : "diseño/productos.png"
    },

    {
        boton: btnMovStock,

        atributos: ["fecha", "hora", "categoria", "producto", "cantidad", "monto"],

        agregar: "Reponer stock",

        id: "tablaMovStock",

        modificarOverlay : nuevoMovimiento,

        titulo: "movimientos",

        ruta : "diseño/mov_stock.png"
    },

    {
        boton: btnGastos,

        atributos: ["fecha", "hora", "categoria", "monto"],

        agregar: "Añadir gasto",

        id: "tablaGastos",

        modificarOverlay : nuevoGasto,

        titulo: "gastos",

        ruta : "diseño/gastos.png",

        Claves : ["fecha", "hora"]
    },

    {
        boton: btnDistribuidores,

        atributos: ["distribuidor", "direccion", "pagina"],

        agregar: "Agregar distribuidor",

        id: "tablaDistribuidores",

        modificarOverlay : nuevoDistribuidor,

        titulo: "distribuidores",

        ruta : "diseño/distribuidores.png"
    },

    {
        boton: btnStats,

        agregar: "En construcción",

        id: "tablaEstadisticas",

        modificarOverlay : nuevoGraficos,

        titulo: "graficos",

        ruta : "diseño/estadisticas.png"
    }
];

// constructor dinámico

for (const configuracion of botonesAgregados) {


    configuracion.boton.addEventListener("click", async function () {
        configuracion.boton.innerHTML = "";
        const tablaActual = document.createElement("div");
        tablaActual.id = "tablaActual";
        tablaActual.classList.add("contenedorTabla");

        for (const otraConfiguracion of botonesAgregados) {
            if (configuracion.boton !== otraConfiguracion.boton) {
                otraConfiguracion.boton.innerHTML = "";
                otraConfiguracion.boton.style.backgroundColor = "white";
                otraConfiguracion.boton.style.borderRadius = "0";
                const img = document.createElement("img");
                img.alt = otraConfiguracion.titulo;
                img.src = otraConfiguracion.ruta;
                otraConfiguracion.boton.appendChild(img)
            }
            else {
            configuracion.boton.textContent = configuracion.titulo;
            configuracion.boton.style.backgroundColor = "rgba(144, 238, 144, 0.6)"
            configuracion.boton.style.borderRadius = "1vh";
            }
        }


        const tabla = document.createElement("table");
        
        tabla.id = configuracion.id;

        if (configuracion.boton !== btnStats) {
            await recargarTabla(configuracion.atributos, tabla, configuracion.titulo)
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
            configuracion.modificarOverlay(configuracion.atributos, tabla, configuracion.titulo);
        })

        seccionActual.appendChild(boton);
    })
}

async function recargarTabla(atributos, tabla, titulo) {
    tabla.innerHTML = "";
    
    for (const atributo of atributos) {
        const columna = document.createElement("th");
        columna.textContent = atributo;
        tabla.appendChild(columna);
    }

    const respuesta = await fetch(`${url}/obtener/${titulo}`,
        {
            method: "GET",

            headers: {
                "Content-Type": "application/json"
            }
        }
    )

    const datos = await respuesta.json();
    console.log("Registros recibidos:", datos.registros)

    for (const registro of datos.registros) {
        mostrar(registro, tabla, titulo, atributos)
    }
    mostrarbalance()
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

function mostrar(registro, tabla, titulo, atributos) {
    const fila = document.createElement("tr");
    
    for (const atributo of atributos) {
        let valor = document.createElement("td")
        if (atributo === "cantidad" && titulo === "productos") {
            const div = document.createElement("div")
            div.classList.add("celda")

            const btnMenos = construirBtn("restar", registro["producto"], "diseño/btnMenos.png","Cantidad que se vendío...", atributo);

            const p = document.createElement("p");
            p.textContent = registro[atributo];

            const btnMas = construirBtn("sumar", registro["producto"], "diseño/btnMas.png", "Cantidad que entra...", atributo)

            const elementos = [btnMenos, p, btnMas];

            for (const elem of elementos) {
                div.append(elem)
            }

            valor.append(div)
        } else if (atributo === "precio") {

            const div = document.createElement("div")
            div.classList.add("celda")

            const p = document.createElement("p");
            p.textContent = registro[atributo];

            const vacio = document.createElement("p")

            const btnEditar = construirBtn("precio", registro["producto"], "diseño/btnEditar.png", "Nuevo precio...", atributo)

            const elementos = [vacio, p, btnEditar];

            for (const elem of elementos) {
                div.append(elem);
            }

            valor.append(div)

        } else  if (atributo === "monto") {
            let dinero = Number(registro[atributo])
            if (dinero >= 0) {
                valor.classList.add("ganancia");
                valor.textContent = dinero
            } else {
                dinero = dinero * (-1);
                valor.textContent = dinero;
                valor.classList.add("gasto");
            }
        } else if (atributo === "pagina") {
            const a = document.createElement("a")
            a.href = registro[atributo];
            a.textContent = registro[atributo];
            valor.append(a)
            
        } else if (atributo === "hora") {
            valor.textContent = registro[atributo].slice(0, 5);
        } else {
            valor.textContent = registro[atributo];
        }
        fila.append(valor)
    }

    if (titulo === "productos") {
        eliminar(fila,registro["producto"], "producto", titulo, atributos, tabla)
    } else if (titulo === "distribuidores") {
        eliminar(fila,registro["distribuidor"], "distribuidor", titulo, atributos, tabla)
    } else {
        eliminar(fila,[registro["fecha"], registro["hora"]], ["fecha","hora"], titulo, atributos, tabla)
    } 

    tabla.appendChild(fila);
}

function construirBtn(tipo, producto, imagen, placeholder, atributo) {
    const boton = document.createElement("button");
    const img = document.createElement("img");
    boton.style.backgroundColor = "rgba(0, 0, 0, 0)";
    boton.style.border = "none";
    img.alt = tipo;
    img.src = imagen;
    img.style.height = "3vh";
    img.style.opacity = "80%";
    boton.append(img);
    

    boton.addEventListener("click", function(){
        overlay.innerHTML = "";
        overlay.classList.remove("oculto");
        const contenedor = document.createElement("div");
        contenedor.classList.add("contenedorMenu");
        overlay.appendChild(contenedor);

        crearBtnCerrar(contenedor);

        crearCampo({id:tipo, 
                    tipo: "number", 
                    placeholder: placeholder}, 
                    contenedor);

        let seleccionado = false;

        if (tipo === "restar") {
            

            const espacio = document.createElement("div")
            espacio.style.display = "flex";
            espacio.style.flexDirection = "row";
            espacio.style.alignItems = "center";
            espacio.style.width = "100%";
            espacio.style.gap = "1vw"

            const venta = document.createElement("button");
            venta.style.borderStyle = "solid";
            venta.style.width = "3vh";
            venta.style.aspectRatio = "1/1";
            venta.textContent = " ";
            venta.addEventListener("click", function() {
                seleccionado = !seleccionado
                if (seleccionado) {
                    venta.style.backgroundColor = "rgba(144, 238, 144, 0.6)";
                } else {
                    venta.style.backgroundColor = "white";
                }
            })

            const p = document.createElement("p");
            p.textContent = "Añadir venta";
            
            espacio.append(venta)
            espacio.append(p)
            contenedor.append(espacio)
        }

        const btnConfirmar = document.createElement("button");
        btnConfirmar.classList.add("btnAgregar")
        btnConfirmar.textContent = "Confirmar"
        contenedor.appendChild(btnConfirmar)
        btnConfirmar.addEventListener("click", function (){
            let cant = Number(document.getElementById(tipo).value)

            if (tipo === "restar") {
                cant = cant * (-1)
            }

            operar(tipo, "PATCH", producto, "productos", "producto", cant, seleccionado);
            recargarTabla(botonesAgregados[0].atributos, document.getElementById("tablaProductos"), "productos")
        })
    })
    return boton
}

async function eliminar(fila, elemento, atributo, tabla, atributos, tablaActual) {
    const td = document.createElement("td");
    const btnEliminar = document.createElement("button");
    btnEliminar.style.width = "100%";
    btnEliminar.style.height = "4vh";
    btnEliminar.classList.add("btnEliminar");
    td.style.backgroundColor = "rgb(255,0,0,0.7)";
    const img = document.createElement("img");
    img.alt = "eliminar";
    img.src = "diseño/btnEliminar.png";
    img.style.height = "3vh";
    btnEliminar.append(img);
    td.append(btnEliminar);

    btnEliminar.addEventListener("click", function() {
                overlay.innerHTML = "";
        overlay.classList.remove("oculto");
        const contenedor = document.createElement("div");
        contenedor.classList.add("contenedorMenu");
        overlay.appendChild(contenedor);

        crearBtnCerrar(contenedor);

        const btnConfirmar = document.createElement("button");
        btnConfirmar.classList.add("btnAgregar")
        btnConfirmar.style.backgroundColor = "red";
        btnConfirmar.textContent = "Sí, eliminar"
        contenedor.appendChild(btnConfirmar)
        btnConfirmar.addEventListener("click", function (){
            operar("eliminar", "DELETE", elemento, tabla, atributo, 0);
            
            recargarTabla(atributos, tablaActual, tabla)
        })
    })

    fila.appendChild(td);

}

async function operar(operacion, metodo, elemento, tabla, atributo, cant, valor) {
    
    const respuesta = await fetch(
        `${url}/modificar/${operacion}`,
        {method: metodo,
        headers: {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            parametro: atributo,
            elem : elemento,
            tabla: tabla,
            cant : cant,
            valor : valor 
        })
        }
    )

    const datos = await respuesta.json()

    if (datos.estado === "ok"){
        overlay.classList.add("oculto");
    }
    
}

async function buscarOpciones(tabla, atributo) {

    const respuesta = await fetch(
        `${url}/buscar`,
        {method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            tabla: tabla,
            atributo: atributo
        })
        }
    )

    const datos = await respuesta.json()

    if (datos.estado === "ok") {
        return datos.opciones
    }
}
// Especificas

async function enviarProductos(contenedor) {
    const inputProducto = document.getElementById("producto").value
    const inputCantidad = document.getElementById("cantidad").value
    const inputPrecio = document.getElementById("precio").value
    const inputDistribuidores = document.getElementById("distribuidores").value

    if (inputProducto && inputCantidad && inputPrecio && inputDistribuidores) {
        const respuesta = await fetch(
            `${url}/enviarProductos`,
            {method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    producto : inputProducto,
                    precio : inputPrecio,
                    cantidad : inputCantidad,
                    distribuidor : inputDistribuidores
                })
            }
        )
        const datos = await respuesta.json();
        
        if (datos.estado === "ok") {
            overlay.classList.add("oculto")
        } 
    }
    else {
        const mensaje = document.createElement("p");
        mensaje.classList.add("info")
        mensaje.textContent = "No se permiten campos vacios";
        contenedor.appendChild(mensaje)
            setTimeout(() => {
                mensaje.textContent = "";
                mensaje.style.display = "none";
            }, 2000)
    }
}

async function nuevoProducto(atributos, tabla, titulo) {

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


    const opciones = await buscarOpciones("distribuidores", "distribuidor")

    for (const opcion of opciones) {
            const categoria = document.createElement("option");
            categoria.textContent = opcion;
            categoria.value = opcion;
            select.append(categoria);
    }

    campo.append(label, select);
    contenedor.appendChild(campo)

    const btnConfirmar = document.createElement("button");
    btnConfirmar.classList.add("btnAgregar")
    btnConfirmar.textContent = "Confirmar"
    contenedor.appendChild(btnConfirmar)
    btnConfirmar.addEventListener("click", function (){
        overlay.classList.add("oculto")
        enviarProductos(contenedor)
        recargarTabla(atributos, tabla, titulo)
    })

}

async function enviarMovimiento(contenedor, valor) {
    const inputProducto = document.getElementById("producto").value
    const inputCantidad = document.getElementById("cantidad").value
    const inputMonto = document.getElementById("monto").value

    if (inputProducto && inputCantidad && inputMonto) {
        const respuesta = await fetch(
            `${url}/enviarMovimiento`,
            {method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    producto : inputProducto,
                    cantidad : inputCantidad,
                    monto : inputMonto,
                    valor : valor
                })
            }
        )
        const datos = await respuesta.json();
        
        if (datos.estado === "ok") {
            overlay.classList.add("oculto")
        } 
    }
    else {
        const mensaje = document.createElement("p");
        mensaje.classList.add("info")
        mensaje.textContent = "No se permiten campos vacios";
        contenedor.appendChild(mensaje)
            setTimeout(() => {
                mensaje.textContent = "";
                mensaje.style.display = "none";
            }, 2000)
    }
}

async function nuevoMovimiento(atributos, tabla, titulo) {
    
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

    const opciones = await buscarOpciones("productos", "producto")

    for (const opcion of opciones) {
            const categoria = document.createElement("option");
            categoria.textContent = opcion;
            categoria.value = opcion;
            select.append(categoria);
    }

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

    let seleccionado = false;
        
    const espacio = document.createElement("div")
    espacio.style.display = "flex";
    espacio.style.flexDirection = "row";
    espacio.style.alignItems = "center";
    espacio.style.width = "100%";
    espacio.style.gap = "1vw"

    const venta = document.createElement("button");
    venta.style.borderStyle = "solid";
    venta.style.width = "3vh";
    venta.style.aspectRatio = "1/1";
    venta.textContent = " ";
    venta.addEventListener("click", function() {
        seleccionado = !seleccionado
        if (seleccionado) {
            venta.style.backgroundColor = "rgba(144, 238, 144, 0.6)";
        } else {
            venta.style.backgroundColor = "white";
        }
    })

    const p = document.createElement("p");
    p.textContent = "Sumar en la tabla 'Productos'";
    
    espacio.append(venta)
    espacio.append(p)
    contenedor.append(espacio)


    const btnConfirmar = document.createElement("button");
    btnConfirmar.classList.add("btnAgregar")
    btnConfirmar.textContent = "Confirmar"
    contenedor.appendChild(btnConfirmar)
    btnConfirmar.addEventListener("click", function (){
        enviarMovimiento(contenedor, seleccionado);
        recargarTabla(atributos, tabla, titulo)
    })

}

async function enviarGasto(contenedor) {
    const inputCategoria = document.getElementById("categoria").value
    const inputOtro = document.getElementById("otra").value
    const inputMonto = document.getElementById("monto").value

    if ((inputCategoria !== "") && inputMonto&& (inputOtro === "")) {
        const respuesta = await fetch(
            `${url}/enviarGasto`,
                {method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    categoria : inputCategoria,
                    monto : inputMonto,
                })
            }  
        )
        const datos = await respuesta.json();

        if (datos.estado === "ok") {
            overlay.classList.add("oculto")
        }
    } else if ((inputCategoria === "") && inputMonto && (inputOtro !== "")) {
        const respuesta = await fetch(
            `${url}/enviarGasto`,
                {method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    categoria : inputOtro,
                    monto : inputMonto,
                })
            }  
        )
        const datos = await respuesta.json();

        if (datos.estado === "ok") {
            overlay.classList.add("oculto")
        }
    } else if ((inputCategoria !== "") && (inputOtro !== "")){
        const mensaje = document.createElement("p");
        mensaje.classList.add("info")
        mensaje.textContent = "Una categoria a la vez";
        contenedor.appendChild(mensaje)
            setTimeout(() => {
                mensaje.textContent = "";
                mensaje.style.display = "none";
            }, 2000)
    }  else {
        const mensaje = document.createElement("p");
        mensaje.classList.add("info")
        mensaje.textContent = "No se permiten campos vacios";
        contenedor.appendChild(mensaje)
            setTimeout(() => {
                mensaje.textContent = "";
                mensaje.style.display = "none";
            }, 2000)
    }
}

async function nuevoGasto(atributos, tabla, titulo) {
    
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

    const opciones = await buscarOpciones("gastos", "categoria")

    for (const opcion of opciones) {
            const categoria = document.createElement("option");
            categoria.textContent = opcion;
            categoria.value = opcion;
            select.append(categoria);
    }


    campo.append(label, select);
    contenedor.appendChild(campo)

    const inputs = [
            {id: "otra",
            tipo: "text",
            placeholder : "Nueva categoria..."
            },
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
        enviarGasto(contenedor)
        recargarTabla(atributos, tabla, titulo)
    })

}

async function enviarDistribuidor(contenedor) {
    const inputDistribuidor = document.getElementById("distribuidor").value
    const inputDireccion = document.getElementById("dirección").value
    const inputPagina = document.getElementById("página").value

    if (inputDistribuidor && inputDireccion) {

        const respuesta = await fetch(
            `${url}/enviarDistribuidor`,
                {method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    distribuidor : inputDistribuidor,
                    direccion : inputDireccion,
                    pagina : inputPagina
                })
            }  
        )
        const datos = await respuesta.json();
        
        if (datos.estado === "ok") {
            overlay.classList.add("oculto")
        } else {
            const mensaje = document.createElement("p");
            mensaje.classList.add("info")
            mensaje.textContent = "Ya registrado";
            contenedor.appendChild(mensaje)
            inputDistribuidor.value = "";
            inputDireccion.value ="";
            inputPagina.value="";
            setTimeout(() => {
                mensaje.textContent = "";
                mensaje.style.display = "none";
            }, 2000)
        }
    } else {
        const mensaje = document.createElement("p");
        mensaje.classList.add("info")
        mensaje.textContent = "No se permiten campos vacios";
        contenedor.appendChild(mensaje)
            setTimeout(() => {
                mensaje.textContent = "";
                mensaje.style.display = "none";
            }, 2000)
    }
}

function nuevoDistribuidor(atributos, tabla, titulo) {
    
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);

    crearBtnCerrar(contenedor);

    const inputs = [
            {id: "distribuidor",
            tipo: "text",
            placeholder : "Nombre del distribuidor..."
            },
            {id: "dirección",
            tipo: "text",
            placeholder : "Dirección del distribuidor..."
            },
            {id: "página",
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
        enviarDistribuidor(contenedor);
        recargarTabla(atributos, tabla, titulo)
    })

}

function nuevoGraficos(atributos, tabla, titulo) {
    //solo un placeholder para tener algo.
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);
    
    crearBtnCerrar(contenedor);

}