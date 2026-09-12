"use server";

import { revalidatePath } from "next/cache";
import { guardarTarea } from "./data/tareas";

export async function agregarTareaAction(formData: FormData) {
  const titulo = formData.get("titulo");

  if (typeof titulo !== "string" || !titulo.trim()) return;

  guardarTarea(titulo.trim());
  revalidatePath("/tareas");
}