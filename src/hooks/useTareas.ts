import { useEffect, useState } from 'react';
import type { Tarea } from '../types';

const STORAGE_KEY = 'mis_tareas';

function cargarTareas(): Tarea[] {
  try {
    const guardadas = localStorage.getItem(STORAGE_KEY);
    if (!guardadas) return [];

    const tareas = JSON.parse(guardadas);
    return Array.isArray(tareas) ? tareas : [];
  } catch (error) {
    console.error('Error al inicializar datos:', error);
    return [];
  }
}

export function useTareas() {
  const [tareas, setTareas] = useState<Tarea[]>(cargarTareas);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
    } catch (error) {
      console.error('Error al persistir:', error);
    }
  }, [tareas]);

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

  return { tareas, agregarTarea, alternarTarea };
}