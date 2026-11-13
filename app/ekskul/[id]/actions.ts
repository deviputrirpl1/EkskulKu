"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ambilEkskul, ambilAnggota, ambilSemuaEkskul } from "@/data/ambil";
import { pendaftar, JAM_SESI } from "@/data/ekskul";

export async function daftarEkskulAction(ekskulId: number, prevState: unknown, formData: FormData) {
  const nama = (formData.get("nama") as string)?.trim() || "";
  const kelas = (formData.get("kelas") as string)?.trim() || "";

  const errors: { nama?: string; kelas?: string } = {};

  // 1. Validasi minimal 3 huruf/karakter (galat per kolom)
  if (nama.length < 3) {
    errors.nama = "Nama minimal 3 huruf.";
  }
  if (kelas.length < 3) {
    errors.kelas = "Kelas minimal 3 karakter.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      fields: { nama, kelas },
    };
  }

  // Ambil data ekskul yang dituju
  const targetEkskul = await ambilEkskul(ekskulId);
  if (!targetEkskul) {
    return { success: false, message: "ID ekskul tidak valid.", fields: { nama, kelas } };
  }

  // Ambil daftar anggota saat ini untuk ekskul ini
  const anggotaEkskul = await ambilAnggota(ekskulId);

  // 2. Validasi: Sudah terdaftar di ekskul yang sama
  const sudahTerdaftar = anggotaEkskul.some(
    (p) => p.nama.toLowerCase() === nama.toLowerCase() && p.kelas.toLowerCase() === kelas.toLowerCase()
  );
  if (sudahTerdaftar) {
    return {
      success: false,
      message: `${nama} (${kelas}) sudah terdaftar di ekskul ini.`,
      fields: { nama, kelas },
    };
  }

  // 3. Validasi: Kuota penuh
  if (anggotaEkskul.length >= targetEkskul.kuota) {
    return {
      success: false,
      message: `Kuotanya sudah penuh (${targetEkskul.kuota} orang).`,
      fields: { nama, kelas },
    };
  }

  // 4. Validasi: Bentrok jadwal (hari dan sesi sama dengan ekskul lain)
  const semuaEkskul = await ambilSemuaEkskul();
  const pendaftarUser = pendaftar.filter(
    (p) => p.nama.toLowerCase() === nama.toLowerCase() && p.kelas.toLowerCase() === kelas.toLowerCase()
  );

  for (const p of pendaftarUser) {
    const ekskulDiikuti = semuaEkskul.find((e) => e.id === p.ekskulId);
    if (ekskulDiikuti && ekskulDiikuti.hari === targetEkskul.hari && ekskulDiikuti.sesi === targetEkskul.sesi) {
      return {
        success: false,
        message: `Jadwal bentrok dengan ${ekskulDiikuti.nama} (${targetEkskul.hari}, sesi ${targetEkskul.sesi}).`,
        fields: { nama, kelas },
      };
    }
  }

  // ==========================================
  // JIKA BERHASIL:
  // ==========================================
        pendaftar.push({
  nomor: (pendaftar.length + 1),
  ekskulId: targetEkskul.id,
  nama,
  kelas,
});


  // Simpan cookie
  const cookieStore = await cookies();
  cookieStore.set("nama", nama);
  cookieStore.set("kelas", kelas);

  // Revalidate path agar halaman langsung terupdate tanpa F5
  revalidatePath(`/ekskul/${ekskulId}`);
  revalidatePath("/ekskul");

  return {
    success: true,
    message: `Pendaftaran #${targetEkskul.id} berhasil: ${targetEkskul.nama}, ${targetEkskul.hari}, sesi ${targetEkskul.sesi} (${JAM_SESI[targetEkskul.sesi]}).`,
    fields: { nama: "", kelas: "" },
  };
}