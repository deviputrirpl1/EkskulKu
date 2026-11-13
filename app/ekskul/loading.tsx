export default function MemuatEkskul() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 rounded-xl bg-slate-200 animate-pulse p-4" />
        ))}
      </div>
    </div>
  );
}