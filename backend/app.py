from flask import Flask, request
from flask_cors import CORS
import os
from db import obtenerTabla, crear_base, registrarDistribuidor, balance, eliminar, operar, buscarOpciones

app = Flask(__name__)
app.json.sort_keys = False
CORS(app)

crear_base()

"""
@app.route("/url", methods=["metodo"])
def accion():
    datos = request.get_json()

    producto = datos["producto"]

    ---- conexión con la base de datos ----

    return {"estado" : "ok"}
"""

@app.route("/obtener/<tabla>", methods=["GET"])
def devolverTabla(tabla):
    return {"estado" : "ok",
            "registros" : obtenerTabla(tabla)}

@app.route("/enviarDistribuidor", methods=["POST"])
def guardarDistribuidor():
    datos = request.get_json()

    nombre = datos["nombre"]
    direccion = datos["direccion"]
    pagina = datos["pagina"]

    if registrarDistribuidor(nombre, direccion, pagina):
        return {
            "estado" : "ok"
        } 
    else:
        return {
            "estado" : "error"
        }

@app.route("/balance", methods= ["GET"])
def obtenerBalance():
    return {"balance" : balance()}

@app.route("/eliminar", methods=["DELETE"])
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

@app.route("/buscar", methods=["POST"])
def buscar():

    datos = request.get_json()

    tabla = datos["tabla"]
    atributo = datos["atributo"]

    return {
        "estado" : "ok",
        "opciones" : buscarOpciones(tabla, atributo)
    }


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port= int(os.environ.get("PORT", 5000)),
        debug=True
        )