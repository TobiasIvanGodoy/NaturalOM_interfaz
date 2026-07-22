import sqlite3
import pandas as pd
from werkzeug import security
from pathlib import Path
import time

BASE_DIR = Path(__file__).resolve().parent
ruta = BASE_DIR / "naturalOM.db"

def crear_base():

    conexion = sqlite3.connect(ruta)
    cursor = conexion.cursor()

    cursor.execute("PRAGMA foreign_keys = ON")

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS distribuidores(
        nombre TEXT PRIMARY KEY,
        direccion TEXT NOT NULL,
        pagina TEXT NOT NULL
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

def registrarDistribuidor(nombre, direccion, pagina):
    conexion = sqlite3.connect(ruta)
    cursor = conexion.cursor()    

    try:
    
        cursor.execute(
            """
            INSERT INTO distribuidores(nombre, direccion, pagina)
            VALUES (?, ?, ?)
            """,
            (str(nombre), str(direccion), str(pagina))
        )

        conexion.commit()

        return True
    
    except sqlite3.IntegrityError:
    
        return False
    
    finally:
        conexion.close()

def tablaProductos():
    pass

def tablaMovStock():

    conexion = sqlite3.connect(ruta)
    consulta = pd.read_sql_query("""
                SELECT * FROM movimientos
    """, conexion)

    return consulta

def balance():
    conexion = sqlite3.connect(ruta)
    cursor = conexion.cursor()

    cursor.execute("SELECT COALESCE(SUM(monto), 0) FROM movimientos")
    movimientos = int(cursor.fetchone()[0])

    cursor.execute("SELECT COALESCE(SUM(monto), 0) FROM gastos")
    gastos = int(cursor.fetchone()[0])

    conexion.close()

    return movimientos + gastos

def tablaGastos():
    pass

def tablaDistribuidores():

    res = []
    conexion = sqlite3.connect(ruta)
    consulta = pd.read_sql_query("""
                SELECT * FROM distribuidores
    """, conexion)

    conexion.close()

    return consulta.to_dict(orient="records")

def eliminar(parametro, elem, tabla):
    conexion = sqlite3.connect(ruta)
    cursor = conexion.cursor()
    print(f"DELETE FROM {tabla} WHERE {parametro} = ?")

    cursor.execute(f"DELETE FROM {tabla} WHERE {parametro}=?",(elem,))

    conexion.commit()

    return True
