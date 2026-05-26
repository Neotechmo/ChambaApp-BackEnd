ALTER TABLE "Solicitud"
ADD COLUMN "fecha_propuesta" TIMESTAMP(3),
ADD COLUMN "propuesta_pendiente" BOOLEAN NOT NULL DEFAULT false;
