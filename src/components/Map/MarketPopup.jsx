export default function MarkerPopup({ bache, onResolver }) {
  
  // --- LÓGICA DE FECHA ROBUSTA ---
  const procesarFecha = (fechaRaw) => {
    // Si no hay fecha (porque no hay BD aún), usamos la fecha de hoy por defecto
    const fechaFinal = fechaRaw ? new Date(fechaRaw) : new Date();
    
    // Si la fecha que llega es inválida, usamos hoy
    const fechaValida = isNaN(fechaFinal.getTime()) ? new Date() : fechaFinal;

    const hoy = new Date();
    const diferenciaMs = hoy.getTime() - fechaValida.getTime();
    const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

    return {
      formateada: fechaValida.toLocaleDateString(),
      dias: dias < 0 ? 0 : dias
    };
  };

  const { formateada, dias } = procesarFecha(bache.fecha);

  // HELPERS DE COLORES 
  const getColorEstado = (estado) => {
    const colores = { "Reparar": "danger", "En reparación": "warning", "Solucionado": "success" };
    return colores[estado] || "secondary";
  };

  const getColorSeveridad = (sev) => {
    const colores = { "Alta": "danger", "Media": "warning", "Baja": "success" };
    return colores[sev] || "secondary";
  };

  return (
    <div style={{ width: "220px", padding: "2px" }}>
      <h6 className="border-bottom pb-2 mb-2 text-primary">Reporte de Bache 🚧</h6>

      {/* Imagen con fallback si no hay foto */}
      {bache.foto ? (
        <img
          src={bache.foto}
          alt="Bache"
          style={{ width: "100%", height: "110px", objectFit: "cover", borderRadius: "6px", marginBottom: "8px" }}
        />
      ) : (
        <div className="text-center bg-light p-3 mb-2 border rounded text-muted" style={{ fontSize: '11px' }}>
          Sin foto disponible
        </div>
      )}

      <div style={{ fontSize: "13px" }}>
        <p className="mb-1"><strong>📍 Dirección:</strong><br/> {bache.direccion || "No cargada"}</p>
        
        <p className="mb-2 text-muted" style={{ fontSize: "12px" }}>
          🗓️ <strong>Reportado:</strong> {formateada} 
          <span className="ms-1 fw-bold text-dark">
            ({dias === 0 ? "hoy" : `hace ${dias} d.`})
          </span>
        </p>

        <div className="row g-1 mb-3">
          <div className="col-6">
            <small className="d-block text-uppercase text-muted" style={{fontSize: '9px'}}>Estado</small>
            <span className={`badge w-100 bg-${getColorEstado(bache.estado)}`}>{bache.estado || "Reparar"}</span>
          </div>
          <div className="col-6">
            <small className="d-block text-uppercase text-muted" style={{fontSize: '9px'}}>Severidad</small>
            <span className={`badge w-100 bg-${getColorSeveridad(bache.severidad)}`}>{bache.severidad || "Baja"}</span>
          </div>
        </div>
      </div>

      <button
        className="btn btn-success btn-sm w-100 shadow-sm"
        onClick={() => {
          if(confirm("¿Confirmas que el bache fue reparado?")) {
            onResolver(bache.id);
          }
        }}
      >
        ✔ Marcar Resuelto
      </button>
    </div>
  );
}