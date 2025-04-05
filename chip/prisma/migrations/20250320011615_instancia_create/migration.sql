-- CreateTable
CREATE TABLE "instancia" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "instanciaName" TEXT NOT NULL,
    "statusConnection" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instancia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "instancia" ADD CONSTRAINT "instancia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
