from flask import Flask, request
from flask_cors import CORS
import os
from db import tablaProductos,tablaDistribuidores, tablaGastos, tablaMovStock, crear_base

app = Flask(__name__)
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

tablas = {
    "tablaProductos" : tablaProductos,
    "tablaMoviStock" : tablaMovStock,
    "tablaGastos" : tablaGastos,
    "tablaDistribuidores" : tablaDistribuidores
}

@app.route("/obtener/<tabla>", methods=["GET"])
def devolverTabla(tabla):
    return {"estado" : "ok",
            "tabla" : tablas[tabla]()}



if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port= int(os.environ.get("PORT", 5000)),
        debug=True
        )