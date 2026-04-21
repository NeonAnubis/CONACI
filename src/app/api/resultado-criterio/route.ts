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

  if (!procesoId) {
    return NextResponse.json(
      { error: "procesoId es requerido" },
      { status: 400 }
    );
  }

  try {
    // Verify user has access to this process
    const { user } = session;

    if (user.rolSistema !== "CONACI") {
      const procesoUsuario = await prisma.procesoUsuario.findUnique({
        where: {
          procesoId_userId: {
            procesoId,
            userId: user.id,
          },
        },
      });

      if (!procesoUsuario) {
        return NextResponse.json(
          { error: "No autorizado para ver resultados de este proceso" },
          { status: 403 }
        );
      }
    }

    const resultados = await prisma.resultadoCriterio.findMany({
      where: { procesoId },
      include: {
        criterio: {
          select: {
            id: true,
            idCriterio: true,
            numero: true,
            nombre: true,
            valorMaximo: true,
            categoria: {
              select: {
                id: true,
                idCategoria: true,
                nombre: true,
                numero: true,
              },
            },
          },
        },
      },
      orderBy: { criterio: { numero: "asc" } },
    });

    return NextResponse.json(resultados);
  } catch (error) {
    console.error("Error fetching resultados:", error);
    return NextResponse.json(
      { error: "Error al obtener resultados" },
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
    const { id, nivelAutoevaluacion, nivelEvaluador, nivelDictamen, observacionesFinales, recomendacionesFinales } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id del resultado es requerido" },
        { status: 400 }
      );
    }

    const existing = await prisma.resultadoCriterio.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Resultado no encontrado" },
        { status: 404 }
      );
    }

    const { user } = session;

    // Role-based field restrictions
    const updateData: Record<string, unknown> = {
      fechaActualizacion: new Date(),
    };

    if (user.rolSistema === "INSTITUCION") {
      // Institutions can only update autoevaluacion level
      if (nivelAutoevaluacion !== undefined) {
        updateData.nivelAutoevaluacion = nivelAutoevaluacion;
        updateData.puntajeAutoevaluacion = nivelAutoevaluacion * (existing.factor || 1);
      }
    } else if (user.rolSistema === "EVALUADOR") {
      // Evaluators can only update evaluador level
      if (nivelEvaluador !== undefined) {
        updateData.nivelEvaluador = nivelEvaluador;
        updateData.puntajeEvaluador = nivelEvaluador * (existing.factor || 1);
      }
    } else if (user.rolSistema === "CONACI") {
      // CONACI can update all fields
      if (nivelAutoevaluacion !== undefined) {
        updateData.nivelAutoevaluacion = nivelAutoevaluacion;
        updateData.puntajeAutoevaluacion = nivelAutoevaluacion * (existing.factor || 1);
      }
      if (nivelEvaluador !== undefined) {
        updateData.nivelEvaluador = nivelEvaluador;
        updateData.puntajeEvaluador = nivelEvaluador * (existing.factor || 1);
      }
      if (nivelDictamen !== undefined) {
        updateData.nivelDictamen = nivelDictamen;
        updateData.puntajeDictamen = nivelDictamen * (existing.factor || 1);
      }
      if (observacionesFinales !== undefined) {
        updateData.observacionesFinales = observacionesFinales;
      }
      if (recomendacionesFinales !== undefined) {
        updateData.recomendacionesFinales = recomendacionesFinales;
      }
    } else {
      return NextResponse.json(
        { error: "Rol no autorizado para modificar resultados" },
        { status: 403 }
      );
    }

    // Recalculate differences after update
    const updatedNivelAuto =
      (updateData.nivelAutoevaluacion as number | undefined) ?? existing.nivelAutoevaluacion;
    const updatedNivelEval =
      (updateData.nivelEvaluador as number | undefined) ?? existing.nivelEvaluador;
    const updatedNivelDict =
      (updateData.nivelDictamen as number | undefined) ?? existing.nivelDictamen;

    if (updatedNivelAuto != null && updatedNivelEval != null) {
      updateData.diferenciaAutoEval = updatedNivelAuto - updatedNivelEval;
    }
    if (updatedNivelEval != null && updatedNivelDict != null) {
      updateData.diferenciaEvalDict = updatedNivelEval - updatedNivelDict;
    }

    const resultado = await prisma.resultadoCriterio.update({
      where: { id },
      data: updateData,
      include: {
        criterio: {
          select: {
            id: true,
            idCriterio: true,
            nombre: true,
          },
        },
      },
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Error updating resultado:", error);
    return NextResponse.json(
      { error: "Error al actualizar resultado" },
      { status: 500 }
    );
  }
}
