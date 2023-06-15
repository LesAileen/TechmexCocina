import React, { useState, useEffect } from "react";
import axios from "axios";

function Cocina() {
  const [tablas, setTablas] = useState([]);
  const [estadoActivo, setEstadoActivo] = useState("PEDIDO");

  useEffect(() => {
    cargarTablas();
  }, []);

  const cargarTablas = async () => {
    try {
      const response = await axios.get("http://192.168.191.41:8090/pedido/list");
      const pedidos = response.data;

      const nuevasTablas = pedidos.map((pedido) => {
        return {
          id: pedido.idFactura,
          estado: pedido.estadoPedido,
          productos: pedido.productos,
          numeroMesa: pedido.numeroMesa,
          opcion: pedido.opcion
        };
      });

      setTablas(nuevasTablas);
    } catch (error) {
      console.log("Error al generar las tablas:", error);
    }
  };

  const actualizarEstadoTabla = async (id) => {
    const facturaId = tablas.find((tabla) => tabla.id === id)?.id;
    
    try {
      await axios.post(`http://192.168.191.41:8090/pedido/pasarEstadoHecho?facturaId=${facturaId}`);
      setTablas((prevTablas) =>
        prevTablas.map((tabla) => (tabla.id === id ? { ...tabla, estado: "HECHO" } : tabla))
      );

      window.location.reload();
    } catch (error) {
      console.log("Error al cambiar el estado a 'HECHO':", error);
    }
    
    setTablas((prevTablas) =>
      prevTablas.map((tabla) => (tabla.id === id ? { ...tabla, estado: "HECHO" } : tabla))
    );
  };

  const cambiarEstadoPagado = async (id) => {

    try {
      await axios.post(`http://192.168.191.41:8090/pedido/pasarEstadoPagado?facturaId=${id}`);
      setTablas((prevTablas) =>
        prevTablas.map((tabla) => (tabla.id === id ? { ...tabla, estado: "HECHO" } : tabla))
      );

      window.location.reload();
    } catch (error) {
      console.log("Error al cambiar el estado a 'HECHO':", error);
    }
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

  return (
    <div className="pantalla">
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
        </div>
        <div className="tablas-wrapper">
          {filtrarTablasPorEstado().map((tabla) => (
            <Tabla
              key={tabla.id}
              id={tabla.id}
              estado={tabla.estado}
              productos={tabla.productos}
              actualizarEstadoTabla={actualizarEstadoTabla}
              cambiarEstadoPagado={cambiarEstadoPagado}
              eliminarTabla={eliminarTabla}
              numeroMesa={tabla.numeroMesa}
              opcion={tabla.opcion}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Tabla({ id, estado, productos, actualizarEstadoTabla, cambiarEstadoPagado, eliminarTabla, numeroMesa, opcion }) {
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
          <th className="encabezado">{opcion}<br />MESA: {numeroMesa}<br />Factura: {id}</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto, index) => (
          <tr key={index}>
            <td className="celda">{producto}</td>
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
