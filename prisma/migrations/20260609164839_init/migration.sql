-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Node" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'normal',
    "websiteUrl" TEXT,
    "capacityData" TEXT,
    "nodeColor" TEXT,
    "textColor" TEXT NOT NULL DEFAULT '#000000',
    "x" REAL NOT NULL DEFAULT 0,
    "y" REAL NOT NULL DEFAULT 0,
    "manualX" REAL,
    "manualY" REAL,
    "useManualOverride" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "icon" TEXT,
    "kpiValue" TEXT,
    "kpiUnit" TEXT,
    "lastUpdated" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Node_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Node" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "edgeColor" TEXT NOT NULL DEFAULT '#64748b',
    "edgeStyle" TEXT NOT NULL DEFAULT 'solid',
    "label" TEXT,
    "flowVolume" REAL,
    "flowType" TEXT,
    "animated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Edge_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Node" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Edge_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Node" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DashboardStat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "statName" TEXT NOT NULL,
    "value" REAL NOT NULL DEFAULT 0,
    "calculatedValue" REAL,
    "isManualOverride" BOOLEAN NOT NULL DEFAULT false,
    "unit" TEXT,
    "formula" TEXT,
    "lastCalculated" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GridConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "canvasWidth" INTEGER NOT NULL DEFAULT 1920,
    "canvasHeight" INTEGER NOT NULL DEFAULT 1080,
    "gridSize" INTEGER NOT NULL DEFAULT 100,
    "nodeWidth" INTEGER NOT NULL DEFAULT 280,
    "nodeHeight" INTEGER NOT NULL DEFAULT 140,
    "horizontalSpacing" INTEGER NOT NULL DEFAULT 320,
    "verticalSpacing" INTEGER NOT NULL DEFAULT 180,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardStat_statName_key" ON "DashboardStat"("statName");
