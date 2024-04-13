CREATE TABLE "public"."user" (
    "id" varchar(255) NOT NULL,
    "username" varchar(255) ,
    "email" varchar(255) NOT NULL,
    "bio" varchar(255),
    "display_name" varchar(255),
    "profile_picture" varchar(255),
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz,
    PRIMARY KEY ("id")
);

INSERT INTO public.user (id, username, email, bio, display_name, profile_picture) VALUES ('user_2f2BNrbARuhvr1M84Jq4kALpw9O', 'chinathai', 'cartoonabe@gmail.com', '', '', 'https://images.clerk.dev/oauth_google/img_2f2BNtJlk61Ubm5YZfPLTAqUTVU');
INSERT INTO public.user (id, username, email, bio, display_name, profile_picture) VALUES ('user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'tawan', 'alohasunshineday@gmail.com', '', '', 'https://images.clerk.dev/oauth_google/img_2f02ECClQ9noFSgkv8NHZpJmIDc');
