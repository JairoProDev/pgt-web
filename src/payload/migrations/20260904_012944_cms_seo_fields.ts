import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tours_assignee" AS ENUM('areli', 'jairo', 'lizet', 'ricardo');
  CREATE TYPE "public"."enum_pages_assignee" AS ENUM('areli', 'jairo', 'lizet', 'ricardo');
  CREATE TYPE "public"."enum_blogs_assignee" AS ENUM('areli', 'jairo', 'lizet', 'ricardo');
  CREATE TABLE "pages_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_child_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"path" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "blogs_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  
  ALTER TABLE "tours" ADD COLUMN "assignee" "enum_tours_assignee";
  ALTER TABLE "tours" ADD COLUMN "custom_html" varchar;
  ALTER TABLE "pages" ADD COLUMN "body_html" varchar;
  ALTER TABLE "pages" ADD COLUMN "assignee" "enum_pages_assignee";
  ALTER TABLE "blogs" ADD COLUMN "category" varchar;
  ALTER TABLE "blogs" ADD COLUMN "body_html" varchar;
  ALTER TABLE "blogs" ADD COLUMN "assignee" "enum_blogs_assignee";
  ALTER TABLE "pages_sections" ADD CONSTRAINT "pages_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_child_links" ADD CONSTRAINT "pages_child_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_sections" ADD CONSTRAINT "blogs_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_sections_order_idx" ON "pages_sections" USING btree ("_order");
  CREATE INDEX "pages_sections_parent_id_idx" ON "pages_sections" USING btree ("_parent_id");
  CREATE INDEX "pages_child_links_order_idx" ON "pages_child_links" USING btree ("_order");
  CREATE INDEX "pages_child_links_parent_id_idx" ON "pages_child_links" USING btree ("_parent_id");
  CREATE INDEX "blogs_sections_order_idx" ON "blogs_sections" USING btree ("_order");
  CREATE INDEX "blogs_sections_parent_id_idx" ON "blogs_sections" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_sections" CASCADE;
  DROP TABLE "pages_child_links" CASCADE;
  DROP TABLE "blogs_sections" CASCADE;
  ALTER TABLE "tours" DROP COLUMN "assignee";
  ALTER TABLE "tours" DROP COLUMN "custom_html";
  ALTER TABLE "pages" DROP COLUMN "body_html";
  ALTER TABLE "pages" DROP COLUMN "assignee";
  ALTER TABLE "blogs" DROP COLUMN "category";
  ALTER TABLE "blogs" DROP COLUMN "body_html";
  ALTER TABLE "blogs" DROP COLUMN "assignee";
  DROP TYPE "public"."enum_tours_assignee";
  DROP TYPE "public"."enum_pages_assignee";
  DROP TYPE "public"."enum_blogs_assignee";`)
}
