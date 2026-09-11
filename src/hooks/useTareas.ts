import { useState, useEffect, useRef } from 'react';
import type { Tarea } from '../types';

const STORAGE_KEY = 'mis_tareas';

export function useTareas() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    try {
      const guardadas = localStorage.getItem(STORAGE_KEY);
      if (guardadas) {
        setTareas(JSON.parse(guardadas));
      }
    } catch (error) {
      console.error('Error al inicializar datos:', error);
    } finally {
      isLoadedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!isLoadedRef.current) return;
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