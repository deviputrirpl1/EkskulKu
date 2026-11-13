"use client";

export default function ErrorEkskul({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md p-6 text-center mt-12 bg-white rounded-2xl border shadow-sm">
      <h2 className="text-xl font-bold text-red-600 mb-2">Terjadi Kesalahan</h2>
      <p className="text-gray-600 mb-4">{error.message || "Gagal memuat data ekskul."}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Coba lagi
      </button>
    </div>
  );
}