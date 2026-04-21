import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.rolSistema !== "CONACI") {
    return NextResponse.json(
      { error: "No autorizado. Solo usuarios CONACI pueden listar usuarios." },
      { status: 403 }
    );
  }

  try {
    const usuarios = await prisma.user.findMany({
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
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
      { error: "No autorizado. Solo usuarios CONACI pueden crear usuarios." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const { name, email, password, rolSistema, subRolConaci, rolInstitucion } =
      body;

    if (!name || !email || !password || !rolSistema) {
      return NextResponse.json(
        { error: "name, email, password y rolSistema son requeridos" },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese email" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const usuario = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        rolSistema,
        subRolConaci: subRolConaci || null,
        rolInstitucion: rolInstitucion || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        rolSistema: true,
        subRolConaci: true,
        rolInstitucion: true,
        activo: true,
        createdAt: true,
      },
    });

    return NextResponse.json(usuario, { status: 201 });
  } catch (error) {
    console.error("Error creating usuario:", error);
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}
