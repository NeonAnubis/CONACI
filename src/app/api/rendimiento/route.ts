import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { user } = session;
  const { searchParams } = new URL(request.url);
  const procesoId = searchParams.get("procesoId");

  try {
    const where: Record<string, unknown> = {};

    if (procesoId) {
      where.procesoId = procesoId;
    } else if (user.rolSistema !== "CONACI") {
      const procesosUsuario = await prisma.procesoUsuario.findMany({
        where: { userId: user.id },
        select: { procesoId: true },
      });
      const procesoIds = procesosUsuario.map((pu) => pu.procesoId);
      where.procesoId = { in: procesoIds };
    }

    const rendimientos = await prisma.rendimiento.findMany({
      where,
      include: {
        proceso: {
          select: { id: true, idProceso: true, nombreProceso: true },
        },
      },
      orderBy: { idCohorte: "asc" },
    });

    return NextResponse.json(rendimientos);
  } catch (error) {
    console.error("Error fetching rendimiento:", error);
    return NextResponse.json(
      { error: "Error al obtener rendimiento" },
      { status: 500 }
    );
  }
}
