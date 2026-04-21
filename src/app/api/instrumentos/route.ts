import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const instrumentos = await prisma.instrumento.findMany({
      select: {
        id: true,
        idInstrumento: true,
        nombre: true,
        tipo: true,
      },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json(instrumentos);
  } catch (error) {
    console.error("Error fetching instrumentos:", error);
    return NextResponse.json(
      { error: "Error al obtener instrumentos" },
      { status: 500 }
    );
  }
}
