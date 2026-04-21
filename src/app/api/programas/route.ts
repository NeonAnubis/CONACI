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
    const { user } = session;
    let programas;

    if (user.rolSistema === "CONACI") {
      programas = await prisma.programaAcademico.findMany({
        include: {
          institucion: {
            select: { id: true, nombre: true },
          },
        },
        orderBy: { nombre: "asc" },
      });
    } else {
      // Get programs linked to user's processes
      const procesosUsuario = await prisma.procesoUsuario.findMany({
        where: { userId: user.id },
        select: {
          proceso: {
            select: { programaId: true },
          },
        },
      });

      const programaIds = procesosUsuario
        .map((pu) => pu.proceso.programaId)
        .filter((id): id is string => id !== null);

      programas = await prisma.programaAcademico.findMany({
        where: { id: { in: programaIds } },
        include: {
          institucion: {
            select: { id: true, nombre: true },
          },
        },
        orderBy: { nombre: "asc" },
      });
    }

    return NextResponse.json(programas);
  } catch (error) {
    console.error("Error fetching programas:", error);
    return NextResponse.json(
      { error: "Error al obtener programas" },
      { status: 500 }
    );
  }
}
