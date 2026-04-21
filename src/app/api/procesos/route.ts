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
    let procesos;

    if (user.rolSistema === "CONACI") {
      // CONACI users can see all processes
      procesos = await prisma.proceso.findMany({
        include: {
          instrumento: { select: { id: true, nombre: true, tipo: true } },
          institucion: { select: { id: true, nombre: true, campus: true } },
          programaAcademico: { select: { id: true, nombre: true, tipoPrograma: true } },
          usuarios: {
            include: {
              user: { select: { id: true, name: true, email: true, rolSistema: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Other users only see processes they are linked to
      procesos = await prisma.proceso.findMany({
        where: {
          usuarios: {
            some: { userId: user.id },
          },
        },
        include: {
          instrumento: { select: { id: true, nombre: true, tipo: true } },
          institucion: { select: { id: true, nombre: true, campus: true } },
          programaAcademico: { select: { id: true, nombre: true, tipoPrograma: true } },
          usuarios: {
            include: {
              user: { select: { id: true, name: true, email: true, rolSistema: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(procesos);
  } catch (error) {
    console.error("Error fetching procesos:", error);
    return NextResponse.json(
      { error: "Error al obtener procesos" },
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
      { error: "No autorizado. Solo usuarios CONACI pueden crear procesos." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const {
      idProceso,
      nombreProceso,
      estadoProceso,
      fechaInicio,
      fechaFin,
      instrumentoId,
      institucionId,
      programaId,
    } = body;

    if (!idProceso || !nombreProceso || !instrumentoId) {
      return NextResponse.json(
        { error: "idProceso, nombreProceso e instrumentoId son requeridos" },
        { status: 400 }
      );
    }

    const proceso = await prisma.proceso.create({
      data: {
        idProceso,
        nombreProceso,
        estadoProceso: estadoProceso || "EN_PREPARACION",
        fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        instrumentoId,
        institucionId: institucionId || null,
        programaId: programaId || null,
      },
      include: {
        instrumento: { select: { id: true, nombre: true, tipo: true } },
        institucion: { select: { id: true, nombre: true } },
        programaAcademico: { select: { id: true, nombre: true } },
      },
    });

    return NextResponse.json(proceso, { status: 201 });
  } catch (error) {
    console.error("Error creating proceso:", error);
    return NextResponse.json(
      { error: "Error al crear proceso" },
      { status: 500 }
    );
  }
}
