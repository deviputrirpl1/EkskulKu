import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { ambilEkskul, ambilAnggota } from "@/data/ambil";
import { JAM_SESI } from "@/data/ekskul";
import FormPendaftaran from "./form-pendaftaran"; // Pastikan import ini ada
import { daftarEkskulAction } from "./actions";

export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
};

async function DaftarAnggota({ ekskulId }: { ekskulId: number }) {
  const cookieStore = await cookies();
  const namaCookie = cookieStore.get("nama")?.value || "";
  
  const anggotaList = await ambilAnggota(ekskulId);
  const targetEkskul = await ambilEkskul(ekskulId);
  const sisaTempat = targetEkskul ? targetEkskul.kuota - anggotaList.length : 0;

  return (
    <div className="mt-6 border-t pt-4">
      <h2 className="text-xl font-bold mb-1">Anggota Terdaftar</h2>
      <p className="text-sm text-gray-600 mb-4">
        {anggotaList.length} dari {targetEkskul?.kuota} tempat terisi (Sisa {sisaTempat} tempat)
      </p>

      {anggotaList.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada anggota.</p>
      ) : (
        <ul className="space-y-2">
          {anggotaList.map((m, index) => {
            const isMe = m.nama.toLowerCase() === namaCookie.toLowerCase();
            return (
              <li key={index} className="flex justify-between items-center border p-3 rounded-lg">
                <div>
                  <span className="font-semibold">{m.nama}</span>
                  <span className="text-sm text-gray-500 ml-2">({m.kelas})</span>
                </div>
                {isMe && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                    Kamu
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default async function HalamanDetailEkskul({ params }: Props) {
  const resolvedParams = await params;
  const idNum = Number(resolvedParams.id);

  const ekskul = await ambilEkskul(idNum);
  if (!ekskul) {
    notFound();
  }

  const cookieStore = await cookies();
  const initialNama = cookieStore.get("nama")?.value || "";
  const initialKelas = cookieStore.get("kelas")?.value || "";

  const actionWithId = daftarEkskulAction.bind(null, ekskul.id);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link href="/ekskul" className="text-blue-600 text-sm hover:underline mb-4 inline-block">
        &larr; Kembali ke Daftar Ekskul
      </Link>

      <div className="border rounded-xl p-6 shadow-sm bg-white">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
          {ekskul.kategori}
        </span>
        <h1 className="text-2xl font-bold mt-1 mb-4">{ekskul.nama}</h1>

        <div className="space-y-2 text-gray-700 text-sm mb-6">
          <p><strong>Hari:</strong> {ekskul.hari}</p>
          <p><strong>Sesi:</strong> Sesi {ekskul.sesi} ({JAM_SESI[ekskul.sesi]})</p>
          <p><strong>Pembina:</strong> {ekskul.pembina}</p>
          <p><strong>Kuota Maksimal:</strong> {ekskul.kuota} orang</p>
        </div>

        {/* PASANG FORM PENDAFTARAN DI SINI */}
        <FormPendaftaran action={actionWithId} initialNama={initialNama} initialKelas={initialKelas} />

        <Suspense fallback={<p className="text-gray-500 italic mt-6">Memuat anggota...</p>}>
          <DaftarAnggota ekskulId={ekskul.id} />
        </Suspense>
      </div>
    </div>
  );
}