CREATE TABLE public.user (
    id varchar(255) NOT NULL PRIMARY KEY,
    username varchar(255) ,
    email varchar(255) NOT NULL,
    bio varchar(255),
    display_name varchar(255),
    profile_picture varchar(255),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE public.category (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE
);

CREATE TABLE public.post (
    id SERIAL PRIMARY KEY,
    content VARCHAR,
    user_id VARCHAR REFERENCES public.user (id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES public.category (id),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP
);

CREATE TABLE public.comment (
    id SERIAL PRIMARY KEY,
    content VARCHAR,
    post_id INTEGER REFERENCES public.post (id),
    user_id VARCHAR REFERENCES public.user (id),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP
);

CREATE TABLE public.hashtag (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE
);

INSERT INTO public.user (id, username, email, bio, display_name, profile_picture) VALUES ('user_2f2BNrbARuhvr1M84Jq4kALpw9O', 'chinathai', 'cartoonabe@gmail.com', '', '', 'https://images.clerk.dev/oauth_google/img_2f2BNtJlk61Ubm5YZfPLTAqUTVU');
INSERT INTO public.user (id, username, email, bio, display_name, profile_picture) VALUES ('user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'tawan', 'alohasunshineday@gmail.com', '', '', 'https://images.clerk.dev/oauth_google/img_2f02ECClQ9noFSgkv8NHZpJmIDc');
