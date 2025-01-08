-- CreateTable
CREATE TABLE "Bundles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DECIMAL NOT NULL
);

-- CreateTable
CREATE TABLE "BundleProducts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bundleId" INTEGER NOT NULL,
    CONSTRAINT "BundleProducts_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
