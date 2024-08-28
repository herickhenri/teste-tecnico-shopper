-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measures" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,
    "customer_id" TEXT NOT NULL,
    "confirmed_value" TEXT,

    CONSTRAINT "measures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "measures" ADD CONSTRAINT "measures_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
