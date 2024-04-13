CREATE TABLE "public"."user" (
    "id" uuid NOT NULL,
    "username" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL,
    "bio" varchar(255),
    "display_name" varchar(255),
    "profile_picture" varchar(255),
    "created_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

INSERT INTO public.user (id, username, email, bio, display_name, profile_picture) VALUES ('132e9528-4a70-4ef4-9c68-f8f54a984a29', 'michael123', 'michael123@gmail.com', 'Wassup', 'MichaelZaza', '');
