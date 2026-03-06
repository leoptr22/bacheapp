
export default function Formulario({ 
  mostrarForm, 
  setMostrarForm, 
  estado, 
  setEstado, 
  severidad, 
  setSeveridad, 
  guardarBache 
}) {
  
  // Si no hay que mostrarlo, retornamos null para no renderizar nada
  if (!mostrarForm) return null;

  return (
    <div
      className="card position-fixed bottom-0 start-50 translate-middle-x shadow p-3"
      style={{ width: "420px", zIndex: 9999, marginBottom: "20px" }}
    >
      <h5>Nuevo Bache 🚧</h5>

      <label>Estado</label>
      <select
        className="form-select"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      >
        <option>Reparar</option>
        <option>En reparación</option>
        <option>Solucionado</option>
      </select>

      <label className="mt-2">Severidad</label>
      <select
        className="form-select"
        value={severidad}
        onChange={(e) => setSeveridad(e.target.value)}
      >
        <option>Baja</option>
        <option>Media</option>
        <option>Alta</option>
      </select>

      <div className="d-flex gap-2 mt-2">
        <button className="btn btn-success" onClick={guardarBache}>
          Guardar
        </button>

        <button className="btn btn-secondary" onClick={() => setMostrarForm(false)}>
          Cancelar
        </button>
      </div>
    </div>
  );
}