# Migration `20200708202909-initial`

This migration has been generated by German Castro at 7/8/2020, 8:29:09 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Alumn" (
"email" text  NOT NULL ,
"id" SERIAL,
"name" text  NOT NULL ,
"surname" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Seminar" (
"alumnId" integer  NOT NULL ,
"description" text   ,
"id" SERIAL,
"title" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Vote" (
"id" SERIAL,
"quality" integer  NOT NULL ,
"seminar" integer  NOT NULL ,
"user" integer  NOT NULL ,
"utility" integer  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."User" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"id" SERIAL,
"password" text  NOT NULL ,
"updatedAt" timestamp(3)  NOT NULL ,
"username" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "Alumn.email" ON "public"."Alumn"("email")

CREATE UNIQUE INDEX "Seminar_alumnId" ON "public"."Seminar"("alumnId")

CREATE UNIQUE INDEX "User.username" ON "public"."User"("username")

ALTER TABLE "public"."Seminar" ADD FOREIGN KEY ("alumnId")REFERENCES "public"."Alumn"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Vote" ADD FOREIGN KEY ("user")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Vote" ADD FOREIGN KEY ("seminar")REFERENCES "public"."Seminar"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200708202909-initial
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,50 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model Alumn {
+  id          Int       @id @default(autoincrement())
+  name        String
+  surname     String
+  email       String    @unique
+  seminar     Seminar?
+}
+
+model Seminar {
+  id            Int       @id @default(autoincrement())
+  title         String
+  description   String?
+
+  votes         Vote[]
+  alumnId       Int
+  alumn         Alumn     @relation(fields: [alumnId], references: [id])
+}
+
+model Vote {
+  id        Int     @id @default(autoincrement())
+  quality   Int
+  utility   Int
+  seminar   Int     //@unique
+  user      Int     //@unique
+
+  User      User    @relation(fields: [user], references: [id])
+  Seminar   Seminar @relation(fields: [seminar], references: [id])
+}
+
+model User {
+  id          Int       @id @default(autoincrement()) 
+  createdAt   DateTime  @default(now())
+  updatedAt   DateTime  @updatedAt
+
+  username    String    @unique
+  password    String
+  votes       Vote[]
+}
```

