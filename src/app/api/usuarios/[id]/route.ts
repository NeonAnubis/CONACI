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
      { error: "No autorizado. Solo usuarios CONACI pueden editar usuarios." },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, rolSistema, subRolConaci, rolInstitucion, activo } = body;

    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (rolSistema !== undefined) updateData.rolSistema = rolSistema;
    if (subRolConaci !== undefined) updateData.subRolConaci = subRolConaci || null;
    if (rolInstitucion !== undefined) updateData.rolInstitucion = rolInstitucion || null;
    if (activo !== undefined) updateData.activo = activo;

    const usuario = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        rolSistema: true,
        subRolConaci: true,
        rolInstitucion: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Error updating usuario:", error);
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}
