import sqlite3
import pandas as pd
from pathlib import Path
from datetime import datetime

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

def registrarDistribuidor(distribuidor, direccion, pagina):
    conexion = sqlite3.connect(ruta)
    cursor = conexion.cursor()    

    try:
    
        cursor.execute(
            """
            INSERT INTO distribuidores(distribuidor, direccion, pagina)
            VALUES (?, ?, ?)
            """,
            (str(distribuidor), str(direccion), str(pagina))
        )

        conexion.commit()

        return True
    
    except sqlite3.IntegrityError:
    
        return False
    
    finally:
        conexion.close()

def registrarGasto(categoria, monto):
    conexion = sqlite3.connect(ruta)
    cursor = conexion.cursor()    

    try:
        ahora = datetime.now()
        fecha = ahora.date().strftime("%d-%m-%y")
        hora = ahora.time()
        cursor.execute(
            """
            INSERT INTO gastos(categoria, monto, fecha, hora)
            VALUES (?, ?, ?, ?)
            """,
            (str(categoria), float(monto)*(-1), str(fecha), str(hora))
        )

        conexion.commit()

        return True
    
    except sqlite3.IntegrityError:
    
        return False
    
    finally:
        conexion.close()

def registrarProducto(producto, precio, cantidad, distribuidor):
    conexion = sqlite3.connect(ruta)
    cursor = conexion.cursor()    

    try:
        cursor.execute(
            """
            INSERT INTO productos(producto, precio, cantidad, distribuidor)
            VALUES (?, ?, ?, ?)
            """,
            (str(producto), int(precio), int(cantidad), str(distribuidor))
        )

        conexion.commit()

        return True
    
    except sqlite3.IntegrityError:
    
        return False
    
    finally:
        conexion.close()

def registrarMovimiento(producto, cantidad , monto, valor):
    conexion = sqlite3.connect(ruta)
    cursor = conexion.cursor()    

    try:
        ahora = datetime.now()
        fecha = ahora.date().strftime("%d-%m-%y")
        hora = ahora.time()
        cursor.execute(
            """
            INSERT INTO movimientos(categoria, producto, cantidad, monto, fecha, hora)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            ("reponer", str(producto), int(cantidad), float(monto)*(-1), str(fecha), str(hora))
        )

        if valor == True:
            cursor.execute(f"UPDATE productos SET cantidad = cantidad+({cantidad}) WHERE producto = ?", (producto,))

        conexion.commit()

        return True
    
    except sqlite3.IntegrityError:
    
        return False
    
    finally:
        conexion.close()

def balance():
    conexion = sqlite3.connect(ruta)
    cursor = conexion.cursor()

    cursor.execute("SELECT COALESCE(SUM(monto), 0) FROM movimientos")
    movimientos = int(cursor.fetchone()[0])

    cursor.execute("SELECT COALESCE(SUM(monto), 0) FROM gastos")
    gastos = int(cursor.fetchone()[0])

    conexion.close()

    return movimientos + gastos

def obtenerTabla(tabla):
    
    conexion = sqlite3.connect(ruta)
    consulta = pd.read_sql_query(f"SELECT * FROM {tabla}", conexion)

    conexion.close()

    return consulta.to_dict(orient="records")

def eliminar(parametro, elem, tabla):
    conexion = sqlite3.connect(ruta)
    cursor = conexion.cursor()

    if isinstance(elem, list):
        cursor.execute(f"DELETE FROM {tabla} WHERE {parametro[0]}=? AND {parametro[1]}=?",(elem[0],elem[1]))
        
    else:
        cursor.execute(f"DELETE FROM {tabla} WHERE {parametro}=?",(elem,))

    conexion.commit()

    return True

def operar(parametro, elem, tabla, cant, valor):


    conexion = sqlite3.connect(ruta)

    cursor = conexion.cursor()

    cursor.execute(f"UPDATE {tabla} SET cantidad = cantidad+({cant}) WHERE {parametro} = ?", (elem,))

    if (cant <= 0) and (valor == True):
        ahora = datetime.now()
        fecha = ahora.date().strftime("%d-%m-%y")
        hora = ahora.time()
        cant_vendida = cant*(-1)
        precio = pd.read_sql_query("SELECT precio FROM productos WHERE producto =?", conexion, params=(elem,))["precio"].iloc[0]
        monto_total = precio*(cant_vendida)

        cursor.execute(f"INSERT INTO movimientos(fecha, hora, categoria, producto, cantidad, monto) VALUES (?,?,?,?,?,?)",(str(fecha), str(hora), "venta", elem, cant_vendida, monto_total))

    conexion.commit()

    return True

def cambiarPrecio(parametro, elem, tabla, precioNuevo):
    conexion = sqlite3.connect(ruta)

    cursor = conexion.cursor()

    cursor.execute(f"UPDATE {tabla} SET precio = ? WHERE {parametro} = ?", (precioNuevo, elem))


    conexion.commit()

    return True

def buscarOpciones(tabla, atributo):

    conexion = sqlite3.connect(ruta)
    df = pd.read_sql_query(f"SELECT {atributo} FROM {tabla}", conexion)
    conexion.close()
    res = df[atributo].tolist()
    return res

