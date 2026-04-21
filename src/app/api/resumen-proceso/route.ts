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
  let procesoId = searchParams.get("procesoId");

  const { user } = session;

  try {
    // If no procesoId provided, find the first process the user has access to
    if (!procesoId) {
      if (user.rolSistema === "CONACI") {
        const firstProceso = await prisma.proceso.findFirst({
          orderBy: { createdAt: "desc" },
          select: { id: true },
        });
        procesoId = firstProceso?.id ?? null;
      } else {
        const procesoUsuario = await prisma.procesoUsuario.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          select: { procesoId: true },
        });
        procesoId = procesoUsuario?.procesoId ?? null;
      }
    }

    if (!procesoId) {
      return NextResponse.json({ resumen: null, proceso: null });
    }

    // Verify access
    if (user.rolSistema !== "CONACI") {
      const hasAccess = await prisma.procesoUsuario.findUnique({
        where: {
          procesoId_userId: { procesoId, userId: user.id },
        },
      });
      if (!hasAccess) {
        return NextResponse.json(
          { error: "No autorizado para ver este proceso" },
          { status: 403 }
        );
      }
    }

    const [resumen, proceso, resultados] = await Promise.all([
      prisma.resumenProceso.findUnique({
        where: { procesoId },
      }),
      prisma.proceso.findUnique({
        where: { id: procesoId },
        include: {
          instrumento: { select: { nombre: true, valorMaximo: true } },
          institucion: { select: { nombre: true } },
          programaAcademico: { select: { nombre: true } },
        },
      }),
      prisma.resultadoCriterio.findMany({
        where: { procesoId },
        include: {
          criterio: {
            select: {
              idCriterio: true,
              numero: true,
              nombre: true,
              valorMaximo: true,
              categoria: {
                select: { nombre: true, numero: true },
              },
            },
          },
        },
        orderBy: { criterio: { numero: "asc" } },
      }),
    ]);

    return NextResponse.json({ resumen, proceso, resultados });
  } catch (error) {
    console.error("Error fetching resumen proceso:", error);
    return NextResponse.json(
      { error: "Error al obtener resumen del proceso" },
      { status: 500 }
    );
  }
}
