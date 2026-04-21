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
  const evaluadorId = searchParams.get("evaluadorId");

  try {
    const where: Record<string, unknown> = {};

    if (procesoId) {
      where.procesoId = procesoId;
    }

    if (evaluadorId) {
      where.evaluadorId = evaluadorId;
    }

    const { user } = session;

    if (user.rolSistema === "INSTITUCION" && !procesoId) {
      const procesosUsuario = await prisma.procesoUsuario.findMany({
        where: { userId: user.id },
        select: { procesoId: true },
      });
      where.procesoId = { in: procesosUsuario.map((pu) => pu.procesoId) };
    }

    if (user.rolSistema === "EVALUADOR" && !evaluadorId) {
      where.evaluadorId = user.id;
    }

    const solicitudes = await prisma.solicitud.findMany({
      where,
      include: {
        criterio: {
          select: {
            id: true,
            idCriterio: true,
            nombre: true,
          },
        },
        evaluador: {
          select: {
            id: true,
            name: true,
          },
        },
        respuestas: {
          select: {
            id: true,
            respuesta: true,
            fechaRegistro: true,
          },
          orderBy: { fechaRegistro: "desc" },
          take: 1,
        },
      },
      orderBy: { fechaSolicitud: "desc" },
    });

    return NextResponse.json(solicitudes);
  } catch (error) {
    console.error("Error fetching solicitudes:", error);
    return NextResponse.json(
      { error: "Error al obtener solicitudes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.rolSistema !== "EVALUADOR" && session.user.rolSistema !== "CONACI") {
    return NextResponse.json(
      { error: "Solo evaluadores o CONACI pueden crear solicitudes" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { descripcion, tipo, procesoId, criterioId } = body;

    if (!descripcion || !procesoId || !criterioId) {
      return NextResponse.json(
        { error: "descripcion, procesoId y criterioId son requeridos" },
        { status: 400 }
      );
    }

    const count = await prisma.solicitud.count();
    const idSolicitud = `SOL${String(count + 1).padStart(4, "0")}`;

    const solicitud = await prisma.solicitud.create({
      data: {
        idSolicitud,
        descripcion,
        tipo: tipo || null,
        procesoId,
        criterioId,
        evaluadorId: session.user.id,
      },
      include: {
        criterio: {
          select: { id: true, idCriterio: true, nombre: true },
        },
        evaluador: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(solicitud, { status: 201 });
  } catch (error) {
    console.error("Error creating solicitud:", error);
    return NextResponse.json(
      { error: "Error al crear solicitud" },
      { status: 500 }
    );
  }
}
