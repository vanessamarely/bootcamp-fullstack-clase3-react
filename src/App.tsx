import { useState, useEffect, useRef } from 'react'
import './App.css'
import type { Tarea, Filtro } from './types';

const STORAGE_KEY = 'mis_tareas';

function App() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [titulo, setTitulo] = useState('');
  const isLoadedRef = useRef(false);

  // 1. Carga inicial asíncrona al montar el componente (previene Hydration Mismatches)
  useEffect(() => {
    try {
      const guardadas = localStorage.getItem(STORAGE_KEY);
      if (guardadas) {
        setTareas(JSON.parse(guardadas));
      }
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
    } finally {
      isLoadedRef.current = true;
    }
  }, []);

  // 2. Persistencia continua: solo escribe si ya se cargaron los datos existentes
  useEffect(() => {
    if (!isLoadedRef.current) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
      const pendientes = tareas.filter((t) => !t.completada).length;
      document.title = `Pendientes: ${pendientes}`;
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }, [tareas]); // Solo se dispara cuando el arreglo 'tareas' cambia

  const agregarTarea = (titulo: string) => {
    const textoLimpio = titulo.trim();
    if (!textoLimpio) return;

    const nueva: Tarea = { id: Date.now(), titulo: textoLimpio, completada: false };
    setTareas((prev) => [...prev, nueva]);
  };

  const alternarTarea = (id: number) => {
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t))
    );
  };

  // Dato derivado calculado directamente en el cuerpo de la función sin useEffect redundante
  const tareasVisibles = tareas.filter((t) => {
    if (filtro === 'pendientes') return !t.completada;
    if (filtro === 'completadas') return t.completada;
    return true;
  });

  return (
    <> <main style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: 450, margin: '0 auto' }}>
      <h1>Mis Tareas ({tareas.length})</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          agregarTarea(titulo);
          setTitulo('');
        }}
      >
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Nueva tarea..."
        />
        <button type="submit">Agregar</button>
      </form>

      <div style={{ margin: '15px 0' }}>
        <button onClick={() => setFiltro('todas')}>Todas</button>
        <button onClick={() => setFiltro('pendientes')}>Pendientes</button>
        <button onClick={() => setFiltro('completadas')}>Completadas</button>
      </div>

      <ul>
        {tareasVisibles.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.completada}
              onChange={() => alternarTarea(t.id)}
            />
            {t.titulo}
          </li>
        ))}
      </ul>
    </main>

    </>
  )
}

export default App
