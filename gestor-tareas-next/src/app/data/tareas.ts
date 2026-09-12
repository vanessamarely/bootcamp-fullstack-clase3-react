export interface TareaServidor {
  id: number;
  titulo: string;
  completada: boolean;
}

let tareas: TareaServidor[] = [
  { id: 1, titulo: "Aprender fundamentos de React", completada: true },
  { id: 2, titulo: "Entender Server Components y Next.js", completada: false },
];

export async function obtenerTareas() {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return tareas;
}

export function guardarTarea(titulo: string) {
  tareas = [
    ...tareas,
    { id: Date.now(), titulo, completada: false },
  ];
}