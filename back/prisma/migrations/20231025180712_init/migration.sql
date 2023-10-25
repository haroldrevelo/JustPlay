-- CreateTable
CREATE TABLE "Games" (
    "id" SERIAL NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "equipos" TEXT NOT NULL,
    "image" BYTEA NOT NULL,
    "imageType" TEXT NOT NULL,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);
