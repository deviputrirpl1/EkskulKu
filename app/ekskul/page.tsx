import Link from "next/link";
// Sesuaikan path import data sesuai proyekmu
import { ambilSemuaEkskul } from "@/data/ambil"; 

export default async function DaftarEkskulPage() {
  const listEkskul = await ambilSemuaEkskul();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header & Filter Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
            Daftar Ekstrakurikuler
          </h1>
          
          {/* Bagian Filter (Form/Dropdown sesuai bawaanmu) */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Semua Kategori</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Semua Hari</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              Saring
            </button>
          </div>
        </div>

        <p className="text-sm font-medium text-gray-600 mb-6">
          {listEkskul.length} ekskul ditemukan
        </p>

        {/* Grid Kartu Ekskul */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listEkskul.map((ekskul) => (
            <div 
              key={ekskul.id} 
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md inline-block mb-3">
                  {ekskul.kategori}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {ekskul.nama}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {ekskul.hari}, Sesi {ekskul.sesi}
                </p>
              </div>

              <div>
                <div className="text-sm font-semibold text-emerald-600 mb-5 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
                  Sisa tempat tersedia
                </div>

                {/* Tombol Detail Per Kartu */}
                <Link
                  href={`/ekskul/${ekskul.id}`}
                  className="w-full block text-center bg-gray-900 text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-blue-600 transition shadow-sm"
                >
                  Lihat Detail &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}