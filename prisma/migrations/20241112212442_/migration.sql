-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserProgress" ADD COLUMN     "currentVisualStep" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pathStepId" TEXT;

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
CREATE TABLE "VisualizationConfig" (
    "id" TEXT NOT NULL,
    "curveId" TEXT NOT NULL,
    "initialState" JSONB NOT NULL,
    "totalSteps" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisualizationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisualizationStep" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "transformations" JSONB NOT NULL,
    "highlightPoints" JSONB NOT NULL,

    CONSTRAINT "VisualizationStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathStep" (
    "id" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "curveId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "conceptDescription" TEXT NOT NULL,

    CONSTRAINT "PathStep_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "VisualizationConfig_curveId_key" ON "VisualizationConfig"("curveId");

-- CreateIndex
CREATE UNIQUE INDEX "VisualizationStep_configId_stepNumber_key" ON "VisualizationStep"("configId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PathStep_pathId_stepNumber_key" ON "PathStep"("pathId", "stepNumber");

-- CreateIndex
CREATE INDEX "Curve_wolframId_idx" ON "Curve"("wolframId");

-- CreateIndex
CREATE INDEX "UserProgress_userId_idx" ON "UserProgress"("userId");

-- CreateIndex
CREATE INDEX "UserProgress_curveId_idx" ON "UserProgress"("curveId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_pathStepId_fkey" FOREIGN KEY ("pathStepId") REFERENCES "PathStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualizationConfig" ADD CONSTRAINT "VisualizationConfig_curveId_fkey" FOREIGN KEY ("curveId") REFERENCES "Curve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualizationStep" ADD CONSTRAINT "VisualizationStep_configId_fkey" FOREIGN KEY ("configId") REFERENCES "VisualizationConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathStep" ADD CONSTRAINT "PathStep_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "LearningPath"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathStep" ADD CONSTRAINT "PathStep_curveId_fkey" FOREIGN KEY ("curveId") REFERENCES "Curve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
