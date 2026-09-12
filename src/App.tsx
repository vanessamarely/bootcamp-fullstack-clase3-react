import { useDeferredValue, useEffect, useState, useTransition } from 'react';
import './App.css';
import { useTareas } from './hooks/useTareas';
import type { Filtro } from './types';

const filtros: { valor: Filtro; etiqueta: string }[] = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'pendientes', etiqueta: 'Pendientes' },
  { valor: 'completadas', etiqueta: 'Completadas' },
];

function App() {
  const { tareas, agregarTarea, alternarTarea } = useTareas();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [titulo, setTitulo] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [isPending, startTransition] = useTransition();
  const busquedaDiferida = useDeferredValue(busqueda);

  useEffect(() => {
    const pendientes = tareas.filter((tarea) => !tarea.completada).length;
    document.title = `Pendientes: ${pendientes}`;
  }, [tareas]);

  const tareasVisibles = tareas.filter((tarea) => {
    const coincideFiltro =
      filtro === 'todas' ||
      (filtro === 'pendientes' && !tarea.completada) ||
      (filtro === 'completadas' && tarea.completada);
    const coincideBusqueda = tarea.titulo
      .toLowerCase()
      .includes(busquedaDiferida.trim().toLowerCase());

    return coincideFiltro && coincideBusqueda;
  });

  const cambiarFiltro = (nuevoFiltro: Filtro) => {
    startTransition(() => {
      setFiltro(nuevoFiltro);
    });
  };

  const enviarTarea = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!titulo.trim()) return;

    agregarTarea(titulo);
    setTitulo('');
  };

  return (
    <main className="task-app">
      <header className="task-app__header">
        <p className="task-app__eyebrow">Gestor de tareas</p>
        <h1>Mis tareas</h1>
        <p>{tareas.length} tareas en total</p>
      </header>

      <form className="task-form" onSubmit={enviarTarea}>
        <label className="sr-only" htmlFor="nueva-tarea">Nueva tarea</label>
        <input
          id="nueva-tarea"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          placeholder="Nueva tarea..."
        />
        <button type="submit">Agregar</button>
      </form>

      <section className="task-controls" aria-label="Filtros y búsqueda">
        <div className="filter-list" role="group" aria-label="Filtrar tareas">
          {filtros.map(({ valor, etiqueta }) => (
            <button
              className={filtro === valor ? 'is-active' : ''}
              key={valor}
              onClick={() => cambiarFiltro(valor)}
              type="button"
            >
              {etiqueta}
            </button>
          ))}
        </div>
        <label className="search-field" htmlFor="buscar-tareas">
          <span className="sr-only">Buscar tareas</span>
          <input
            id="buscar-tareas"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar tareas..."
          />
        </label>
      </section>

      {(isPending || busquedaDiferida !== busqueda) && (
        <p className="task-app__updating" aria-live="polite">Actualizando resultados...</p>
      )}

      <ul className="task-list" aria-busy={isPending || busquedaDiferida !== busqueda}>
        {tareasVisibles.map((tarea) => (
          <li className={tarea.completada ? 'is-complete' : ''} key={tarea.id}>
            <label>
              <input
                checked={tarea.completada}
                onChange={() => alternarTarea(tarea.id)}
                type="checkbox"
              />
              <span>{tarea.titulo}</span>
            </label>
          </li>
        ))}
      </ul>

      {tareasVisibles.length === 0 && (
        <p className="task-app__empty">No hay tareas que coincidan con los filtros.</p>
      )}
    </main>
  );
}

export default App;
