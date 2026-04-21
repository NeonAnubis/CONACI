import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const instituciones = await prisma.institucion.findMany({
      include: {
        programas: {
          select: {
            id: true,
            idPrograma: true,
            nombre: true,
            tipoPrograma: true,
          },
        },
        _count: {
          select: { procesos: true },
        },
      },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json(instituciones);
  } catch (error) {
    console.error("Error fetching instituciones:", error);
    return NextResponse.json(
      { error: "Error al obtener instituciones" },
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
      {
        error:
          "No autorizado. Solo usuarios CONACI pueden crear instituciones.",
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const {
      idInstitucion,
      nombre,
      campus,
      direccion,
      ciudad,
      pais,
      contactoPrincipal,
      telefono,
      correo,
    } = body;

    if (!idInstitucion || !nombre) {
      return NextResponse.json(
        { error: "idInstitucion y nombre son requeridos" },
        { status: 400 }
      );
    }

    // Check for duplicate idInstitucion
    const existing = await prisma.institucion.findUnique({
      where: { idInstitucion },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una institucion con ese idInstitucion" },
        { status: 409 }
      );
    }

    const institucion = await prisma.institucion.create({
      data: {
        idInstitucion,
        nombre,
        campus: campus || null,
        direccion: direccion || null,
        ciudad: ciudad || null,
        pais: pais || null,
        contactoPrincipal: contactoPrincipal || null,
        telefono: telefono || null,
        correo: correo || null,
      },
    });

    return NextResponse.json(institucion, { status: 201 });
  } catch (error) {
    console.error("Error creating institucion:", error);
    return NextResponse.json(
      { error: "Error al crear institucion" },
      { status: 500 }
    );
  }
}
