`Tareas restantes:
Todo el tema de graficos y dataScience
modularizar.(siempre se puede modularizar más)
`

import Chart from "chart.js/auto";
import { Preferences } from "@capacitor/preferences";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
const sqlite = new SQLiteConnection(CapacitorSQLite);
let db;

async function iniciarDB() {

    db = await sqlite.createConnection(
        "naturalOM",
        false,
        "no-encryption",
        1,
        false
    );

    await db.open();

    await crear_base();
}

async function crear_base() {

    await db.execute(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS distribuidores(
            distribuidor TEXT PRIMARY KEY,
            direccion TEXT NOT NULL,
            pagina TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS productos(
            producto TEXT PRIMARY KEY,
            precio REAL NOT NULL,
            cantidad INTEGER NOT NULL,
            distribuidor TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS movimientos(
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            categoria TEXT NOT NULL,
            producto TEXT NOT NULL,
            cantidad INTEGER NOT NULL,
            monto REAL NOT NULL,
            PRIMARY KEY (fecha, hora)
        );

        CREATE TABLE IF NOT EXISTS gastos(
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            categoria TEXT NOT NULL,
            monto REAL NOT NULL,
            PRIMARY KEY (fecha, hora)
        );
    `);

}

await iniciarDB();

const btnProducto = document.getElementById("btnProducto");
const btnMovStock = document.getElementById("btnMovStock");
const btnGastos = document.getElementById("btnGastos");
const btnDistribuidores = document.getElementById("btnDistribuidores");
const btnStats = document.getElementById("btnStats");

const seccionActual = document.getElementById("seccionActual");
const saldo = document.getElementById("saldo");
saldo.style.fontSize = "2vh";
const overlay = document.getElementById("overlay");
const sumarSaldo = document.getElementById("sumarSaldo")

let saldoInicial = 690091;

async function cargarSaldoInicial() {
    const resultado = await Preferences.get({ key: "saldoInicial" });

    if (resultado.value !== null) {
        saldoInicial = Number(resultado.value);
    }
}

await cargarSaldoInicial();

async function mostrarbalance() {
    const saldo = document.getElementById("saldo");

    const movimientos = await db.query(
        "SELECT COALESCE(SUM(monto), 0) AS total FROM movimientos"
    );

    const gastos = await db.query(
        "SELECT COALESCE(SUM(monto), 0) AS total FROM gastos"
    );

    const balance =
        Number(movimientos.values[0].total) +
        Number(gastos.values[0].total) + saldoInicial;

    saldo.textContent = `$${balance}`;
}

mostrarbalance()

sumarSaldo.addEventListener("click", function() {
    overlay.classList.remove("oculto")
    overlay.innerHTML = "";
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);
    
    crearBtnCerrar(contenedor);
    
    crearCampo({id:"inicial", 
                tipo: "number", 
                placeholder: `saldo inicial actual = ${saldoInicial}`}, 
                contenedor)

    const btnConfirmar = document.createElement("button");
    btnConfirmar.classList.add("btnAgregar")
    btnConfirmar.textContent = "Confirmar"
    contenedor.appendChild(btnConfirmar)

    btnConfirmar.addEventListener("click", async function () {
        overlay.classList.add("oculto");

        const nuevoSaldo = Number(document.getElementById("inicial").value);

        saldoInicial = nuevoSaldo;

        await Preferences.set({
            key: "saldoInicial",
            value: String(saldoInicial)
        });

        mostrarbalance();
    });
    
})

const gastosJunio = `INSERT INTO gastos (fecha, hora, categoria, monto) VALUES
    ('02-06-26', '10:14', 'snack', -1200),
    ('04-06-26', '18:32', 'uber', -4800),
    ('07-06-26', '13:47', 'snack', -1800),
    ('10-06-26', '09:21', 'compras', -6500),
    ('13-06-26', '17:05', 'uber', -5200),
    ('16-06-26', '12:38', 'snack', -1500),
    ('19-06-26', '20:11', 'uber', -4300),
    ('22-06-26', '14:26', 'compras', -7200),
    ('25-06-26', '11:53', 'snack', -2100),
    ('28-06-26', '18:44', 'uber', -5100);`;

async function inflarNumeros(stats) {
    await db.execute(stats)
}

//inflarNumeros(gastosJunio)


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

        agregar: "Seleccionar gráfico",

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

        if (configuracion.boton == btnStats) {
            overlay.innerHTML = "";
            overlay.classList.remove("oculto");
            configuracion.modificarOverlay(configuracion.atributos, tabla, configuracion.titulo);
        }
    })
}

async function recargarTabla(atributos, tabla, titulo) {
    tabla.innerHTML = "";
    
    for (const atributo of atributos) {
        const columna = document.createElement("th");
        columna.textContent = atributo;
        tabla.appendChild(columna);
    }

    const ordenes = {
        productos: "producto ASC",
        movimientos: `
            substr(fecha, 7, 2) DESC,
            substr(fecha, 4, 2) DESC,
            substr(fecha, 1, 2) DESC,
            hora DESC
        `,
        gastos: `
            substr(fecha, 7, 2) DESC,
            substr(fecha, 4, 2) DESC,
            substr(fecha, 1, 2) DESC
        `,
        distribuidores: "distribuidor ASC"
    };

    const datos = await db.query(
        `SELECT * FROM ${titulo} ORDER BY ${ordenes[titulo]}`
    );

    console.log("Registros recibidos:", datos.values);

    for (const registro of datos.values) {
        mostrar(registro, tabla, titulo, atributos);
    }

    mostrarbalance();
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
        btnConfirmar.addEventListener("click", async function (){
            let cant = Number(document.getElementById(tipo).value)

            if (tipo === "restar") {
                cant = cant * (-1)
            }

            if (tipo === "precio") {
                cambiarPrecio("producto", producto, "productos", cant)
            } else {
                operar("producto", producto, "productos", cant, seleccionado);
            }

            await recargarTabla(botonesAgregados[0].atributos, document.getElementById("tablaProductos"), "productos")
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
        btnConfirmar.addEventListener("click", async function (){
            eliminarElem(atributo, elemento, tabla);
            
            await recargarTabla(atributos, tablaActual, tabla)
        })
    })

    fila.appendChild(td);

}

async function operar(parametro, elem, tabla, cant, valor) {

    await db.run(
        `UPDATE ${tabla} SET cantidad = cantidad + ? WHERE ${parametro} = ?`,
        [cant, elem]
    );

    if (cant <= 0 && valor === true) {

        const fecha = obtenerFecha();
        const hora = obtenerHora();

        const precio = await db.query(
            "SELECT precio FROM productos WHERE producto = ?",
            [elem]
        );

        const precioProducto = precio.values[0].precio;
        const cantVendida = -cant;
        const montoTotal = precioProducto * cantVendida;

        await db.run(
            `INSERT INTO movimientos
            (fecha, hora, categoria, producto, cantidad, monto)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [fecha, hora, "venta", elem, cantVendida, montoTotal]
        );
    }

    overlay.classList.add("oculto");
    mostrarbalance();
}

async function cambiarPrecio(parametro, elem, tabla, precioNuevo) {

    await db.run(
        `UPDATE ${tabla} SET precio = ? WHERE ${parametro} = ?`,
        [precioNuevo, elem]
    );

    overlay.classList.add("oculto");
}

async function eliminarElem(parametro, elem, tabla) {

    console.log("TABLA:", tabla);
    console.log("PARAMETRO:", parametro);
    console.log("ELEM:", elem);
    console.log("ES ARRAY:", Array.isArray(elem));

    if (Array.isArray(elem)) {

        await db.run(
            `DELETE FROM ${tabla} WHERE ${parametro[0]} = ? AND ${parametro[1]} = ?`,
            [elem[0], elem[1]]
        );

    } else {

        await db.run(
            `DELETE FROM ${tabla} WHERE ${parametro} = ?`,
            [elem]
        );
    }

    overlay.classList.add("oculto");
}

async function buscarOpciones(tabla, atributo) {

    const resultado = await db.query(
        `SELECT DISTINCT ${atributo} FROM ${tabla} ORDER BY ${atributo} ASC`
    );

    return resultado.values.map(registro => registro[atributo]);
}

function obtenerFecha() {
    const ahora = new Date();

    const dia = String(ahora.getDate()).padStart(2, "0");
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const anio = String(ahora.getFullYear()).slice(-2);

    return `${dia}-${mes}-${anio}`;
}

function obtenerHora() {
    const ahora = new Date();

    const h = String(ahora.getHours()).padStart(2, "0");
    const m = String(ahora.getMinutes()).padStart(2, "0");
    const s = String(ahora.getSeconds()).padStart(2, "0");

    return `${h}:${m}:${s}`;
}
// Especificas

async function enviarProductos(contenedor) {
    const inputProducto = document.getElementById("producto").value;
    const inputCantidad = document.getElementById("cantidad").value;
    const inputPrecio = document.getElementById("precio").value;
    const inputDistribuidores = document.getElementById("distribuidores").value;

    if (inputProducto && inputCantidad && inputPrecio && inputDistribuidores) {

        try {

            await db.run(
                `INSERT INTO productos
                (producto, precio, cantidad, distribuidor)
                VALUES (?, ?, ?, ?)`,
                [
                    inputProducto,
                    Number(inputPrecio),
                    Number(inputCantidad),
                    inputDistribuidores
                ]
            );

            overlay.classList.add("oculto");

        } catch (error) {

            console.error(error);

        }

    } else {

        const mensaje = document.createElement("p");
        mensaje.classList.add("info");
        mensaje.textContent = "No se permiten campos vacios";
        contenedor.appendChild(mensaje);

        setTimeout(() => {
            mensaje.textContent = "";
            mensaje.style.display = "none";
        }, 2000);

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
    btnConfirmar.addEventListener("click", async function (){
        overlay.classList.add("oculto")
        enviarProductos(contenedor)
        await recargarTabla(atributos, tabla, titulo)
    })

}

async function enviarMovimiento(contenedor, valor) {

    const inputProducto = document.getElementById("producto").value;
    const inputCantidad = Number(document.getElementById("cantidad").value);
    const inputMonto = Number(document.getElementById("monto").value);

    if (inputProducto && inputCantidad && inputMonto) {

        try {

            const fecha = obtenerFecha();
            const hora = obtenerHora();

            await db.run(
                `INSERT INTO movimientos
                (fecha, hora, categoria, producto, cantidad, monto)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    fecha,
                    hora,
                    "reponer",
                    inputProducto,
                    inputCantidad,
                    (inputMonto*(-1))
                ]
            );

            if (valor) {
                await db.run(
                    "UPDATE productos SET cantidad = cantidad + ? WHERE producto = ?",
                    [inputCantidad, inputProducto]
                );
            }

            overlay.classList.add("oculto");

        } catch (error) {

            console.error(error);

        }

    } else {

        const mensaje = document.createElement("p");
        mensaje.classList.add("info");
        mensaje.textContent = "No se permiten campos vacios";
        contenedor.appendChild(mensaje);

        setTimeout(() => {
            mensaje.textContent = "";
            mensaje.style.display = "none";
        }, 2000);

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
    btnConfirmar.addEventListener("click", async function (){
        enviarMovimiento(contenedor, seleccionado);
        await recargarTabla(atributos, tabla, titulo)
    })

}

async function enviarGasto(contenedor) {

    const inputMonto = Number(document.getElementById("monto").value);
    const inputOtro = document.getElementById("otra").value;
    const inputCategoria = document.getElementById("categoria").value;

    if (inputMonto && inputCategoria && !inputOtro) {

        try {

            const fecha = obtenerFecha();
            const hora = obtenerHora();

            await db.run(
                `INSERT INTO gastos
                (fecha, hora, categoria, monto)
                VALUES (?, ?, ?, ?)`,
                [
                    fecha,
                    hora,
                    inputCategoria,
                    (inputMonto*(-1))
                ]
            );

            overlay.classList.add("oculto");

        } catch (error) {

            console.error(error);

        }

    } else if (inputMonto && !inputCategoria && inputOtro) {

        try {

            const fecha = obtenerFecha();
            const hora = obtenerHora();

            await db.run(
                `INSERT INTO gastos
                (fecha, hora, categoria, monto)
                VALUES (?, ?, ?, ?)`,
                [
                    fecha,
                    hora,
                    inputOtro,
                    (inputMonto*(-1))
                ]
            );

            overlay.classList.add("oculto");

        } catch (error) {

            console.error(error);

        }
    }  else if (inputCategoria && inputOtro){

        const mensaje = document.createElement("p");
        mensaje.classList.add("info");
        mensaje.textContent = "Una categoría a la vez";
        contenedor.appendChild(mensaje);

        setTimeout(() => {
            mensaje.textContent = "";
            mensaje.style.display = "none";
        }, 2000);

    } else {

        const mensaje = document.createElement("p");
        mensaje.classList.add("info");
        mensaje.textContent = "No se permiten campos vacios";
        contenedor.appendChild(mensaje);

        setTimeout(() => {
            mensaje.textContent = "";
            mensaje.style.display = "none";
        }, 2000);

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
    btnConfirmar.addEventListener("click", async function (){
        enviarGasto(contenedor)
        await recargarTabla(atributos, tabla, titulo)
    })

}

async function enviarDistribuidor(contenedor) {

    const inputDistribuidor = document.getElementById("distribuidor").value;
    const inputDireccion = document.getElementById("direccion").value;
    const inputPagina = document.getElementById("pagina").value;

    if (inputDistribuidor && inputDireccion) {

        try {

            await db.run(
                `INSERT INTO distribuidores
                (distribuidor, direccion, pagina)
                VALUES (?, ?, ?)`,
                [
                    inputDistribuidor,
                    inputDireccion,
                    inputPagina
                ]
            );

            overlay.classList.add("oculto");

        } catch (error) {

            console.error(error);

        }

    } else {

        const mensaje = document.createElement("p");
        mensaje.classList.add("info");
        mensaje.textContent = "No se permiten campos vacios";
        contenedor.appendChild(mensaje);

        setTimeout(() => {
            mensaje.textContent = "";
            mensaje.style.display = "none";
        }, 2000);

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
            {id: "direccion",
            tipo: "text",
            placeholder : "Dirección del distribuidor..."
            },
            {id: "pagina",
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
    btnConfirmar.addEventListener("click", async function (){
        enviarDistribuidor(contenedor);
        await recargarTabla(atributos, tabla, titulo)
    })

}

async function nuevoGraficos(atributos, tabla, titulo) {

    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);
    
    crearBtnCerrar(contenedor);

    const botones = [
        [ventas7dias, "Ventas"],
        [prodMasVendido, "Información de stock"],
        [gastosCat, "Gastos por categoría"],
        [gastosHistorial, "Historial de gastos"]
    ];

    for (const boton of botones) {
        crearGrafico(boton[0], boton[1], contenedor);
    }
    
}

async function crearGrafico(funcion, nombre, contenedor) {

    const boton = document.createElement("button");

    boton.textContent = nombre;
    boton.classList.add("btnAgregar");

    boton.addEventListener("click", async function() {
        overlay.classList.add("oculto");
        funcion();
    });

    contenedor.append(boton);
}
async function panelVentas() {
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedorMenu");
    overlay.appendChild(contenedor);
    
    crearBtnCerrar(contenedor);
    
    const botones = [
        [ventas7dias, "últimos 7 días"],
        [ventas5semanas, "últimas 5 semanas"],
        [ventas12meses, "últimos 12 meses"],
    ];

    for (const boton of botones) {
        crearGrafico(boton[0], boton[1], contenedor);
    }
}

async function ventas7dias() {
    const tabla = document.getElementById("tablaEstadisticas");
    tabla.innerHTML = "";

    const botonVentas = document.createElement("button")
    botonVentas.classList.add("btnAgregar")
    botonVentas.textContent = "Periodo"
    botonVentas.style.width = "100%"
    botonVentas.addEventListener("click", function () {
        overlay.innerHTML = "";
        overlay.classList.remove("oculto");
        panelVentas();
    })
    tabla.append(botonVentas)

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.maxHeight = "70vh";
    tabla.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const resultado = await db.query(`
        SELECT fecha, SUM(monto) AS total
        FROM movimientos
        WHERE categoria = 'venta'
        GROUP BY fecha
    `);

    const datos = {};

    for (const registro of resultado.values) {
        datos[registro.fecha] = Number(registro.total);
    }

    const fechas = [];

    for (let i = 6; i >= 0; i--) {
        const fecha = new Date();

        fecha.setDate(fecha.getDate() - i);

        const dia = String(fecha.getDate()).padStart(2, "0");
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const anio = String(fecha.getFullYear()).slice(-2);

        const fechaTexto = `${dia}-${mes}-${anio}`;

        fechas.push({
            fecha: fechaTexto,
            etiqueta: `${dia}/${mes}`
        });
    }

    new Chart(ctx, {
        type: "line",

        data: {
            labels: fechas.map(x => x.etiqueta),

            datasets: [{
                label: "Ventas",
                data: fechas.map(x => datos[x.fecha] || 0),
                tension: 0.3
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: true,

            plugins: {
                title: {
                    display: true,
                    text: "Ventas - últimos 7 días"
                }
            }
        }
    });


    const ventas = await db.query(`
        SELECT fecha, hora, producto, cantidad, monto
        FROM movimientos
        WHERE categoria = 'venta'
    `);

    const fechasPeriodo = fechas.map(x => x.fecha);

    const mejoresVentas = ventas.values
        .filter(venta => fechasPeriodo.includes(venta.fecha))
        .sort((a, b) => Number(b.monto) - Number(a.monto))
        .slice(0, 10);


    const miniTabla = document.createElement("table");

    const encabezado = document.createElement("tr");

    const thFecha = document.createElement("th");
    thFecha.textContent = "Fecha";

    const thProducto = document.createElement("th");
    thProducto.textContent = "Producto";

    const thCantidad = document.createElement("th");
    thCantidad.textContent = "Cantidad";

    const thMonto = document.createElement("th");
    thMonto.textContent = "Monto";

    encabezado.append(thFecha, thProducto, thCantidad, thMonto);
    miniTabla.appendChild(encabezado);

    for (const venta of mejoresVentas) {
        const fila = document.createElement("tr");

        const fecha = document.createElement("td");
        fecha.textContent = venta.fecha;

        const producto = document.createElement("td");
        producto.textContent = venta.producto;

        const cantidad = document.createElement("td");
        cantidad.textContent = venta.cantidad;

        const monto = document.createElement("td");
        monto.textContent = venta.monto;

        fila.append(fecha, producto, cantidad, monto);
        miniTabla.appendChild(fila);
    }

    tabla.appendChild(miniTabla);
}

async function ventas5semanas() {
    const tabla = document.getElementById("tablaEstadisticas");
    tabla.innerHTML = "";

    const botonVentas = document.createElement("button")
    botonVentas.classList.add("btnAgregar")
    botonVentas.textContent = "Periodo"
    botonVentas.style.width = "100%"
    botonVentas.addEventListener("click", function () {
        overlay.innerHTML = "";
        overlay.classList.remove("oculto");
        panelVentas();
    })
    tabla.append(botonVentas)


    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.maxHeight = "70vh";
    tabla.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const resultado = await db.query(`
        SELECT fecha, SUM(monto) AS total
        FROM movimientos
        WHERE categoria = 'venta'
        GROUP BY fecha
    `);

    const semanas = [];

    for (let i = 4; i >= 0; i--) {
        const inicio = new Date();
        inicio.setDate(inicio.getDate() - (i + 1) * 7 + 1);

        const fin = new Date();
        fin.setDate(fin.getDate() - i * 7);

        semanas.push({
            inicio: inicio,
            fin: fin,
            total: 0
        });
    }

    for (const registro of resultado.values) {
        const partes = registro.fecha.split("-");

        const fecha = new Date(
            2000 + Number(partes[2]),
            Number(partes[1]) - 1,
            Number(partes[0])
        );

        for (const semana of semanas) {
            if (fecha >= semana.inicio && fecha <= semana.fin) {
                semana.total += Number(registro.total);
                break;
            }
        }
    }

    new Chart(ctx, {
        type: "line",

        data: {
            labels: semanas.map(semana => {
                const dia = String(semana.inicio.getDate()).padStart(2, "0");
                const mes = String(semana.inicio.getMonth() + 1).padStart(2, "0");

                return `${dia}/${mes}`;
            }),

            datasets: [{
                label: "Ventas",
                data: semanas.map(semana => semana.total),
                tension: 0.3
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: true,

            plugins: {
                title: {
                    display: true,
                    text: "Ventas - últimas 5 semanas"
                }
            }
        }
    });

    const ventas = await db.query(`
        SELECT fecha, hora, producto, cantidad, monto
        FROM movimientos
        WHERE categoria = 'venta'
    `);

    const mejoresVentas = ventas.values
        .filter(venta => {
            const partes = venta.fecha.split("-");

            const fechaVenta = new Date(
                2000 + Number(partes[2]),
                Number(partes[1]) - 1,
                Number(partes[0])
            );

            return semanas.some(semana =>
                fechaVenta >= semana.inicio &&
                fechaVenta <= semana.fin
            );
        })
        .sort((a, b) => Number(b.monto) - Number(a.monto))
        .slice(0, 10);

    const miniTabla = document.createElement("table");

    const encabezado = document.createElement("tr");

    const thFecha = document.createElement("th");
    thFecha.textContent = "Fecha";

    const thProducto = document.createElement("th");
    thProducto.textContent = "Producto";

    const thCantidad = document.createElement("th");
    thCantidad.textContent = "Cantidad";

    const thMonto = document.createElement("th");
    thMonto.textContent = "Monto";

    encabezado.append(thFecha, thProducto, thCantidad, thMonto);
    miniTabla.appendChild(encabezado);

    for (const venta of mejoresVentas) {
        const fila = document.createElement("tr");

        const fecha = document.createElement("td");
        fecha.textContent = venta.fecha;

        const producto = document.createElement("td");
        producto.textContent = venta.producto;

        const cantidad = document.createElement("td");
        cantidad.textContent = venta.cantidad;

        const monto = document.createElement("td");
        monto.textContent = venta.monto;

        fila.append(fecha, producto, cantidad, monto);
        miniTabla.appendChild(fila);
    }

    tabla.appendChild(miniTabla);
}

async function ventas12meses() {
    const tabla = document.getElementById("tablaEstadisticas");
    tabla.innerHTML = "";

    const botonVentas = document.createElement("button")
    botonVentas.classList.add("btnAgregar")
    botonVentas.textContent = "Periodo"
    botonVentas.style.width = "100%"
    botonVentas.addEventListener("click", function () {
        overlay.innerHTML = "";
        overlay.classList.remove("oculto");
        panelVentas();
    })
    tabla.append(botonVentas)


    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.maxHeight = "70vh";
    tabla.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const resultado = await db.query(`
        SELECT fecha, SUM(monto) AS total
        FROM movimientos
        WHERE categoria = 'venta'
        GROUP BY fecha
    `);

    const meses = [];

    for (let i = 11; i >= 0; i--) {
        const fecha = new Date();

        fecha.setDate(1);
        fecha.setMonth(fecha.getMonth() - i);

        meses.push({
            anio: fecha.getFullYear(),
            mes: fecha.getMonth(),
            total: 0,
            etiqueta: `${String(fecha.getMonth() + 1).padStart(2, "0")}/${String(fecha.getFullYear()).slice(-2)}`
        });
    }

    for (const registro of resultado.values) {
        const partes = registro.fecha.split("-");

        const fecha = new Date(
            2000 + Number(partes[2]),
            Number(partes[1]) - 1,
            Number(partes[0])
        );

        for (const mes of meses) {
            if (
                fecha.getFullYear() === mes.anio &&
                fecha.getMonth() === mes.mes
            ) {
                mes.total += Number(registro.total);
                break;
            }
        }
    }

    new Chart(ctx, {
        type: "line",

        data: {
            labels: meses.map(mes => mes.etiqueta),

            datasets: [{
                label: "Ventas",
                data: meses.map(mes => mes.total),
                tension: 0.3
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: true,

            plugins: {
                title: {
                    display: true,
                    text: "Ventas - últimos 12 meses"
                }
            }
        }
    });

    const ventas = await db.query(`
    SELECT fecha, hora, producto, cantidad, monto
    FROM movimientos
    WHERE categoria = 'venta'
`);

    const mejoresVentas = ventas.values
        .filter(venta => {
            const partes = venta.fecha.split("-");

            const fechaVenta = new Date(
                2000 + Number(partes[2]),
                Number(partes[1]) - 1,
                Number(partes[0])
            );

            return meses.some(mes =>
                fechaVenta.getFullYear() === mes.anio &&
                fechaVenta.getMonth() === mes.mes
            );
        })
        .sort((a, b) => Number(b.monto) - Number(a.monto))
        .slice(0, 10);

    const miniTabla = document.createElement("table");

    const encabezado = document.createElement("tr");

    const thFecha = document.createElement("th");
    thFecha.textContent = "Fecha";

    const thProducto = document.createElement("th");
    thProducto.textContent = "Producto";

    const thCantidad = document.createElement("th");
    thCantidad.textContent = "Cantidad";

    const thMonto = document.createElement("th");
    thMonto.textContent = "Monto";

    encabezado.append(thFecha, thProducto, thCantidad, thMonto);
    miniTabla.appendChild(encabezado);

    for (const venta of mejoresVentas) {
        const fila = document.createElement("tr");

        const fecha = document.createElement("td");
        fecha.textContent = venta.fecha;

        const producto = document.createElement("td");
        producto.textContent = venta.producto;

        const cantidad = document.createElement("td");
        cantidad.textContent = venta.cantidad;

        const monto = document.createElement("td");
        monto.textContent = venta.monto;

        fila.append(fecha, producto, cantidad, monto);
        miniTabla.appendChild(fila);
    }

    tabla.appendChild(miniTabla);

}

async function prodMasVendido() {
    const tabla = document.getElementById("tablaEstadisticas");
    tabla.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.maxHeight = "70vh";
    tabla.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const resultado = await db.query(`
        SELECT producto, SUM(cantidad) AS total
        FROM movimientos
        WHERE categoria = 'venta'
        GROUP BY producto
        ORDER BY total DESC
        LIMIT 5
    `);

    const colores = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF"
    ];

    const mostrarValores = {
        id: "mostrarValores",

        afterDatasetsDraw(grafico) {
            const ctx = grafico.ctx;

            ctx.save();

            grafico.data.datasets.forEach((dataset, indiceDataset) => {
                const meta = grafico.getDatasetMeta(indiceDataset);

                meta.data.forEach((barra, indice) => {
                    const valor = dataset.data[indice];

                    ctx.fillStyle = "#000";
                    ctx.font = "bold 14px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";

                    ctx.fillText(
                        valor,
                        barra.x,
                        barra.y - 5
                    );
                });
            });

            ctx.restore();
        }
    };

    new Chart(ctx, {
        type: "bar",

        data: {
            labels: resultado.values.map(registro => registro.producto),

            datasets: [{
                label: "Cantidad vendida",

                data: resultado.values.map(
                    registro => Number(registro.total)
                ),

                backgroundColor: resultado.values.map(
                    (_, indice) => colores[indice]
                )
            }]
        },

        options: {
            responsive: true,

            plugins: {
                legend: {
                    display: false
                },

                title: {
                    display: true,
                    text: "Productos más vendidos"
                }
            },

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },

        plugins: [mostrarValores]
    });

    const texto = document.createElement("p");

    texto.textContent = `productos con poco stock`;

    texto.style.backgroundColor = "lightcyan";
    texto.style.borderRadius = "2vh";
    texto.style.textAlign = "center";
    texto.style.paddingTop = "2vh";
    texto.style.paddingBottom = "2vh";
    tabla.appendChild(texto);

    const stock = await db.query(`
        SELECT producto, cantidad
        FROM productos
        WHERE cantidad <= 5
        ORDER BY cantidad ASC
    `);

    const lista = document.createElement("table");

    const encabezado = document.createElement("tr");

    const thProducto = document.createElement("th");
    thProducto.textContent = "Producto";

    const thStock = document.createElement("th");
    thStock.textContent = "Stock";

    encabezado.append(thProducto, thStock);
    lista.appendChild(encabezado);

    for (const producto of stock.values) {
        const fila = document.createElement("tr");

        const nombre = document.createElement("td");
        nombre.textContent = producto.producto;

        const cantidad = document.createElement("td");
        cantidad.textContent = producto.cantidad;

        fila.append(nombre, cantidad);
        lista.appendChild(fila);
    }

    tabla.appendChild(lista);

    valorTotalStock()
}

async function valorTotalStock() {
    const tabla = document.getElementById("tablaEstadisticas");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.maxHeight = "70vh";
    tabla.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const resultado = await db.query(`
        SELECT producto, precio, cantidad
        FROM productos
        ORDER BY (precio * cantidad) DESC
    `);

    const valores = resultado.values.map(
        registro => Number(registro.precio) * Number(registro.cantidad)
    );

    const valorTotal = valores.reduce(
        (total, valor) => total + valor,
        0
    );

    const colores = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#C9CBCF",
        "#8AC926",
        "#1982C4",
        "#6A4C93"
    ];

    new Chart(ctx, {
        type: "pie",

        data: {
            labels: resultado.values.map(
                registro => registro.producto
            ),

            datasets: [{
                data: valores,

                backgroundColor: resultado.values.map(
                    (_, indice) => colores[indice % colores.length]
                )
            }]
        },

        options: {
            responsive: true,

            plugins: {
                title: {
                    display: true,
                    text: "Valor actual del stock por producto"
                }
            }
        }
    });

    const textoTotal = document.createElement("p");

    textoTotal.textContent = `Valor total: $${valorTotal.toLocaleString("es-AR")}`;

    textoTotal.style.backgroundColor = "lightcyan";
    textoTotal.style.borderRadius = "2vh";
    textoTotal.style.textAlign = "center";
    textoTotal.style.paddingTop = "2vh";
    textoTotal.style.paddingBottom = "2vh";
    tabla.appendChild(textoTotal);
}

async function gastosCat() {
    const tabla = document.getElementById("tablaEstadisticas");
    tabla.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.maxHeight = "70vh";
    tabla.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const resultado = await db.query(`
        SELECT fecha, categoria, monto
        FROM gastos
    `);

    const resultadoReponer = await db.query(`
        SELECT fecha, categoria, monto
        FROM movimientos
        WHERE categoria = 'reponer'
    `);

    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    const fechaInicio = new Date(fechaActual);
    fechaInicio.setDate(fechaInicio.getDate() - 29);

    const gastosPeriodo = resultado.values.filter(gasto => {
        const partes = gasto.fecha.split("-");

        const fechaGasto = new Date(
            2000 + Number(partes[2]),
            Number(partes[1]) - 1,
            Number(partes[0])
        );

        fechaGasto.setHours(0, 0, 0, 0);

        return fechaGasto >= fechaInicio && fechaGasto <= fechaActual;
    });

    const reponerPeriodo = resultadoReponer.values.filter(gasto => {
        const partes = gasto.fecha.split("-");

        const fechaGasto = new Date(
            2000 + Number(partes[2]),
            Number(partes[1]) - 1,
            Number(partes[0])
        );

        fechaGasto.setHours(0, 0, 0, 0);

        return fechaGasto >= fechaInicio && fechaGasto <= fechaActual;
    });

    const categorias = {};

    for (const gasto of gastosPeriodo) {
        if (!categorias[gasto.categoria]) {
            categorias[gasto.categoria] = 0;
        }

        categorias[gasto.categoria] += Math.abs(Number(gasto.monto));
    }

    for (const gasto of reponerPeriodo) {
        if (!categorias[gasto.categoria]) {
            categorias[gasto.categoria] = 0;
        }

        categorias[gasto.categoria] += Math.abs(Number(gasto.monto));
    }

    const nombresCategorias = Object.keys(categorias);

    const valoresCategorias = nombresCategorias.map(
        categoria => categorias[categoria]
    );

    const colores = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#C9CBCF",
        "#8AC926",
        "#1982C4",
        "#6A4C93"
    ];

    new Chart(ctx, {
        type: "pie",

        data: {
            labels: nombresCategorias,

            datasets: [{
                data: valoresCategorias,

                backgroundColor: nombresCategorias.map(
                    (_, indice) => colores[indice % colores.length]
                )
            }]
        },

        options: {
            responsive: true,

            plugins: {
                title: {
                    display: true,
                    text: "Gastos por categoría - últimos 30 días"
                }
            }
        }
    });

    const miniTabla = document.createElement("table");

    const encabezado = document.createElement("tr");

    const thCategoria = document.createElement("th");
    thCategoria.textContent = "Categoría";

    const thTotal = document.createElement("th");
    thTotal.textContent = "Total";

    encabezado.append(thCategoria, thTotal);
    miniTabla.appendChild(encabezado);

    for (const categoria of nombresCategorias) {
        const fila = document.createElement("tr");

        const tdCategoria = document.createElement("td");
        tdCategoria.textContent = categoria;

        const tdTotal = document.createElement("td");
        tdTotal.textContent =
            `$${categorias[categoria].toLocaleString("es-AR")}`;

        fila.append(tdCategoria, tdTotal);
        miniTabla.appendChild(fila);
    }

    tabla.appendChild(miniTabla);
}

async function gastosHistorial() {
    const tabla = document.getElementById("tablaEstadisticas");
    tabla.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.maxHeight = "70vh";
    tabla.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const gastos = await db.query(`
        SELECT fecha, categoria, monto
        FROM gastos
    `);

    const reponer = await db.query(`
        SELECT fecha, categoria, monto
        FROM movimientos
        WHERE categoria = 'reponer'
    `);

    const meses = {};

    for (const registro of gastos.values) {
        const partes = registro.fecha.split("-");
        const clave = `${partes[1]}-${partes[2]}`;

        if (!meses[clave]) {
            meses[clave] = 0;
        }

        meses[clave] += Math.abs(Number(registro.monto));
    }

    for (const registro of reponer.values) {
        const partes = registro.fecha.split("-");
        const clave = `${partes[1]}-${partes[2]}`;

        if (!meses[clave]) {
            meses[clave] = 0;
        }

        meses[clave] += Math.abs(Number(registro.monto));
    }

    const claves = Object.keys(meses).sort();

    new Chart(ctx, {
        type: "line",

        data: {
            labels: claves,

            datasets: [{
                label: "Gastos",
                data: claves.map(clave => meses[clave]),
                tension: 0.3
            }]
        },

        options: {
            responsive: true,

            plugins: {
                title: {
                    display: true,
                    text: "Evolución mensual de gastos"
                }
            }
        }
    });

    const lista = document.createElement("table");

    const encabezado = document.createElement("tr");

    const thMes = document.createElement("th");
    thMes.textContent = "Mes";

    const thGasto = document.createElement("th");
    thGasto.textContent = "Gasto";

    encabezado.append(thMes, thGasto);
    lista.appendChild(encabezado);

    for (const clave of claves) {
        const fila = document.createElement("tr");

        const mes = document.createElement("td");
        mes.textContent = clave;

        const gasto = document.createElement("td");
        gasto.textContent = `$${meses[clave].toLocaleString("es-AR")}`;

        fila.append(mes, gasto);
        lista.appendChild(fila);
    }

    tabla.appendChild(lista);
}