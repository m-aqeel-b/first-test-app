-- CreateTable
CREATE TABLE "fbp_BundleProducts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "bundleId" INTEGER NOT NULL,
    CONSTRAINT "fbp_BundleProducts_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "fbp_Bundles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
