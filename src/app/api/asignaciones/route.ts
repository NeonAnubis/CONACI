import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { user } = session;

  try {
    let where: Record<string, unknown> = {};

    if (user.rolSistema === "EVALUADOR") {
      where = { userId: user.id };
    }

    const asignaciones = await prisma.asignacionEvaluador.findMany({
      where,
      include: {
        categoria: {
          select: {
            id: true,
            idCategoria: true,
            nombre: true,
            numero: true,
          },
        },
        proceso: {
          select: {
            id: true,
            idProceso: true,
            nombreProceso: true,
            estadoProceso: true,
            institucion: {
              select: { id: true, nombre: true },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(asignaciones);
  } catch (error) {
    console.error("Error fetching asignaciones:", error);
    return NextResponse.json(
      { error: "Error al obtener asignaciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.rolSistema !== "CONACI") {
    return NextResponse.json(
      { error: "No autorizado. Solo usuarios CONACI pueden crear asignaciones." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { idAsignacion, procesoId, categoriaId, userId, claveEvaluador } = body;

    if (!idAsignacion || !procesoId || !categoriaId || !userId) {
      return NextResponse.json(
        { error: "idAsignacion, procesoId, categoriaId y userId son requeridos" },
        { status: 400 }
      );
    }

    const existing = await prisma.asignacionEvaluador.findUnique({
      where: { idAsignacion },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una asignacion con ese ID" },
        { status: 409 }
      );
    }

    const asignacion = await prisma.asignacionEvaluador.create({
      data: {
        idAsignacion,
        procesoId,
        categoriaId,
        userId,
        claveEvaluador: claveEvaluador || null,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        categoria: { select: { id: true, idCategoria: true, nombre: true, numero: true } },
        proceso: {
          select: {
            id: true,
            idProceso: true,
            nombreProceso: true,
            estadoProceso: true,
            institucion: { select: { id: true, nombre: true } },
          },
        },
      },
    });

    return NextResponse.json(asignacion, { status: 201 });
  } catch (error) {
    console.error("Error creating asignacion:", error);
    return NextResponse.json(
      { error: "Error al crear asignacion" },
      { status: 500 }
    );
  }
}
