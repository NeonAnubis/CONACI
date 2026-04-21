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

    const registros = await prisma.plantaDocente.findMany({
      where,
      include: {
        proceso: {
          select: { id: true, idProceso: true, nombreProceso: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(registros);
  } catch (error) {
    console.error("Error fetching planta docente:", error);
    return NextResponse.json(
      { error: "Error al obtener planta docente" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { idRegistro, tipoContratacion, gradoEstudio, numeroDocentes, procesoId } = body;

    if (!idRegistro || !tipoContratacion || !gradoEstudio || numeroDocentes == null || !procesoId) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    const registro = await prisma.plantaDocente.create({
      data: {
        idRegistro,
        tipoContratacion,
        gradoEstudio,
        numeroDocentes: parseInt(numeroDocentes),
        procesoId,
      },
      include: {
        proceso: {
          select: { id: true, idProceso: true, nombreProceso: true },
        },
      },
    });

    return NextResponse.json(registro, { status: 201 });
  } catch (error) {
    console.error("Error creating planta docente:", error);
    return NextResponse.json(
      { error: "Error al crear registro de planta docente" },
      { status: 500 }
    );
  }
}
