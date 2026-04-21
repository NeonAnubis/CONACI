-- CreateEnum
CREATE TYPE "RolSistema" AS ENUM ('INSTITUCION', 'EVALUADOR', 'CONACI');

-- CreateEnum
CREATE TYPE "SubRolConaci" AS ENUM ('COMITE_DICTAMEN', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "RolInstitucion" AS ENUM ('COORDINADOR', 'RESPONSABLE');

-- CreateEnum
CREATE TYPE "EstadoProceso" AS ENUM ('EN_PREPARACION', 'EN_AUTOEVALUACION', 'EN_EVALUACION', 'EN_DICTAMEN', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "EtapaEvaluacion" AS ENUM ('AUTOEVALUACION', 'REVISION_GABINETE', 'SOLICITUD_INFORMACION', 'RESPUESTA_INSTITUCION', 'VISITA_IN_SITU', 'DICTAMEN', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PENDIENTE', 'RESPONDIDA', 'CERRADA');

-- CreateEnum
CREATE TYPE "TipoEvidencia" AS ENUM ('DOCUMENTO', 'ENLACE', 'ARCHIVO_ADJUNTO', 'IMAGEN', 'VIDEO');

-- CreateEnum
CREATE TYPE "TipoContratacion" AS ENUM ('TIEMPO_COMPLETO', 'TRES_CUARTOS', 'MEDIO_TIEMPO', 'ASIGNATURA', 'INVESTIGADOR', 'EXTERNO');

-- CreateEnum
CREATE TYPE "GradoAcademico" AS ENUM ('TSU', 'PA', 'LICENCIATURA', 'ESPECIALIDAD', 'MAESTRIA', 'DOCTORADO');

-- CreateEnum
CREATE TYPE "TipoIngreso" AS ENUM ('NUEVO_INGRESO', 'REINGRESO');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('HOMBRES', 'MUJERES');

-- CreateEnum
CREATE TYPE "TipoPrograma" AS ENUM ('LICENCIATURA', 'MAESTRIA', 'DOCTORADO', 'ESPECIALIDAD');

-- CreateEnum
CREATE TYPE "ResultadoAcreditacion" AS ENUM ('ACREDITACION_CONSOLIDADA', 'ACREDITACION_EN_DESARROLLO', 'ACREDITACION_CONDICIONADA', 'NO_ACREDITADO');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rolSistema" "RolSistema" NOT NULL,
    "subRolConaci" "SubRolConaci",
    "rolInstitucion" "RolInstitucion",
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrumento" (
    "id" TEXT NOT NULL,
    "idInstrumento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT,
    "valorMaximo" DOUBLE PRECISION NOT NULL DEFAULT 200,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Instrumento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "idCategoria" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "valorMaximo" DOUBLE PRECISION NOT NULL,
    "instrumentoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Criterio" (
    "id" TEXT NOT NULL,
    "idCriterio" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "valorMaximo" DOUBLE PRECISION NOT NULL,
    "valorMinimo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "instrumentoId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Criterio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Elemento" (
    "id" TEXT NOT NULL,
    "idElemento" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "criterioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Elemento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nivel" (
    "id" TEXT NOT NULL,
    "idNivel" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "criterioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proceso" (
    "id" TEXT NOT NULL,
    "idProceso" TEXT NOT NULL,
    "nombreProceso" TEXT NOT NULL,
    "estadoProceso" "EstadoProceso" NOT NULL DEFAULT 'EN_PREPARACION',
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "instrumentoId" TEXT NOT NULL,
    "institucionId" TEXT,
    "programaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proceso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcesoUsuario" (
    "id" TEXT NOT NULL,
    "procesoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcesoUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignacionEvaluador" (
    "id" TEXT NOT NULL,
    "idAsignacion" TEXT NOT NULL,
    "claveEvaluador" TEXT,
    "procesoId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AsignacionEvaluador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fundamentacion" (
    "id" TEXT NOT NULL,
    "idFundamentacion" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "descripcionEvidencia" TEXT,
    "tipoEvidencia" "TipoEvidencia",
    "ubicacionEvidencia" TEXT,
    "linkEvidencia" TEXT,
    "numeroFundamentacion" INTEGER,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "procesoId" TEXT NOT NULL,
    "criterioId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fundamentacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluacion" (
    "id" TEXT NOT NULL,
    "idEvaluacion" TEXT NOT NULL,
    "etapa" "EtapaEvaluacion" NOT NULL,
    "rol" "RolSistema" NOT NULL,
    "nivel" DOUBLE PRECISION,
    "justificacion" TEXT,
    "observaciones" TEXT,
    "recomendaciones" TEXT,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "procesoId" TEXT NOT NULL,
    "criterioId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" TEXT NOT NULL,
    "idSolicitud" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" TEXT,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "procesoId" TEXT NOT NULL,
    "criterioId" TEXT NOT NULL,
    "evaluadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Respuesta" (
    "id" TEXT NOT NULL,
    "idRespuesta" TEXT NOT NULL,
    "respuesta" TEXT NOT NULL,
    "descripcionEvidencia" TEXT,
    "tipoEvidencia" "TipoEvidencia",
    "ubicacionEvidencia" TEXT,
    "linkEvidencia" TEXT,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solicitudId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Respuesta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstadoCriterio" (
    "id" TEXT NOT NULL,
    "idEstado" TEXT NOT NULL,
    "etapaActual" "EtapaEvaluacion" NOT NULL DEFAULT 'AUTOEVALUACION',
    "ordenEstado" INTEGER NOT NULL DEFAULT 1,
    "progresoPorcentaje" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "responsableActual" TEXT,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "procesoId" TEXT NOT NULL,
    "criterioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstadoCriterio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultadoCriterio" (
    "id" TEXT NOT NULL,
    "idResultado" TEXT NOT NULL,
    "nivelAutoevaluacion" DOUBLE PRECISION,
    "nivelEvaluador" DOUBLE PRECISION,
    "nivelDictamen" DOUBLE PRECISION,
    "factor" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "puntajeAutoevaluacion" DOUBLE PRECISION,
    "puntajeEvaluador" DOUBLE PRECISION,
    "puntajeDictamen" DOUBLE PRECISION,
    "diferenciaAutoEval" DOUBLE PRECISION,
    "diferenciaEvalDict" DOUBLE PRECISION,
    "estadoResultado" TEXT,
    "observacionesFinales" TEXT,
    "recomendacionesFinales" TEXT,
    "fechaActualizacion" TIMESTAMP(3),
    "procesoId" TEXT NOT NULL,
    "criterioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResultadoCriterio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumenProceso" (
    "id" TEXT NOT NULL,
    "idResumen" TEXT NOT NULL,
    "totalAutoevaluacion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalEvaluador" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDictamen" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "diferenciaTotalAutoDict" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "porcentajeCumplimiento" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "resultadoFinal" "ResultadoAcreditacion" NOT NULL DEFAULT 'NO_ACREDITADO',
    "procesoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumenProceso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" TEXT NOT NULL,
    "idAuditoria" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "tabla" TEXT NOT NULL,
    "registroId" TEXT,
    "valorAnterior" TEXT,
    "valorNuevo" TEXT,
    "fechaAccion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "procesoId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institucion" (
    "id" TEXT NOT NULL,
    "idInstitucion" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "campus" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "pais" TEXT,
    "contactoPrincipal" TEXT,
    "telefono" TEXT,
    "correo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramaAcademico" (
    "id" TEXT NOT NULL,
    "idPrograma" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipoPrograma" "TipoPrograma",
    "coordinador" TEXT,
    "correoCoordinador" TEXT,
    "institucionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramaAcademico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantaDocente" (
    "id" TEXT NOT NULL,
    "idRegistro" TEXT NOT NULL,
    "tipoContratacion" "TipoContratacion" NOT NULL,
    "gradoEstudio" "GradoAcademico" NOT NULL,
    "numeroDocentes" INTEGER NOT NULL,
    "procesoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantaDocente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapeoDocente" (
    "id" TEXT NOT NULL,
    "idDocente" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipoContratacion" "TipoContratacion",
    "gradoAcademico" "GradoAcademico",
    "areaEspecializacion" TEXT,
    "asignaturas" TEXT,
    "experienciaProfesional" TEXT,
    "antiguedadInstitucion" DOUBLE PRECISION,
    "antiguedadPrograma" DOUBLE PRECISION,
    "investigacion" TEXT,
    "produccionAcademica" TEXT,
    "certificaciones" TEXT,
    "vinculacionSectorial" TEXT,
    "actualizacionDocente" TEXT,
    "observaciones" TEXT,
    "cumplePerfil" BOOLEAN,
    "nivelIdoneidad" DOUBLE PRECISION,
    "procesoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MapeoDocente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matricula" (
    "id" TEXT NOT NULL,
    "idMatricula" TEXT NOT NULL,
    "generacion" INTEGER NOT NULL,
    "tipoIngreso" "TipoIngreso" NOT NULL,
    "genero" "Genero" NOT NULL,
    "numero" INTEGER NOT NULL,
    "procesoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Matricula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rendimiento" (
    "id" TEXT NOT NULL,
    "idRendimiento" TEXT NOT NULL,
    "idCohorte" TEXT NOT NULL,
    "ingresaron" INTEGER NOT NULL,
    "desercion" INTEGER NOT NULL DEFAULT 0,
    "rezago" INTEGER NOT NULL DEFAULT 0,
    "egresados" INTEGER NOT NULL DEFAULT 0,
    "titulados" INTEGER NOT NULL DEFAULT 0,
    "procesoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rendimiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Instrumento_idInstrumento_key" ON "Instrumento"("idInstrumento");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_idCategoria_key" ON "Categoria"("idCategoria");

-- CreateIndex
CREATE UNIQUE INDEX "Criterio_idCriterio_key" ON "Criterio"("idCriterio");

-- CreateIndex
CREATE UNIQUE INDEX "Elemento_idElemento_key" ON "Elemento"("idElemento");

-- CreateIndex
CREATE UNIQUE INDEX "Nivel_idNivel_key" ON "Nivel"("idNivel");

-- CreateIndex
CREATE UNIQUE INDEX "Proceso_idProceso_key" ON "Proceso"("idProceso");

-- CreateIndex
CREATE UNIQUE INDEX "ProcesoUsuario_procesoId_userId_key" ON "ProcesoUsuario"("procesoId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "AsignacionEvaluador_idAsignacion_key" ON "AsignacionEvaluador"("idAsignacion");

-- CreateIndex
CREATE UNIQUE INDEX "Fundamentacion_idFundamentacion_key" ON "Fundamentacion"("idFundamentacion");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluacion_idEvaluacion_key" ON "Evaluacion"("idEvaluacion");

-- CreateIndex
CREATE UNIQUE INDEX "Solicitud_idSolicitud_key" ON "Solicitud"("idSolicitud");

-- CreateIndex
CREATE UNIQUE INDEX "Respuesta_idRespuesta_key" ON "Respuesta"("idRespuesta");

-- CreateIndex
CREATE UNIQUE INDEX "EstadoCriterio_idEstado_key" ON "EstadoCriterio"("idEstado");

-- CreateIndex
CREATE UNIQUE INDEX "EstadoCriterio_procesoId_criterioId_key" ON "EstadoCriterio"("procesoId", "criterioId");

-- CreateIndex
CREATE UNIQUE INDEX "ResultadoCriterio_idResultado_key" ON "ResultadoCriterio"("idResultado");

-- CreateIndex
CREATE UNIQUE INDEX "ResultadoCriterio_procesoId_criterioId_key" ON "ResultadoCriterio"("procesoId", "criterioId");

-- CreateIndex
CREATE UNIQUE INDEX "ResumenProceso_idResumen_key" ON "ResumenProceso"("idResumen");

-- CreateIndex
CREATE UNIQUE INDEX "ResumenProceso_procesoId_key" ON "ResumenProceso"("procesoId");

-- CreateIndex
CREATE UNIQUE INDEX "Auditoria_idAuditoria_key" ON "Auditoria"("idAuditoria");

-- CreateIndex
CREATE UNIQUE INDEX "Institucion_idInstitucion_key" ON "Institucion"("idInstitucion");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramaAcademico_idPrograma_key" ON "ProgramaAcademico"("idPrograma");

-- CreateIndex
CREATE UNIQUE INDEX "PlantaDocente_idRegistro_key" ON "PlantaDocente"("idRegistro");

-- CreateIndex
CREATE UNIQUE INDEX "MapeoDocente_idDocente_key" ON "MapeoDocente"("idDocente");

-- CreateIndex
CREATE UNIQUE INDEX "Matricula_idMatricula_key" ON "Matricula"("idMatricula");

-- CreateIndex
CREATE UNIQUE INDEX "Rendimiento_idRendimiento_key" ON "Rendimiento"("idRendimiento");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_instrumentoId_fkey" FOREIGN KEY ("instrumentoId") REFERENCES "Instrumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Criterio" ADD CONSTRAINT "Criterio_instrumentoId_fkey" FOREIGN KEY ("instrumentoId") REFERENCES "Instrumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Criterio" ADD CONSTRAINT "Criterio_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Elemento" ADD CONSTRAINT "Elemento_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "Criterio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nivel" ADD CONSTRAINT "Nivel_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "Criterio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proceso" ADD CONSTRAINT "Proceso_instrumentoId_fkey" FOREIGN KEY ("instrumentoId") REFERENCES "Instrumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proceso" ADD CONSTRAINT "Proceso_institucionId_fkey" FOREIGN KEY ("institucionId") REFERENCES "Institucion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proceso" ADD CONSTRAINT "Proceso_programaId_fkey" FOREIGN KEY ("programaId") REFERENCES "ProgramaAcademico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcesoUsuario" ADD CONSTRAINT "ProcesoUsuario_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcesoUsuario" ADD CONSTRAINT "ProcesoUsuario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionEvaluador" ADD CONSTRAINT "AsignacionEvaluador_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionEvaluador" ADD CONSTRAINT "AsignacionEvaluador_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionEvaluador" ADD CONSTRAINT "AsignacionEvaluador_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundamentacion" ADD CONSTRAINT "Fundamentacion_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundamentacion" ADD CONSTRAINT "Fundamentacion_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "Criterio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundamentacion" ADD CONSTRAINT "Fundamentacion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion" ADD CONSTRAINT "Evaluacion_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion" ADD CONSTRAINT "Evaluacion_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "Criterio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion" ADD CONSTRAINT "Evaluacion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "Criterio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_evaluadorId_fkey" FOREIGN KEY ("evaluadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstadoCriterio" ADD CONSTRAINT "EstadoCriterio_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstadoCriterio" ADD CONSTRAINT "EstadoCriterio_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "Criterio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultadoCriterio" ADD CONSTRAINT "ResultadoCriterio_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultadoCriterio" ADD CONSTRAINT "ResultadoCriterio_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "Criterio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumenProceso" ADD CONSTRAINT "ResumenProceso_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramaAcademico" ADD CONSTRAINT "ProgramaAcademico_institucionId_fkey" FOREIGN KEY ("institucionId") REFERENCES "Institucion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantaDocente" ADD CONSTRAINT "PlantaDocente_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapeoDocente" ADD CONSTRAINT "MapeoDocente_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rendimiento" ADD CONSTRAINT "Rendimiento_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
