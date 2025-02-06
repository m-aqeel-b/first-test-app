/*
  Warnings:

  - Added the required column `discountCode` to the `Bundles` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bundles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "discountCode" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DECIMAL NOT NULL
);
INSERT INTO "new_Bundles" ("discountType", "discountValue", "id", "name") SELECT "discountType", "discountValue", "id", "name" FROM "Bundles";
DROP TABLE "Bundles";
ALTER TABLE "new_Bundles" RENAME TO "Bundles";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
