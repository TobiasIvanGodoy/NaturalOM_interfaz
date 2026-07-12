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
btnProducto.addEventListener(
    "click",
    function () {
        const elementos = [];

        overlay.classList.remove("oculto");
        const lista = ["producto", "precio", "stock"];
        for (const i of lista) {
            const label = document.createElement("label");
            label.htmlFor = i;
            label.textContent = i;

            const input = document.createElement("input");
            input.id = i;
            input.type = (i === "precio" || i === "stock") ? "number" : "text";
            input.placeholder = `Ingrese el ${i}...`
            
            contenedor.appendChild(label);
            contenedor.appendChild(input);

            elementos.push(label);
            elementos.push(input);
            }
        
        const btnConfirmar = document.createElement("button");
        btnConfirmar.id = "btnConfirmar";
        btnConfirmar.textContent = "confirmar";
        contenedor.appendChild(btnConfirmar);
        elementos.push(btnConfirmar)

        const btnCerrar = document.createElement("button");
        btnCerrar.id = "btnCerrar";
        btnCerrar.textContent = "X";
        cerrar.appendChild(btnCerrar);
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

btnMovimiento.addEventListener(
    "click",
    function () {
        const elementos = [];

        overlay.classList.remove("oculto");
        const lista = ["mensaje", "monto"];
        for (const i of lista) {
            const label = document.createElement("label");
            label.htmlFor = i;
            label.textContent = i;

            const input = document.createElement("input");
            input.id = i;
            input.type = (i === "monto") ? "number" : "text";
            input.placeholder = `Ingrese el ${i} del movimiento...`

            contenedor.appendChild(label);
            contenedor.appendChild(input);

            elementos.push(label);
            elementos.push(input);
            }
        
        const btnConfirmar = document.createElement("button");
        btnConfirmar.id = "btnConfirmar";
        btnConfirmar.textContent = "confirmar";
        contenedor.appendChild(btnConfirmar);
        elementos.push(btnConfirmar)

        const btnCerrar = document.createElement("button");
        btnCerrar.id = "btnCerrar";
        btnCerrar.textContent = "X";
        cerrar.appendChild(btnCerrar);

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