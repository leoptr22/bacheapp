import { useEffect, useState } from "react";

const NoticiasModal = () => {
  const [noticias, setNoticias] = useState([]);
  const [show, setShow] = useState(false);

  const WORKER_URL = "https://gualebaches.leonelpiter.workers.dev";

  useEffect(() => {
    fetch(WORKER_URL)
      .then(res => res.json())
      .then(data => {
        // Filtramos para no mostrar el mensaje de "Sin cortes" o errores como noticia
        const noticiasReales = data.filter(n => n.titulo && !n.titulo.includes("Sin cortes") && !n.titulo.includes("Error"));
        
        if (noticiasReales.length > 0) {
          setNoticias(noticiasReales);
          setShow(true);
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (!show) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
      style={{ 
        zIndex: 2000, 
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '15px' // Espacio para que no toque los bordes del celu
      }}
    >
      <div 
        className="modal-content border-0 shadow-lg" 
        style={{ 
          maxWidth: '450px', 
          width: '100%', 
          borderRadius: '15px', 
          backgroundColor: '#fff',
          maxHeight: '85vh', // Que no tape toda la pantalla vertical
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Cabecera */}
        <div className="modal-header bg-warning text-dark" style={{ borderRadius: '15px 15px 0 0' }}>
          <h6 className="modal-title fw-bold">
            ⚠️ Avisos de Gualeguaychú
          </h6>
          <button
            className="btn-close"
            onClick={() => setShow(false)}
          />
        </div>

        {/* Cuerpo con Scroll */}
        <div 
          className="modal-body" 
          style={{ 
            overflowY: 'auto', 
            padding: '15px',
            WebkitOverflowScrolling: 'touch' // Suaviza el scroll en iPhone
          }}
        >
          {noticias.map((item, index) => (
            <div key={index} className="card mb-3 border-0 shadow-sm" style={{ backgroundColor: '#f9f9f9' }}>
              {item.foto && item.foto.includes('http') && (
                <img
                  src={item.foto}
                  className="card-img-top"
                  alt="noticia"
                  style={{ height: '140px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body p-3">
                <p className="card-text fw-bold mb-2" style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>
                  {item.titulo}
                </p>
                <a
                  href="https://www.gualeguaychu.gov.ar/noticias"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-sm w-100"
                >
                  Leer noticia completa
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Pie opcional */}
        <div className="modal-footer p-2 border-0 justify-content-center">
          <small className="text-muted" style={{ fontSize: '10px' }}>
            Desliza para ver más avisos
          </small>
        </div>
      </div>
    </div>
  );
};

export default NoticiasModal;