-- CreateTable
CREATE TABLE "BundleCollections" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "collectionId" TEXT NOT NULL,
    "bundleId" INTEGER NOT NULL,
    CONSTRAINT "BundleCollections_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
