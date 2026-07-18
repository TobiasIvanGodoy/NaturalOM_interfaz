import sqlite3
import pandas as pd
from werkzeug import security
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ruta = BASE_DIR / "naturalOM.db"

def crear_base():

    conexion = sqlite3.connect(ruta)
    cursor = conexion.cursor()

    cursor.execute("PRAGMA foreign_keys = ON")

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS distribuidores(
        distribuidor TEXT PRIMARY KEY,
        direccion TEXT NOT NULL,
        pagina_web TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS productos(
        producto TEXT PRIMARY KEY,
        precio REAL NOT NULL,
        cantidad INTEGER NOT NULL,
        distribuidor TEXT NOT NULL,
        FOREIGN KEY (distribuidor) REFERENCES distribuidores(distribuidor)
    )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS movimientos(
        fecha TEXT NOT NULL,
        hora TEXT NOT NULL,
        categoria TEXT NOT NULL,
        producto TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        monto REAL NOT NULL,
        PRIMARY KEY (fecha, hora),
        FOREIGN KEY (producto) REFERENCES productos(producto)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gastos(
        fecha TEXT NOT NULL,
        hora TEXT NOT NULL,
        categoria TEXT NOT NULL,
        monto REAL NOT NULL,
        PRIMARY KEY (fecha, hora)
        )
    """)


    conexion.commit()
    conexion.close()

def tablaProductos():
    pass

def tablaMovStock():
    pass

def tablaGastos():
    pass

def tablaDistribuidores():
    pass