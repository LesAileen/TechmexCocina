import React, { useState } from "react";

function Cocina() {
  const [tablas, setTablas] = useState([]);
  const [idTabla, setIdTabla] = useState(1);
  const [estadoActivo, setEstadoActivo] = useState("PEDIDO");

  const generarTabla = () => {
    setTablas([...tablas, { id: idTabla, estado: "PEDIDO" }]);
    setIdTabla(idTabla + 1);
  };

  const actualizarEstadoTabla = (id) => {
    setTablas((prevTablas) =>
      prevTablas.map((tabla) => (tabla.id === id ? { ...tabla, estado: "HECHO" } : tabla))
    );
  };

  const cambiarEstadoPagado = (id) => {
    setTablas((prevTablas) =>
      prevTablas.map((tabla) => (tabla.id === id && tabla.estado === "HECHO" ? { ...tabla, estado: "PAGADO" } : tabla))
    );
  };

  const eliminarTabla = (id) => {
    setTablas((prevTablas) => prevTablas.filter((tabla) => tabla.id !== id));
  };

  const handleTabClick = (estado) => {
    setEstadoActivo(estado);
  };

  const filtrarTablasPorEstado = () => {
    return tablas.filter((tabla) => tabla.estado === estadoActivo);
  };

  // Ejemplo de lista de productos
  const productos = [
    { id: 1, nombre: "Producto 1", mesa: 1 },
    { id: 2, nombre: "Producto 2", mesa: 2 },
    { id: 3, nombre: "Producto 3", mesa: 3 },
    // Agrega más productos según tus necesidades
  ];

  return (
    <div className="pantalla">
      <button onClick={generarTabla}>Generar Tabla</button>
      <div className="tablas-container">
        <div className="barra-navegacion">
          <button
            className={estadoActivo === "PEDIDO" ? "pestaña-activa" : ""}
            onClick={() => handleTabClick("PEDIDO")}
          >
            PEDIDO
          </button>
          <button
            className={estadoActivo === "HECHO" ? "pestaña-activa" : ""}
            onClick={() => handleTabClick("HECHO")}
          >
            HECHO
          </button>
          <button
            className={estadoActivo === "PAGADO" ? "pestaña-activa" : ""}
            onClick={() => handleTabClick("PAGADO")}
          >
            PAGADO
          </button>
        </div >
        <div className="tablas-wrapper">
          {filtrarTablasPorEstado().map((tabla) => (
            <Tabla
              key={tabla.id}
              id={tabla.id}
              estado={tabla.estado}
              productos={productos} // Pasamos la lista de productos como prop
              actualizarEstadoTabla={actualizarEstadoTabla}
              cambiarEstadoPagado={cambiarEstadoPagado}
              eliminarTabla={eliminarTabla}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Tabla({ id, estado, productos, actualizarEstadoTabla, cambiarEstadoPagado, eliminarTabla }) {
  const handleClick = () => {
    if (estado === "PEDIDO") {
      actualizarEstadoTabla(id);
    } else if (estado === "HECHO") {
      cambiarEstadoPagado(id);
    }
  };

  return (
    <table className={`tabla ${estado === "HECHO" ? "hecho" : ""} ${estado === "PAGADO" ? "pagado" : ""}`} onClick={handleClick}>
      <thead>
        <tr>
          <th className="encabezado">Tomar o llevar<br />Mesa: {id}</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto) => (
          <tr key={producto.id}>
            <td className="celda">{producto.nombre}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td className={`pedido ${estado === "HECHO" ? "hecho" : ""}`} colSpan="2">
            {estado}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

export default Cocina;
