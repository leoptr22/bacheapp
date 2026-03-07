export default function MarkerPopup({ bache, onResolver }) {

  function colorEstado(estado){
    switch(estado){
      case "Reparar": return "danger"
      case "En reparación": return "warning"
      case "Solucionado": return "success"
      default: return "secondary"
    }
  }

  function colorSeveridad(sev){
    switch(sev){
      case "Alta": return "danger"
      case "Media": return "warning"
      case "Baja": return "success"
      default: return "secondary"
    }
  }

  return (
    <div style={{width:"220px"}}>

      <h6>Bache 🚧</h6>

      {bache.foto ? (
        <img
          src={bache.foto}
          alt="bache"
          style={{
            width:"100%",
            borderRadius:"6px",
            marginBottom:"6px"
          }}
        />
      ) : (
        <p>Sin foto</p>
      )}

      <p style={{fontSize:"12px"}}>
        <strong>Dirección:</strong><br/>
        {bache.direccion}
      </p>

      <p>
        Estado:{" "}
        <span className={`badge bg-${colorEstado(bache.estado)}`}>
          {bache.estado}
        </span>
      </p>

      <p>
        Severidad:{" "}
        <span className={`badge bg-${colorSeveridad(bache.severidad)}`}>
          {bache.severidad}
        </span>
      </p>

      <button
        className="btn btn-success btn-sm"
        onClick={() => onResolver(bache.id)}
      >
        Resuelto
      </button>

    </div>
  )
}