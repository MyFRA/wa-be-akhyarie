-- CreateEnum
CREATE TYPE "MESSAGE_LOGS_status" AS ENUM ('pending', 'success', 'failed');

-- CreateTable
CREATE TABLE "CONTACT_GROUPS" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CONTACT_GROUPS_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "CONTACT_GROUP_HAS_CONTACTS" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "contact_group_uuid" UUID NOT NULL,
    "contact_uuid" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CONTACT_GROUP_HAS_CONTACTS_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "MESSAGE_LOGS" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "device_uuid" UUID NOT NULL,
    "contact_uuid" UUID NOT NULL,
    "message" VARCHAR(50) NOT NULL,
    "status" "MESSAGE_LOGS_status" NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MESSAGE_LOGS_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "MESSAGE_SCHEDULES" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "contact_group_uuid" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "schedule_hour" VARCHAR(255) NOT NULL,
    "status" "MESSAGE_LOGS_status" NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MESSAGE_SCHEDULES_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE INDEX "CONTACT_GROUPS_user_uuid_idx" ON "CONTACT_GROUPS"("user_uuid");

-- CreateIndex
CREATE INDEX "CONTACT_GROUP_HAS_CONTACTS_user_uuid_contact_group_uuid_con_idx" ON "CONTACT_GROUP_HAS_CONTACTS"("user_uuid", "contact_group_uuid", "contact_uuid");

-- CreateIndex
CREATE INDEX "MESSAGE_LOGS_user_uuid_device_uuid_contact_uuid_idx" ON "MESSAGE_LOGS"("user_uuid", "device_uuid", "contact_uuid");

-- CreateIndex
CREATE INDEX "MESSAGE_SCHEDULES_user_uuid_contact_group_uuid_idx" ON "MESSAGE_SCHEDULES"("user_uuid", "contact_group_uuid");

-- AddForeignKey
ALTER TABLE "CONTACT_GROUPS" ADD CONSTRAINT "CONTACT_GROUPS_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "USERS"("uuid") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "CONTACT_GROUP_HAS_CONTACTS" ADD CONSTRAINT "CONTACT_GROUP_HAS_CONTACTS_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "USERS"("uuid") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "CONTACT_GROUP_HAS_CONTACTS" ADD CONSTRAINT "CONTACT_GROUP_HAS_CONTACTS_contact_group_uuid_fkey" FOREIGN KEY ("contact_group_uuid") REFERENCES "CONTACT_GROUPS"("uuid") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "CONTACT_GROUP_HAS_CONTACTS" ADD CONSTRAINT "CONTACT_GROUP_HAS_CONTACTS_contact_uuid_fkey" FOREIGN KEY ("contact_uuid") REFERENCES "CONTACTS"("uuid") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "MESSAGE_LOGS" ADD CONSTRAINT "MESSAGE_LOGS_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "USERS"("uuid") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "MESSAGE_LOGS" ADD CONSTRAINT "MESSAGE_LOGS_device_uuid_fkey" FOREIGN KEY ("device_uuid") REFERENCES "DEVICES"("uuid") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "MESSAGE_LOGS" ADD CONSTRAINT "MESSAGE_LOGS_contact_uuid_fkey" FOREIGN KEY ("contact_uuid") REFERENCES "CONTACTS"("uuid") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "MESSAGE_SCHEDULES" ADD CONSTRAINT "MESSAGE_SCHEDULES_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "USERS"("uuid") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "MESSAGE_SCHEDULES" ADD CONSTRAINT "MESSAGE_SCHEDULES_contact_group_uuid_fkey" FOREIGN KEY ("contact_group_uuid") REFERENCES "CONTACT_GROUPS"("uuid") ON DELETE CASCADE ON UPDATE RESTRICT;

-- RenameIndex
ALTER INDEX "devices_user_uuid_foreign" RENAME TO "DEVICES_user_uuid_idx";
