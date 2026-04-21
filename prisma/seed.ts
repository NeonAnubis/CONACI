import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("Conaci2026!!", 12);

  // ==================== CLEAN UP ====================
  console.log("Cleaning existing data...");
  await prisma.resumenProceso.deleteMany();
  await prisma.resultadoCriterio.deleteMany();
  await prisma.estadoCriterio.deleteMany();
  await prisma.respuesta.deleteMany();
  await prisma.solicitud.deleteMany();
  await prisma.evaluacion.deleteMany();
  await prisma.fundamentacion.deleteMany();
  await prisma.rendimiento.deleteMany();
  await prisma.matricula.deleteMany();
  await prisma.mapeoDocente.deleteMany();
  await prisma.plantaDocente.deleteMany();
  await prisma.asignacionEvaluador.deleteMany();
  await prisma.procesoUsuario.deleteMany();
  await prisma.auditoria.deleteMany();
  await prisma.proceso.deleteMany();
  await prisma.elemento.deleteMany();
  await prisma.nivel.deleteMany();
  await prisma.criterio.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.instrumento.deleteMany();
  await prisma.programaAcademico.deleteMany();
  await prisma.institucion.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ==================== USERS ====================
  console.log("Creating users...");

  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "USR001",
        name: "Coordinador Institucional",
        email: "coordinador@universidad.mx",
        password: passwordHash,
        rolSistema: "INSTITUCION",
        rolInstitucion: "COORDINADOR",
      },
    }),
    prisma.user.create({
      data: {
        id: "USR002",
        name: "Responsable Academico",
        email: "responsable@universidad.mx",
        password: passwordHash,
        rolSistema: "INSTITUCION",
        rolInstitucion: "RESPONSABLE",
      },
    }),
    prisma.user.create({
      data: {
        id: "USR003",
        name: "Evaluador 1",
        email: "evaluador1@conaci.mx",
        password: passwordHash,
        rolSistema: "EVALUADOR",
      },
    }),
    prisma.user.create({
      data: {
        id: "USR004",
        name: "Evaluador 2",
        email: "evaluador2@conaci.mx",
        password: passwordHash,
        rolSistema: "EVALUADOR",
      },
    }),
    prisma.user.create({
      data: {
        id: "USR005",
        name: "Miembro Comite Dictamen",
        email: "comite@conaci.mx",
        password: passwordHash,
        rolSistema: "CONACI",
        subRolConaci: "COMITE_DICTAMEN",
      },
    }),
    prisma.user.create({
      data: {
        id: "USR006",
        name: "Administrador CONACI",
        email: "admin@conaci.mx",
        password: passwordHash,
        rolSistema: "CONACI",
        subRolConaci: "ADMINISTRADOR",
      },
    }),
    prisma.user.create({
      data: {
        id: "USR007",
        name: "Michael Lee",
        email: "devgroup.job@gmail.com",
        password: passwordHash,
        rolSistema: "INSTITUCION",
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // ==================== INSTITUCION ====================
  console.log("Creating institucion...");

  const institucion = await prisma.institucion.create({
    data: {
      id: "INS001",
      idInstitucion: "INS001",
      nombre: "Universidad de Prueba CONACI",
      campus: "Campus Central",
      ciudad: "Ciudad de Mexico",
      pais: "Mexico",
      direccion: "Av. Universidad 1000, Col. Centro, CP 06000",
      contactoPrincipal: "Coordinador Institucional",
      telefono: "+52 55 1234 5678",
      correo: "contacto@universidad.mx",
    },
  });

  // ==================== PROGRAMA ACADEMICO ====================
  console.log("Creating programa academico...");

  const programa = await prisma.programaAcademico.create({
    data: {
      id: "PROG001",
      idPrograma: "PROG001",
      nombre: "Licenciatura en Administracion",
      tipoPrograma: "LICENCIATURA",
      coordinador: "Coordinador Institucional",
      correoCoordinador: "coordinador@universidad.mx",
      institucionId: institucion.id,
    },
  });

  // ==================== INSTRUMENTOS ====================
  console.log("Creating instrumentos...");

  const instrumentoNacional = await prisma.instrumento.create({
    data: {
      id: "INT01",
      idInstrumento: "INT01",
      nombre: "Instrumento Nacional",
      tipo: "Nacional",
      descripcion:
        "Instrumento de evaluacion para programas academicos nacionales de CONACI",
      valorMaximo: 200,
    },
  });

  const instrumentoInternacional = await prisma.instrumento.create({
    data: {
      id: "INT02",
      idInstrumento: "INT02",
      nombre: "Instrumento Internacional",
      tipo: "Internacional",
      descripcion:
        "Instrumento de evaluacion para programas academicos con enfoque internacional",
      valorMaximo: 200,
    },
  });

  // ==================== CATEGORIAS NACIONALES ====================
  console.log("Creating categorias nacionales...");

  const categoriaNombres = [
    "Planeacion Estrategica y Gestion del Programa",
    "Identidad Institucional y del Programa",
    "Sistema de Analisis Institucional y de Informacion",
    "Gobernanza y Toma de Decisiones",
    "Produccion Academica y Generacion de Conocimiento",
    "Participacion en Redes, Iniciativas y Ejercicios Sectoriales",
    "Estructura Curricular y Actualizacion del Plan de Estudios",
    "Procesos de Ingreso y Perfil de Ingreso",
    "Impacto y Transferencia de Conocimiento",
    "Responsabilidad Social y Formacion con Impacto Territorial",
  ];

  const categoriasNacionales = await Promise.all(
    categoriaNombres.map((nombre, i) => {
      const num = String(i + 1).padStart(2, "0");
      return prisma.categoria.create({
        data: {
          id: `CAT-N${num}`,
          idCategoria: `CAT-N${num}`,
          numero: i + 1,
          nombre,
          descripcion: `Categoria ${i + 1} del instrumento nacional: ${nombre}`,
          valorMaximo: 20,
          instrumentoId: instrumentoNacional.id,
        },
      });
    })
  );

  // ==================== CATEGORIAS INTERNACIONALES ====================
  console.log("Creating categorias internacionales...");

  const categoriaIntNombres = [
    "Strategic Planning and Program Management",
    "Institutional and Program Identity",
    "Institutional Analysis and Information Systems",
    "Governance and Decision Making",
    "Academic Production and Knowledge Generation",
    "Participation in Networks and Sectoral Initiatives",
    "Curricular Structure and Study Plan Updates",
    "Admission Processes and Admission Profile",
    "Impact and Knowledge Transfer",
    "Social Responsibility and Territorial Impact Training",
  ];

  await Promise.all(
    categoriaIntNombres.map((nombre, i) => {
      const num = String(i + 1).padStart(2, "0");
      return prisma.categoria.create({
        data: {
          id: `CAT-I${num}`,
          idCategoria: `CAT-I${num}`,
          numero: i + 1,
          nombre,
          descripcion: `Category ${i + 1} of the international instrument: ${nombre}`,
          valorMaximo: 20,
          instrumentoId: instrumentoInternacional.id,
        },
      });
    })
  );

  // ==================== CRITERIOS NACIONALES (4 per category = 40) ====================
  console.log("Creating criterios nacionales...");

  const criterioNombres: string[][] = [
    // CAT-N01: Planeacion Estrategica
    [
      "Existencia y vigencia del Plan de Desarrollo del programa",
      "Alineacion del programa con la mision y vision institucional",
      "Mecanismos de seguimiento y evaluacion del plan de desarrollo",
      "Participacion de la comunidad academica en la planeacion",
    ],
    // CAT-N02: Identidad Institucional
    [
      "Difusion de la mision y vision del programa",
      "Congruencia entre el perfil de egreso y la demanda social",
      "Reconocimiento del programa en el ambito profesional",
      "Identidad y sentido de pertenencia de la comunidad academica",
    ],
    // CAT-N03: Sistema de Analisis
    [
      "Sistema de informacion para la toma de decisiones",
      "Indicadores de desempeno del programa educativo",
      "Mecanismos de retroalimentacion con egresados y empleadores",
      "Uso de datos para la mejora continua del programa",
    ],
    // CAT-N04: Gobernanza
    [
      "Estructura organizacional y funciones definidas",
      "Procesos de toma de decisiones colegiados",
      "Normatividad vigente y su aplicacion",
      "Rendicion de cuentas y transparencia",
    ],
    // CAT-N05: Produccion Academica
    [
      "Produccion cientifica y academica del nucleo docente",
      "Participacion en proyectos de investigacion",
      "Publicaciones en revistas indexadas y arbitradas",
      "Vinculacion de la investigacion con la formacion de estudiantes",
    ],
    // CAT-N06: Participacion en Redes
    [
      "Convenios de colaboracion academica vigentes",
      "Participacion en redes academicas nacionales e internacionales",
      "Movilidad estudiantil y docente",
      "Proyectos interinstitucionales y sectoriales",
    ],
    // CAT-N07: Estructura Curricular
    [
      "Fundamentacion y pertinencia del plan de estudios",
      "Actualizacion periodica del curriculo",
      "Flexibilidad y optatividad curricular",
      "Congruencia entre el perfil de egreso y el mapa curricular",
    ],
    // CAT-N08: Procesos de Ingreso
    [
      "Criterios y mecanismos de seleccion de aspirantes",
      "Programa de induccion y tutoria para nuevo ingreso",
      "Seguimiento del perfil de ingreso de los estudiantes",
      "Estrategias de atencion a la diversidad de los aspirantes",
    ],
    // CAT-N09: Impacto y Transferencia
    [
      "Vinculacion con el sector productivo y social",
      "Transferencia de conocimiento y tecnologia",
      "Impacto del programa en el desarrollo regional",
      "Practicas profesionales y servicio social",
    ],
    // CAT-N10: Responsabilidad Social
    [
      "Programas de responsabilidad social universitaria",
      "Formacion en valores y etica profesional",
      "Contribucion al desarrollo sustentable",
      "Inclusion y equidad en el acceso al programa",
    ],
  ];

  const criteriosNacionales = [];
  let criterioCounter = 1;

  for (let catIdx = 0; catIdx < 10; catIdx++) {
    for (let crIdx = 0; crIdx < 4; crIdx++) {
      const num = String(criterioCounter).padStart(2, "0");
      const catNum = String(catIdx + 1).padStart(2, "0");
      const criterio = await prisma.criterio.create({
        data: {
          id: `CR-N${num}`,
          idCriterio: `CR-N${num}`,
          numero: criterioCounter,
          nombre: criterioNombres[catIdx][crIdx],
          descripcion: `Criterio ${criterioCounter}: ${criterioNombres[catIdx][crIdx]}`,
          valorMaximo: 5,
          valorMinimo: 0,
          instrumentoId: instrumentoNacional.id,
          categoriaId: `CAT-N${catNum}`,
        },
      });
      criteriosNacionales.push(criterio);
      criterioCounter++;
    }
  }

  console.log(`Created ${criteriosNacionales.length} criterios nacionales`);

  // ==================== PROCESO ====================
  console.log("Creating proceso...");

  const proceso = await prisma.proceso.create({
    data: {
      id: "PR001",
      idProceso: "PR001",
      nombreProceso: "Evaluacion Piloto 2026",
      estadoProceso: "EN_PREPARACION",
      fechaInicio: new Date("2026-01-15"),
      instrumentoId: instrumentoNacional.id,
      institucionId: institucion.id,
      programaId: programa.id,
    },
  });

  // ==================== PROCESO USUARIO ====================
  console.log("Creating proceso-usuario links...");

  await Promise.all([
    prisma.procesoUsuario.create({
      data: { procesoId: proceso.id, userId: "USR001" },
    }),
    prisma.procesoUsuario.create({
      data: { procesoId: proceso.id, userId: "USR003" },
    }),
    prisma.procesoUsuario.create({
      data: { procesoId: proceso.id, userId: "USR005" },
    }),
    prisma.procesoUsuario.create({
      data: { procesoId: proceso.id, userId: "USR007" },
    }),
  ]);

  // ==================== ASIGNACION EVALUADOR ====================
  console.log("Creating asignaciones evaluador...");

  await Promise.all([
    prisma.asignacionEvaluador.create({
      data: {
        id: "ASG001",
        idAsignacion: "ASG001",
        procesoId: proceso.id,
        categoriaId: "CAT-N01",
        userId: "USR003",
        claveEvaluador: "EV-001",
      },
    }),
    prisma.asignacionEvaluador.create({
      data: {
        id: "ASG002",
        idAsignacion: "ASG002",
        procesoId: proceso.id,
        categoriaId: "CAT-N02",
        userId: "USR003",
        claveEvaluador: "EV-001",
      },
    }),
  ]);

  // ==================== RESULTADO CRITERIO ====================
  console.log("Creating resultados criterio...");

  const resultadosData = [
    {
      id: "RC001",
      idResultado: "RC001",
      criterioId: "CR-N01",
      nivelAutoevaluacion: 4,
      nivelEvaluador: 3,
      nivelDictamen: 4,
    },
    {
      id: "RC002",
      idResultado: "RC002",
      criterioId: "CR-N02",
      nivelAutoevaluacion: 5,
      nivelEvaluador: 4,
      nivelDictamen: 4,
    },
    {
      id: "RC003",
      idResultado: "RC003",
      criterioId: "CR-N03",
      nivelAutoevaluacion: 3,
      nivelEvaluador: 3,
      nivelDictamen: 3,
    },
    {
      id: "RC004",
      idResultado: "RC004",
      criterioId: "CR-N04",
      nivelAutoevaluacion: 4,
      nivelEvaluador: 5,
      nivelDictamen: 5,
    },
  ];

  await Promise.all(
    resultadosData.map((r) =>
      prisma.resultadoCriterio.create({
        data: {
          id: r.id,
          idResultado: r.idResultado,
          nivelAutoevaluacion: r.nivelAutoevaluacion,
          nivelEvaluador: r.nivelEvaluador,
          nivelDictamen: r.nivelDictamen,
          factor: 1,
          puntajeAutoevaluacion: r.nivelAutoevaluacion,
          puntajeEvaluador: r.nivelEvaluador,
          puntajeDictamen: r.nivelDictamen,
          diferenciaAutoEval:
            r.nivelAutoevaluacion - r.nivelEvaluador,
          diferenciaEvalDict: r.nivelEvaluador - r.nivelDictamen,
          estadoResultado: "EVALUADO",
          procesoId: proceso.id,
          criterioId: r.criterioId,
        },
      })
    )
  );

  // ==================== RESUMEN PROCESO ====================
  console.log("Creating resumen proceso...");

  const totalAuto = 4 + 5 + 3 + 4; // 16
  const totalEval = 3 + 4 + 3 + 5; // 15
  const totalDict = 4 + 4 + 3 + 5; // 16

  await prisma.resumenProceso.create({
    data: {
      id: "RES-PR001",
      idResumen: "RES-PR001",
      totalAutoevaluacion: totalAuto,
      totalEvaluador: totalEval,
      totalDictamen: totalDict,
      diferenciaTotalAutoDict: totalAuto - totalDict,
      porcentajeCumplimiento: (totalDict / 200) * 100,
      resultadoFinal: "NO_ACREDITADO",
      procesoId: proceso.id,
    },
  });

  // ==================== PLANTA DOCENTE ====================
  console.log("Creating planta docente...");

  await Promise.all([
    prisma.plantaDocente.create({
      data: {
        id: "PD001",
        idRegistro: "PD001",
        tipoContratacion: "TIEMPO_COMPLETO",
        gradoEstudio: "LICENCIATURA",
        numeroDocentes: 5,
        procesoId: proceso.id,
      },
    }),
    prisma.plantaDocente.create({
      data: {
        id: "PD002",
        idRegistro: "PD002",
        tipoContratacion: "TIEMPO_COMPLETO",
        gradoEstudio: "MAESTRIA",
        numeroDocentes: 8,
        procesoId: proceso.id,
      },
    }),
    prisma.plantaDocente.create({
      data: {
        id: "PD003",
        idRegistro: "PD003",
        tipoContratacion: "MEDIO_TIEMPO",
        gradoEstudio: "DOCTORADO",
        numeroDocentes: 2,
        procesoId: proceso.id,
      },
    }),
    prisma.plantaDocente.create({
      data: {
        id: "PD004",
        idRegistro: "PD004",
        tipoContratacion: "ASIGNATURA",
        gradoEstudio: "LICENCIATURA",
        numeroDocentes: 12,
        procesoId: proceso.id,
      },
    }),
  ]);

  // ==================== MATRICULA ====================
  console.log("Creating matricula...");

  await Promise.all([
    prisma.matricula.create({
      data: {
        id: "MAT001",
        idMatricula: "MAT001",
        generacion: 2025,
        tipoIngreso: "NUEVO_INGRESO",
        genero: "HOMBRES",
        numero: 45,
        procesoId: proceso.id,
      },
    }),
    prisma.matricula.create({
      data: {
        id: "MAT002",
        idMatricula: "MAT002",
        generacion: 2025,
        tipoIngreso: "NUEVO_INGRESO",
        genero: "MUJERES",
        numero: 52,
        procesoId: proceso.id,
      },
    }),
    prisma.matricula.create({
      data: {
        id: "MAT003",
        idMatricula: "MAT003",
        generacion: 2025,
        tipoIngreso: "REINGRESO",
        genero: "HOMBRES",
        numero: 38,
        procesoId: proceso.id,
      },
    }),
    prisma.matricula.create({
      data: {
        id: "MAT004",
        idMatricula: "MAT004",
        generacion: 2025,
        tipoIngreso: "REINGRESO",
        genero: "MUJERES",
        numero: 41,
        procesoId: proceso.id,
      },
    }),
  ]);

  // ==================== RENDIMIENTO ====================
  console.log("Creating rendimiento...");

  const rendimientoData = [
    {
      id: "REN001",
      idRendimiento: "REN001",
      idCohorte: "2018-2022",
      ingresaron: 95,
      desercion: 18,
      rezago: 12,
      egresados: 65,
      titulados: 58,
    },
    {
      id: "REN002",
      idRendimiento: "REN002",
      idCohorte: "2019-2023",
      ingresaron: 102,
      desercion: 15,
      rezago: 10,
      egresados: 77,
      titulados: 70,
    },
    {
      id: "REN003",
      idRendimiento: "REN003",
      idCohorte: "2020-2024",
      ingresaron: 88,
      desercion: 12,
      rezago: 8,
      egresados: 68,
      titulados: 61,
    },
    {
      id: "REN004",
      idRendimiento: "REN004",
      idCohorte: "2021-2025",
      ingresaron: 110,
      desercion: 20,
      rezago: 14,
      egresados: 76,
      titulados: 65,
    },
    {
      id: "REN005",
      idRendimiento: "REN005",
      idCohorte: "2022-2026",
      ingresaron: 97,
      desercion: 10,
      rezago: 9,
      egresados: 0,
      titulados: 0,
    },
  ];

  await Promise.all(
    rendimientoData.map((r) =>
      prisma.rendimiento.create({
        data: {
          id: r.id,
          idRendimiento: r.idRendimiento,
          idCohorte: r.idCohorte,
          ingresaron: r.ingresaron,
          desercion: r.desercion,
          rezago: r.rezago,
          egresados: r.egresados,
          titulados: r.titulados,
          procesoId: proceso.id,
        },
      })
    )
  );

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
