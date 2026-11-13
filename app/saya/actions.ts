"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { pendaftar } from "@/data/ekskul";

export async function batalkanPendaftaranAction(ekskulId: number) {
  const cookieStore = await cookies();
  const namaCookie = cookieStore.get("nama")?.value || "";
  const kelasCookie = cookieStore.get("kelas")?.value || "";

  if (!namaCookie || !kelasCookie) {
    return { success: false, message: "Cookie tidak ditemukan." };
  }

  // Cari index berdasarkan ekskulId serta nama & kelas dari cookie
  const index = pendaftar.findIndex(
    (p) => 
      p.ekskulId === ekskulId &&
      p.nama.toLowerCase() === namaCookie.toLowerCase() &&
      p.kelas.toLowerCase() === kelasCookie.toLowerCase()
  );

  if (index !== -1) {
    pendaftar.splice(index, 1);
  }

  revalidatePath("/saya");
  revalidatePath("/ekskul");

  return { success: true };
}