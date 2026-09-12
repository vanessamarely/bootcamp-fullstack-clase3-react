"use client";

import { agregarTareaAction } from "../actions";

export function FormularioClient() {
  return (
    <form action={agregarTareaAction} className="task-form">
      <label className="sr-only" htmlFor="titulo">
        Nueva tarea
      </label>
      <input
        id="titulo"
        name="titulo"
        placeholder="Nueva tarea para el servidor..."
        required
        type="text"
      />
      <button type="submit">Guardar</button>
    </form>
  );
}