-- CreateTable
CREATE TABLE "BotMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "instanceName" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMessageStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "instanceName" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "botSendMessage" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "timeToAnswer" INTEGER NOT NULL DEFAULT 0,
    "pausedUntil" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMessageStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BotMessage_userId_key" ON "BotMessage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMessageStatus_userId_instanceName_key" ON "UserMessageStatus"("userId", "instanceName");

-- AddForeignKey
ALTER TABLE "BotMessage" ADD CONSTRAINT "BotMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMessageStatus" ADD CONSTRAINT "UserMessageStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
