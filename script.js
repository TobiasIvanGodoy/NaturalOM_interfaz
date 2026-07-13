// botones 

const btnProducto = document.getElementById("btnProducto")
const btnMovimiento = document.getElementById("btnMovimiento")

// Tablas

const tablaProductos = document.getElementById("tablaProductos")
const tablaMovimientos = document.getElementById("tablaMovimientos")

// Otros

const saldo = document.getElementById("saldo")
const informacion = document.getElementById("informacion")
const overlay = document.getElementById("overlay")
const contenedor = document.getElementById("contenedor")
const cerrar = document.getElementById("cerrar")

// Funciones 

function mostrarMensaje(texto, tipo) {
    informacion.textContent = texto;
    informacion.classList.remove("oculto")
    informacion.classList.add(tipo)
}

function cerrarMenu(elementos) {
    overlay.classList.add("oculto");
    for (const j of elementos) {
        j.remove();
    }
}

function abrirMenu(diccionario) {
    const elementos = [];
    for (const i in diccionario) {
        const label = document.createElement("label");
        label.htmlFor = i;
        label.textContent = i;

        const input = document.createElement("input");
        input.id = i;
        input.type = diccionario[i][1];
        input.placeholder = diccionario[i][0];

        contenedor.appendChild(label);
        contenedor.appendChild(input);

        elementos.push(label);
        elementos.push(input);
    }
    return elementos;
}

function crearBoton(id, texto, cont) {
    const boton = document.createElement("button");
    boton.id = id;
    boton.textContent = texto;
    cont.appendChild(boton);
    return boton
}

const botonesAgregados = [
    {
    boton : btnProducto,
    campos : 
        {"producto" : ["Ingrese el nombre del producto", "text"],
            "precio" : ["ingrese el precio del producto", "number"], 
            "stock" : ["Ingrese el stock actual", "number"]
        }
    },
    {
    boton : btnMovimiento,
    campos :
        {"mensaje" : ["Describí el movimiento", "text"],
        "precio" : ["Ingrese el monto del movimiento", "number"]
        }
    }
]

// eventos

for (const configuracion of botonesAgregados) {
    configuracion.boton.addEventListener(
        "click",
        function () {
            overlay.classList.remove("oculto");
            
            const elementos = abrirMenu(configuracion.campos)
            
            if (configuracion.boton === btnMovimiento) {
                const btnGasto = crearBoton("btnGastoNoPress", "Gasto", contenedor)
                elementos.push(btnGasto)
                
                btnGasto.addEventListener(
                    "click",
                    function () {
                        //más lógica del backend
                    }
                )
            }

            const btnConfirmar = crearBoton("btnConfirmar", "confirmar", contenedor);
            elementos.push(btnConfirmar)

            const btnCerrar = crearBoton("btnCerrar", "X", cerrar);
            elementos.push(btnCerrar);

            btnCerrar.addEventListener(
                "click",
                function () {
                cerrarMenu(elementos)
                }
            )

            btnConfirmar.addEventListener(
                "click",
                function() {
                //aca va a ir la lógica del backend
                cerrarMenu(elementos);
                }
            )
        }
    )
}