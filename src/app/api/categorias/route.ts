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
    const categorias = await prisma.categoria.findMany({
      select: {
        id: true,
        idCategoria: true,
        nombre: true,
        numero: true,
        instrumentoId: true,
      },
      orderBy: { numero: "asc" },
    });

    return NextResponse.json(categorias);
  } catch (error) {
    console.error("Error fetching categorias:", error);
    return NextResponse.json(
      { error: "Error al obtener categorias" },
      { status: 500 }
    );
  }
}
