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
    let where: Record<string, unknown> = {};

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

    const docentes = await prisma.mapeoDocente.findMany({
      where,
      include: {
        proceso: {
          select: { id: true, idProceso: true, nombreProceso: true },
        },
      },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json(docentes);
  } catch (error) {
    console.error("Error fetching mapeo docente:", error);
    return NextResponse.json(
      { error: "Error al obtener mapeo docente" },
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
    const {
      idDocente,
      nombre,
      tipoContratacion,
      gradoAcademico,
      areaEspecializacion,
      antiguedadInstitucion,
      antiguedadPrograma,
      cumplePerfil,
      nivelIdoneidad,
      procesoId,
    } = body;

    if (!idDocente || !nombre || !procesoId) {
      return NextResponse.json(
        { error: "idDocente, nombre y procesoId son requeridos" },
        { status: 400 }
      );
    }

    const docente = await prisma.mapeoDocente.create({
      data: {
        idDocente,
        nombre,
        tipoContratacion: tipoContratacion || null,
        gradoAcademico: gradoAcademico || null,
        areaEspecializacion: areaEspecializacion || null,
        antiguedadInstitucion: antiguedadInstitucion != null ? parseFloat(antiguedadInstitucion) : null,
        antiguedadPrograma: antiguedadPrograma != null ? parseFloat(antiguedadPrograma) : null,
        cumplePerfil: cumplePerfil != null ? Boolean(cumplePerfil) : null,
        nivelIdoneidad: nivelIdoneidad != null ? parseFloat(nivelIdoneidad) : null,
        procesoId,
      },
      include: {
        proceso: {
          select: { id: true, idProceso: true, nombreProceso: true },
        },
      },
    });

    return NextResponse.json(docente, { status: 201 });
  } catch (error) {
    console.error("Error creating mapeo docente:", error);
    return NextResponse.json(
      { error: "Error al crear registro de mapeo docente" },
      { status: 500 }
    );
  }
}
