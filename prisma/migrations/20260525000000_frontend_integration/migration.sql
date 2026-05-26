-- Extend user and service data required by the client/provider UI.
ALTER TABLE "Usuario"
ADD COLUMN "ciudad" TEXT,
ADD COLUMN "estado" TEXT,
ADD COLUMN "lat" DOUBLE PRECISION,
ADD COLUMN "lng" DOUBLE PRECISION,
ADD COLUMN "preferencias" JSONB,
ADD COLUMN "especialidad" TEXT,
ADD COLUMN "descripcion_profesional" TEXT,
ADD COLUMN "experiencia_anios" INTEGER,
ADD COLUMN "precio_hora" DOUBLE PRECISION,
ADD COLUMN "zona_cobertura" TEXT,
ADD COLUMN "disponible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "etiquetas" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

ALTER TABLE "Servicio" ADD COLUMN "categoria_id" INTEGER;
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_categoria_id_fkey"
FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Solicitud"
ADD COLUMN "titulo" TEXT,
ADD COLUMN "prioridad" TEXT NOT NULL DEFAULT 'normal',
ADD COLUMN "fecha_programada" TIMESTAMP(3),
ADD COLUMN "duracion_estimada_min" INTEGER,
ADD COLUMN "precio_estimado" DOUBLE PRECISION,
ADD COLUMN "precio_final" DOUBLE PRECISION;

UPDATE "Solicitud" SET "estado" = CASE "estado"
  WHEN 'pendiente' THEN 'pending'
  WHEN 'aceptada' THEN 'accepted'
  WHEN 'rechazada' THEN 'rejected'
  WHEN 'completada' THEN 'completed'
  WHEN 'cancelada' THEN 'cancelled'
  ELSE "estado"
END;

ALTER TABLE "Solicitud" ALTER COLUMN "estado" SET DEFAULT 'pending';

UPDATE "Pago" SET "estado" = CASE "estado"
  WHEN 'pendiente' THEN 'pending'
  WHEN 'pagado' THEN 'paid'
  WHEN 'fallido' THEN 'failed'
  WHEN 'reembolsado' THEN 'refunded'
  ELSE "estado"
END;
ALTER TABLE "Pago" ALTER COLUMN "estado" SET DEFAULT 'pending';

CREATE TABLE "Direccion" (
    "id" SERIAL NOT NULL,
    "etiqueta" TEXT,
    "calle" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "codigo_postal" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "usuario_id" INTEGER NOT NULL,
    CONSTRAINT "Direccion_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Solicitud" ADD COLUMN "direccion_id" INTEGER;
ALTER TABLE "Direccion" ADD CONSTRAINT "Direccion_usuario_id_fkey"
FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_direccion_id_fkey"
FOREIGN KEY ("direccion_id") REFERENCES "Direccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "Favorito" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "prestador_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorito_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Favorito_cliente_id_prestador_id_key"
ON "Favorito"("cliente_id", "prestador_id");

ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_cliente_id_fkey"
FOREIGN KEY ("cliente_id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_prestador_id_fkey"
FOREIGN KEY ("prestador_id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
