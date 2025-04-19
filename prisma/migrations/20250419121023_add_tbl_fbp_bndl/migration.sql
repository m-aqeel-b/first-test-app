-- CreateTable
CREATE TABLE "fbp_Bundles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DECIMAL NOT NULL,
    "media" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL
);
