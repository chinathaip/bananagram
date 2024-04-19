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
  name VARCHAR(255) UNIQUE
);

CREATE TABLE public.post (
    id SERIAL PRIMARY KEY,
    content VARCHAR NOT NULL,
    user_id VARCHAR(255) NOT NULL REFERENCES public.user (id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES public.category (id),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP
);

CREATE TABLE public.comment (
    id SERIAL PRIMARY KEY,
    content VARCHAR,
    post_id INTEGER REFERENCES public.post (id),
    user_id VARCHAR(255) REFERENCES public.user (id),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP
);

CREATE TABLE public.hashtag (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);

INSERT INTO public.user (id, username, email, bio, display_name, profile_picture) VALUES ('user_2f2BNrbARuhvr1M84Jq4kALpw9O', 'chinathai', 'cartoonabe@gmail.com', '', '', 'https://images.clerk.dev/oauth_google/img_2f2BNtJlk61Ubm5YZfPLTAqUTVU');
INSERT INTO public.user (id, username, email, bio, display_name, profile_picture) VALUES ('user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'tawan', 'alohasunshineday@gmail.com', '', '', 'https://images.clerk.dev/oauth_google/img_2f02ECClQ9noFSgkv8NHZpJmIDc');

INSERT INTO public.category (name) VALUES ('Education');
INSERT INTO public.category (name) VALUES ('Technology');
INSERT INTO public.category (name) VALUES ('Entertainment');

INSERT INTO public.hashtag(name) VALUES ('nextjs');
INSERT INTO public.hashtag(name) VALUES ('javascript');
INSERT INTO public.hashtag(name) VALUES ('frontend');
INSERT INTO public.hashtag(name) VALUES ('universitylife');
INSERT INTO public.hashtag(name) VALUES ('study');
INSERT INTO public.hashtag(name) VALUES ('stamford');

INSERT INTO public.post (content, user_id, category_id) VALUES ('How I get 0 hours of sleep because of classes','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('NextJS is great and all that....','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 2);

INSERT INTO public.comment (content, post_id, user_id) VALUES ('Me too....', 1, 'user_2f02EDTfrcAuyhODlRHaNLP6LQQ');
INSERT INTO public.comment (content, post_id, user_id) VALUES ('sure, but dockerize it yourself', 1, 'user_2f2BNrbARuhvr1M84Jq4kALpw9O');
