import React, { useState } from "react";

function Cocina() {
  const [tablas, setTablas] = useState([]);
  const [idTabla, setIdTabla] = useState(1);

  const generarTabla = () => {
    setTablas([...tablas, idTabla]);
    setIdTabla(idTabla + 1);
  };

  const eliminarTabla = (id) => {
    const nuevasTablas = tablas.filter((tabla) => tabla !== id);
    setTablas(nuevasTablas);
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
        {tablas.map((id) => (
          <Tabla key={id} id={id} eliminarTabla={eliminarTabla} />
        ))}
      </div>
    </div>
  );
}

function Tabla({ id, eliminarTabla }) {
  const productos = [
    { id: 1, nombre: "Producto 1", mesa: 1 },
    { id: 2, nombre: "Producto 2", mesa: 2 },
    { id: 3, nombre: "Producto 3", mesa: 3 },
    // Agrega más productos según tus necesidades
  ];

  return (
    <table className="tabla" onClick={() => eliminarTabla(id)}>
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
    </table>
  );
}

export default Cocina;
