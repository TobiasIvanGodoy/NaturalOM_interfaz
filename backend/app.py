from flask import Flask, request
from flask_cors import CORS
import os 

app = Flask(__name__)
CORS(app)

"""
@app.route("/url", methods=["metodo"])
def accion():
    datos = request.get_json()

    producto = datos["producto"]

    ---- conexión con la base de datos ----

    return {"estado" : "ok"}
"""



if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port= int(os.environ.get("PORT", 5000)),
        debug=True
        )