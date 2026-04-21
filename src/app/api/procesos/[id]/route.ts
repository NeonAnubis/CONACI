import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.rolSistema !== "CONACI") {
    return NextResponse.json(
      { error: "No autorizado. Solo usuarios CONACI pueden editar procesos." },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();

    const {
      nombreProceso,
      estadoProceso,
      fechaInicio,
      fechaFin,
      instrumentoId,
      institucionId,
      programaId,
    } = body;

    const existing = await prisma.proceso.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "Proceso no encontrado" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (nombreProceso !== undefined) updateData.nombreProceso = nombreProceso;
    if (estadoProceso !== undefined) updateData.estadoProceso = estadoProceso;
    if (fechaInicio !== undefined)
      updateData.fechaInicio = fechaInicio ? new Date(fechaInicio) : null;
    if (fechaFin !== undefined)
      updateData.fechaFin = fechaFin ? new Date(fechaFin) : null;
    if (instrumentoId !== undefined) updateData.instrumentoId = instrumentoId;
    if (institucionId !== undefined)
      updateData.institucionId = institucionId || null;
    if (programaId !== undefined) updateData.programaId = programaId || null;

    const proceso = await prisma.proceso.update({
      where: { id },
      data: updateData,
      include: {
        instrumento: { select: { id: true, nombre: true, tipo: true } },
        institucion: { select: { id: true, nombre: true } },
        programaAcademico: { select: { id: true, nombre: true } },
      },
    });

    return NextResponse.json(proceso);
  } catch (error) {
    console.error("Error updating proceso:", error);
    return NextResponse.json(
      { error: "Error al actualizar proceso" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.rolSistema !== "CONACI") {
    return NextResponse.json(
      { error: "No autorizado. Solo usuarios CONACI pueden eliminar procesos." },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    const existing = await prisma.proceso.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "Proceso no encontrado" },
        { status: 404 }
      );
    }

    // Delete related records first (respuestas depend on solicitudes)
    const solicitudes = await prisma.solicitud.findMany({
      where: { procesoId: id },
      select: { id: true },
    });
    const solicitudIds = solicitudes.map((s) => s.id);

    await prisma.$transaction([
      prisma.respuesta.deleteMany({ where: { solicitudId: { in: solicitudIds } } }),
      prisma.solicitud.deleteMany({ where: { procesoId: id } }),
      prisma.evaluacion.deleteMany({ where: { procesoId: id } }),
      prisma.fundamentacion.deleteMany({ where: { procesoId: id } }),
      prisma.resumenProceso.deleteMany({ where: { procesoId: id } }),
      prisma.resultadoCriterio.deleteMany({ where: { procesoId: id } }),
      prisma.estadoCriterio.deleteMany({ where: { procesoId: id } }),
      prisma.rendimiento.deleteMany({ where: { procesoId: id } }),
      prisma.matricula.deleteMany({ where: { procesoId: id } }),
      prisma.mapeoDocente.deleteMany({ where: { procesoId: id } }),
      prisma.plantaDocente.deleteMany({ where: { procesoId: id } }),
      prisma.asignacionEvaluador.deleteMany({ where: { procesoId: id } }),
      prisma.procesoUsuario.deleteMany({ where: { procesoId: id } }),
      prisma.auditoria.deleteMany({ where: { procesoId: id } }),
      prisma.proceso.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting proceso:", error);
    return NextResponse.json(
      { error: "Error al eliminar proceso" },
      { status: 500 }
    );
  }
}
