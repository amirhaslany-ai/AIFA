-- AlterTable
ALTER TABLE "ai_provider_configs" ADD COLUMN     "apiKeyEnvVar" TEXT,
ADD COLUMN     "baseUrl" TEXT,
ADD COLUMN     "costPerInputTokenMicros" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "costPerOutputTokenMicros" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "model" TEXT;

