import { Suspense } from "react";
import { FormularioClient } from "./FormularioClient";
import { obtenerTareas } from "../data/tareas";

async function ListaTareasServidor() {
  const tareas = await obtenerTareas();

  return (
    <ul className="task-list">
      {tareas.map((tarea) => (
        <li key={tarea.id}>
          <span aria-hidden="true">{tarea.completada ? "[x]" : "[ ]"}</span>
          {tarea.titulo}
        </li>
      ))}
    </ul>
  );
}

export default function PaginaTareas() {
  return (
    <main className="page">
      <header>
        <p className="eyebrow">Next.js App Router</p>
        <h1>Gestor de tareas</h1>
        <p className="subtitle">Server Components, streaming SSR y Server Actions.</p>
      </header>

      <section className="panel" aria-labelledby="nueva-tarea">
        <h2 id="nueva-tarea">Nueva tarea</h2>
        <FormularioClient />
      </section>

      <section className="panel" aria-labelledby="listado-remoto">
        <h2 id="listado-remoto">Listado remoto</h2>
        <Suspense fallback={<p className="loading">Transmitiendo datos desde el servidor...</p>}>
          <ListaTareasServidor />
        </Suspense>
      </section>
    </main>
  );
}