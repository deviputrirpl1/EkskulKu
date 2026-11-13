"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

// Tombol dengan status pending (Memproses...)
function TombolSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"
    >
      {pending ? "Memproses..." : "Daftar Ekskul Ini"}
    </button>
  );
}

type FormState = {
  success?: boolean;
  message?: string;
  errors?: {
    nama?: string;
    kelas?: string;
  };
  fields?: {
    nama?: string;
    kelas?: string;
  };
};

type Props = {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  initialNama?: string;
  initialKelas?: string;
};

export default function FormPendaftaran({ action, initialNama = "", initialKelas = "" }: Props) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {
    fields: { nama: initialNama, kelas: initialKelas },
  });

  return (
    <form action={formAction} className="mt-6 border-t pt-4 space-y-4">
      <h2 className="text-xl font-bold">Daftar Ekskul Ini</h2>

      {/* Galat aturan umum (seperti kuota penuh, sudah terdaftar, bentrok) di atas tombol */}
      {state?.message && !state?.success && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {state.message}
        </div>
      )}

      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {state.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
        <input
          type="text"
          name="nama"
          defaultValue={state?.fields?.nama ?? initialNama}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Masukkan nama lengkap"
        />
        {/* Galat per kolom untuk nama */}
        {state?.errors?.nama && (
          <p className="text-red-600 text-xs mt-1">{state.errors.nama}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
        <input
          type="text"
          name="kelas"
          defaultValue={state?.fields?.kelas ?? initialKelas}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Contoh: XII RPL 1"
        />
        {/* Galat per kolom untuk kelas */}
        {state?.errors?.kelas && (
          <p className="text-red-600 text-xs mt-1">{state.errors.kelas}</p>
        )}
      </div>

      <TombolSubmit />
    </form>
  );
}