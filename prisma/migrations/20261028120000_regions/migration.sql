-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'CARD';

-- CreateEnum
CREATE TYPE "Country" AS ENUM ('SA', 'EG');

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "country" "Country" NOT NULL DEFAULT 'SA';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "country" "Country" NOT NULL DEFAULT 'SA',
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'SAR',
ADD COLUMN     "giftMessage" TEXT,
ADD COLUMN     "isGift" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "senderName" TEXT,
ADD COLUMN     "senderPhone" TEXT;
