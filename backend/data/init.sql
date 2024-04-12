CREATE TABLE "public"."user" (
    "id" uuid NOT NULL,
    "username" varchar,
    "email" varchar,
    "bio" varchar,
    "display_name" varchar,
    "profile_picture" varchar,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);
