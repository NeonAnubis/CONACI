"use client";

import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center bg-gradient-to-br from-sky-500 to-sky-700 p-12">
        <div className="mx-auto max-w-md text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <Image src="/logo.png" alt="CONACI" width={56} height={56} className="h-14 w-auto rounded-xl bg-white/20 p-2" />
            <span className="text-4xl font-bold text-white">CONACI</span>
          </Link>
          <p className="text-lg text-sky-100 leading-relaxed">
            Consejo para la Acreditacion del Comercio Internacional
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6 text-center">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-white">40+</p>
              <p className="text-sm text-sky-200">Criterios</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-white">10</p>
              <p className="text-sm text-sky-200">Categorias</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-sm text-sky-200">Roles</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-white">2</p>
              <p className="text-sm text-sky-200">Instrumentos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/logo.png" alt="CONACI" width={40} height={40} className="h-10 w-auto" />
              <span className="text-xl font-bold text-black">CONACI</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
