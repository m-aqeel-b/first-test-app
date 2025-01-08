/*
  Warnings:

  - Added the required column `productId` to the `BundleProducts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BundleProducts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "bundleId" INTEGER NOT NULL,
    CONSTRAINT "BundleProducts_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BundleProducts" ("bundleId", "id") SELECT "bundleId", "id" FROM "BundleProducts";
DROP TABLE "BundleProducts";
ALTER TABLE "new_BundleProducts" RENAME TO "BundleProducts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
