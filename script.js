// ==========================================================================
// BOTONES
// ==========================================================================

const btnProducto = document.getElementById("btnProducto");
const btnMovimiento = document.getElementById("btnMovimiento");

// ==========================================================================
// TABLAS
// ==========================================================================

const tablaProductos = document.getElementById("tablaProductos");
const tablaMovimientos = document.getElementById("tablaMovimientos");

// ==========================================================================
// OTROS
// ==========================================================================

const saldo = document.getElementById("saldo");
const informacion = document.getElementById("informacion");
const overlay = document.getElementById("overlay");
const contenedor = document.getElementById("contenedor");
const cerrar = document.getElementById("cerrar");

// ==========================================================================
// FUNCIONES
// ==========================================================================

function mostrarMensaje(texto, tipo) {
    informacion.textContent = texto;
    informacion.classList.remove("oculto");
    informacion.classList.add(tipo);
}

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

// ==========================================================================
// CONFIGURACIÓN
// ==========================================================================

const botonesAgregados = [

    {
        boton: btnProducto,

        campos: {
            producto: [
                "Ingrese el nombre del producto",
                "text"
            ],

            precio: [
                "Ingrese el precio del producto",
                "number"
            ],

            stock: [
                "Ingrese el stock actual",
                "number"
            ]
        }
    },

    {
        boton: btnMovimiento,

        campos: {
            mensaje: [
                "Describí el movimiento",
                "text"
            ],

            monto: [
                "Ingrese el monto del movimiento",
                "number"
            ]
        }
    }

];

// ==========================================================================
// EVENTOS
// ==========================================================================

for (const configuracion of botonesAgregados) {

    configuracion.boton.addEventListener("click", function () {

        overlay.classList.remove("oculto");

        const elementos = abrirMenu(configuracion.campos);

        if (configuracion.boton === btnMovimiento) {

            const espacioBoton = document.createElement("div");
            espacioBoton.id = "espacioBoton";
            espacioBoton.textContent = "Gasto";

            const btnGasto = crearBoton(
                "btnGastoNoPress",
                "",
                espacioBoton
            );

            contenedor.appendChild(espacioBoton);

            elementos.push(espacioBoton);
            elementos.push(btnGasto);

            btnGasto.addEventListener("click", function () {

                // lógica del backend

            });

        }

        const btnConfirmar = crearBoton(
            "btnConfirmar",
            "Confirmar",
            contenedor
        );

        elementos.push(btnConfirmar);

        const btnCerrar = crearBoton(
            "btnCerrar",
            "✕",
            cerrar
        );

        elementos.push(btnCerrar);

        btnCerrar.addEventListener("click", function () {

            cerrarMenu(elementos);

        });

        btnConfirmar.addEventListener("click", function () {

            // lógica del backend

            cerrarMenu(elementos);

        });

    });

}