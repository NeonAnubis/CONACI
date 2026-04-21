import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const procesoId = searchParams.get("procesoId");
  const etapa = searchParams.get("etapa");
  const userId = searchParams.get("userId");

  try {
    const where: Record<string, unknown> = {};

    if (procesoId) where.procesoId = procesoId;
    if (etapa) where.etapa = etapa;

    const { user } = session;

    if (userId) {
      where.userId = userId;
    } else if (user.rolSistema === "EVALUADOR") {
      where.userId = user.id;
    }

    const evaluaciones = await prisma.evaluacion.findMany({
      where,
      include: {
        criterio: {
          select: {
            id: true,
            idCriterio: true,
            nombre: true,
            numero: true,
            categoria: {
              select: { id: true, nombre: true },
            },
          },
        },
        proceso: {
          select: {
            id: true,
            idProceso: true,
            nombreProceso: true,
          },
        },
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { criterio: { numero: "asc" } },
    });

    return NextResponse.json(evaluaciones);
  } catch (error) {
    console.error("Error fetching evaluaciones:", error);
    return NextResponse.json(
      { error: "Error al obtener evaluaciones" },
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
    const { etapa, nivel, justificacion, observaciones, recomendaciones, procesoId, criterioId } = body;

    if (!etapa || !procesoId || !criterioId) {
      return NextResponse.json(
        { error: "etapa, procesoId y criterioId son requeridos" },
        { status: 400 }
      );
    }

    const count = await prisma.evaluacion.count();
    const idEvaluacion = `EVAL${String(count + 1).padStart(4, "0")}`;

    const evaluacion = await prisma.evaluacion.create({
      data: {
        idEvaluacion,
        etapa,
        rol: session.user.rolSistema,
        nivel: nivel != null ? parseFloat(nivel) : null,
        justificacion: justificacion || null,
        observaciones: observaciones || null,
        recomendaciones: recomendaciones || null,
        procesoId,
        criterioId,
        userId: session.user.id,
      },
      include: {
        criterio: {
          select: { id: true, idCriterio: true, nombre: true },
        },
      },
    });

    return NextResponse.json(evaluacion, { status: 201 });
  } catch (error) {
    console.error("Error creating evaluacion:", error);
    return NextResponse.json(
      { error: "Error al crear evaluacion" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, nivel, justificacion, observaciones, recomendaciones } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id es requerido" },
        { status: 400 }
      );
    }

    const existing = await prisma.evaluacion.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "Evaluacion no encontrada" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (nivel !== undefined) updateData.nivel = parseFloat(nivel);
    if (justificacion !== undefined) updateData.justificacion = justificacion;
    if (observaciones !== undefined) updateData.observaciones = observaciones;
    if (recomendaciones !== undefined) updateData.recomendaciones = recomendaciones;

    const evaluacion = await prisma.evaluacion.update({
      where: { id },
      data: updateData,
      include: {
        criterio: {
          select: { id: true, idCriterio: true, nombre: true },
        },
      },
    });

    return NextResponse.json(evaluacion);
  } catch (error) {
    console.error("Error updating evaluacion:", error);
    return NextResponse.json(
      { error: "Error al actualizar evaluacion" },
      { status: 500 }
    );
  }
}
