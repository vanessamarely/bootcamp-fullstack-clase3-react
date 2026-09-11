export interface Tarea {
  id: number;
  titulo: string;
  completada: boolean;
}

export type Filtro = 'todas' | 'pendientes' | 'completadas';

