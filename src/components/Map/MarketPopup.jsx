
import React from 'react';

export default function MarkerPopup({ bache, onResolver }) {
  // Verificación de seguridad por si el bache no llega correctamente
  if (!bache) return null;

  return (
    <div style={{ minWidth: "160px" }}>
      <h6 className="border-bottom pb-2">Reporte de Bache 🚧</h6>
      
      <div className="mb-2">
        <strong>Dirección:</strong>
        <p className="text-muted small mb-1">{bache.direccion || "Cargando dirección..."}</p>
      </div>

      <div className="mb-2">
        <strong>Severidad:</strong> 
        <span className={`badge ms-2 ${
          bache.severidad === 'Alta' ? 'bg-danger' : 
          bache.severidad === 'Media' ? 'bg-warning text-dark' : 'bg-info'
        }`}>
          {bache.severidad}
        </span>
      </div>

      <div className="mb-2">
        <strong>Estado:</strong> 
        <span className="small">{bache.estado}</span>
      </div>

      <button
        className="btn btn-success btn-sm w-100 mt-2"
        onClick={() => onResolver(bache.id)}
      >
        Marcar como Resuelto ✅
      </button>
    </div>
  );
}