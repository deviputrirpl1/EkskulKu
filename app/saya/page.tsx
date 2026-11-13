import { cookies } from "next/headers";
import Link from "next/link";
import { ambilSemuaEkskul } from "@/data/ambil";
import { pendaftar, JAM_SESI } from "@/data/ekskul";
import { batalkanPendaftaranAction } from "./actions";

export const instant = false;

export default async function HalamanEkskulSaya() {
  const cookieStore = await cookies();
  const nama = cookieStore.get("nama")?.value;
  const kelas = cookieStore.get("kelas")?.value;

  if (!nama || !kelas) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center mt-10 bg-white border rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Ekskul Saya</h1>
        <p className="text-gray-600 mb-6">Kamu belum mendaftar apa pun.</p>
        <Link
          href="/ekskul"
          className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          Lihat Daftar Ekskul
        </Link>
      </div>
    );
  }

  const semuaEkskul = await ambilSemuaEkskul();
  const ekskulSayaList = pendaftar.filter(
    (p) => p.nama.toLowerCase() === nama.toLowerCase() && p.kelas.toLowerCase() === kelas.toLowerCase()
  );

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ekskul Saya</h1>
        <Link href="/ekskul" className="text-blue-600 text-sm hover:underline">
          &larr; Daftar Ekskul Lainnya
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-900 font-medium">
        {nama} · {kelas} · {ekskulSayaList.length} ekskul diikuti
      </div>

      {ekskulSayaList.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-500 italic shadow-sm">
          Belum ada ekskul yang diikuti.
        </div>
      ) : (
        <div className="space-y-4">
          {ekskulSayaList.map((p) => {
            const detailEkskul = semuaEkskul.find((e) => e.id === p.ekskulId);
            if (!detailEkskul) return null;

            return (
              <div
                key={detailEkskul.id}
                className="bg-white border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {detailEkskul.kategori}
                  </span>
                  <h2 className="text-lg font-bold mt-0.5">
                    <Link href={`/ekskul/${detailEkskul.id}`} className="hover:text-blue-600 hover:underline">
                      {detailEkskul.nama}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {detailEkskul.hari}, Sesi {detailEkskul.sesi} ({JAM_SESI[detailEkskul.sesi]})
                  </p>
                </div>

                <form action={async () => {
                  "use server";
                  await batalkanPendaftaranAction(detailEkskul.id);
                }}>
                  <button
                    type="submit"
                    className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                  >
                    Batalkan
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}