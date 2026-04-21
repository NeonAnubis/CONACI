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

    const matriculas = await prisma.matricula.findMany({
      where,
      include: {
        proceso: {
          select: { id: true, idProceso: true, nombreProceso: true },
        },
      },
      orderBy: [{ generacion: "desc" }, { tipoIngreso: "asc" }],
    });

    return NextResponse.json(matriculas);
  } catch (error) {
    console.error("Error fetching matricula:", error);
    return NextResponse.json(
      { error: "Error al obtener matricula" },
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
    const { idMatricula, generacion, tipoIngreso, genero, numero, procesoId } = body;

    if (!idMatricula || generacion == null || !tipoIngreso || !genero || numero == null || !procesoId) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    const matricula = await prisma.matricula.create({
      data: {
        idMatricula,
        generacion: parseInt(generacion),
        tipoIngreso,
        genero,
        numero: parseInt(numero),
        procesoId,
      },
      include: {
        proceso: {
          select: { id: true, idProceso: true, nombreProceso: true },
        },
      },
    });

    return NextResponse.json(matricula, { status: 201 });
  } catch (error) {
    console.error("Error creating matricula:", error);
    return NextResponse.json(
      { error: "Error al crear registro de matricula" },
      { status: 500 }
    );
  }
}
