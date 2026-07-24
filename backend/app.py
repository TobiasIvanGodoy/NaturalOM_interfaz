from flask import Flask, request, send_from_directory
from flask_cors import CORS
import os
from db import obtenerTabla, crear_base, registrarDistribuidor, registrarGasto, registrarProducto, registrarMovimiento, balance, eliminar, operar, buscarOpciones, cambiarPrecio

app = Flask(__name__, static_folder="NaturalOM_interfaz")
app.json.sort_keys = False
CORS(app)

crear_base()

@app.route("/")
def index():
    return send_from_directory("NaturalOM_interfaz", "index.html")

#Mostrar

@app.route("/obtener/<tabla>", methods=["GET"])
def devolverTabla(tabla):
    return {"estado" : "ok",
            "registros" : obtenerTabla(tabla)}

@app.route("/balance", methods= ["GET"])
def obtenerBalance():
    return {"balance" : balance()}

@app.route("/buscar", methods=["POST"])
def buscar():

    datos = request.get_json()

    tabla = datos["tabla"]
    atributo = datos["atributo"]

    return {
        "estado" : "ok",
        "opciones" : buscarOpciones(tabla, atributo)
    }

#Guardar 

@app.route("/enviarDistribuidor", methods=["POST"])
def guardarDistribuidor():
    datos = request.get_json()

    distribuidor = datos["distribuidor"]
    direccion = datos["direccion"]
    pagina = datos["pagina"]

    if registrarDistribuidor(distribuidor, direccion, pagina):
        return {
            "estado" : "ok"
        } 
    else:
        return {
            "estado" : "error"
        }

@app.route("/enviarGasto", methods=["POST"])
def guardarGasto():
    datos = request.get_json()

    categoria = datos["categoria"]
    monto = datos["monto"]

    if registrarGasto(categoria, monto):
        return {
                "estado" : "ok"
            } 
    else:
        return {
            "estado" : "error"
        }

@app.route("/enviarProductos", methods=["POST"])
def guardarProducto():
    datos = request.get_json()

    producto = datos["producto"]
    precio = datos["precio"]
    cantidad = datos["cantidad"]
    distribuidor = datos["distribuidor"]

    if registrarProducto(producto, precio, cantidad, distribuidor):
        return {
                "estado" : "ok"
            } 
    else:
        return {
            "estado" : "error"
        }

@app.route("/enviarMovimiento", methods=["POST"])
def guardarMovimiento():
    datos = request.get_json()

    producto = datos["producto"]
    cantidad = datos["cantidad"]
    monto = datos["monto"]

    if registrarMovimiento(producto, cantidad, monto):
        return {
                "estado" : "ok"
            } 
    else:
        return {
            "estado" : "error"
        }

#Modificar

@app.route("/modificar/<modificacion>", methods=["PATCH"])
def modElem(modificacion): 
    datos  = request.get_json()

    parametro = datos["parametro"]
    elem = datos["elem"]
    tabla = datos["tabla"]
    cant = datos["cant"]

    if (modificacion == "restar" or modificacion == "sumar"):
        if operar(parametro, elem, tabla, cant):
            return {"estado" : "ok"}
        else: 
            return {"estado" : "error"}
        
    elif (modificacion == "precio"):
        if cambiarPrecio(parametro, elem, tabla, cant):
            return {"estado" : "ok"}
        else: 
            return {"estado" : "error"}

@app.route("/modificar/eliminar", methods=["DELETE"])
def eliminarElem():

    datos  = request.get_json()

    parametro = datos["parametro"]
    elem = datos["elem"]
    tabla = datos["tabla"]

    if eliminar(parametro, elem, tabla):
        return {"estado" : "ok"}
    else: 
        return {"estado" : "error"}

@app.route("/operar", methods=["UPDATE"])
def actualizarCant():

    datos = request.get_json()

    parametro = datos["parametro"]
    elem = datos["elem"]
    tabla = datos["tabla"]
    cant = datos["cant"]

    if operar(parametro, elem, tabla, cant):
        return {"estado" : "ok"}
    else:
        return {"estado" : "error"}

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port= int(os.environ.get("PORT", 5000)),
        debug=True
        )