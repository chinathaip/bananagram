CREATE TABLE public.user (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    username VARCHAR(255) ,
    email VARCHAR(255) NOT NULL,
    bio VARCHAR(255),
    display_name VARCHAR(255),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP 
);

CREATE TABLE public.category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);

CREATE TABLE public.post (
    id SERIAL PRIMARY KEY,
    content VARCHAR NOT NULL,
    user_id VARCHAR(255) NOT NULL REFERENCES public.user (id) ON DELETE CASCADE ON UPDATE CASCADE,
    category_id INTEGER REFERENCES public.category (id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP
);

CREATE TABLE public.comment (
    id SERIAL PRIMARY KEY,
    content VARCHAR,
    post_id INTEGER REFERENCES public.post (id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id VARCHAR(255) REFERENCES public.user (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP
);

CREATE TABLE public.hashtag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE
);

CREATE TABLE public.post_hashtag (
    hashtag_id INTEGER REFERENCES public.hashtag (id) ON DELETE CASCADE ON UPDATE CASCADE,
    post_id INTEGER REFERENCES public.post (id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (hashtag_id, post_id)
);

CREATE TABLE public.user_follow (
    user_id VARCHAR(255) REFERENCES public.user (id) ON DELETE CASCADE ON UPDATE CASCADE,
    friend_id VARCHAR(255) REFERENCES public.user (id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (user_id, friend_id)
);

CREATE TABLE public.user_shares_post (
    user_id VARCHAR(255) REFERENCES public.user (id) ON DELETE CASCADE ON UPDATE CASCADE,
    post_id INTEGER REFERENCES public.post (id) ON DELETE SET NULL ON UPDATE CASCADE,
    content VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP,
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE public.user_likes_post (
    user_id VARCHAR(255) REFERENCES public.user (id) ON DELETE CASCADE ON UPDATE CASCADE,
    post_id INTEGER REFERENCES public.post (id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (user_id, post_id)
);

INSERT INTO public.user (id, username, email, bio, display_name, profile_picture) VALUES ('user_2f2BNrbARuhvr1M84Jq4kALpw9O', 'chinathai', 'cartoonabe@gmail.com', 'super cool guy working on the backend', 'ChinathaiP', 'https://images.clerk.dev/oauth_google/img_2f2BNtJlk61Ubm5YZfPLTAqUTVU');
INSERT INTO public.user (id, username, email, bio, display_name, profile_picture) VALUES ('user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'tawan', 'alohasunshineday@gmail.com', 'this guy write the frontend for course compose', 'Lxkas', 'https://images.clerk.dev/oauth_google/img_2f02ECClQ9noFSgkv8NHZpJmIDc');
INSERT INTO public.user (id, username, email, bio, display_name, profile_picture) VALUES ('user_2fMEDm1UZ3hZp1RyRijAQ4Psh2I', 'tester', 'tochar@proton.me', 'who is this guy?', 'TestMan101', 'https://images.clerk.dev/oauth_google/img_2f02ECClQ9noFSgkv8NHZpJmIDc');

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
INSERT INTO public.post (content, user_id, category_id) VALUES ('yee haaa','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('hiiiiiii','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 2);
INSERT INTO public.post (content, user_id, category_id) VALUES ('woohoooo!!!','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('Stamford Syntax Club!','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 2);
INSERT INTO public.post (content, user_id, category_id) VALUES ('ITE442 projectsssss','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('NestJS is legit','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 2);
INSERT INTO public.post (content, user_id, category_id) VALUES ('But Go Fiber is better','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('Pagintion in GraphQL is annoying','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 2);
INSERT INTO public.post (content, user_id, category_id) VALUES ('this is 11','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('12 is my life','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('13 is not death','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('but 14 is lol','user_2fMEDm1UZ3hZp1RyRijAQ4Psh2I', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('something is wrong 15','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('in your neighbourhood 16','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('who you gonna call? 17','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('ghost BUSTAS 18','user_2fMEDm1UZ3hZp1RyRijAQ4Psh2I', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('but 19 ghosts','user_2fMEDm1UZ3hZp1RyRijAQ4Psh2I', 1);
INSERT INTO public.post (content, user_id, category_id) VALUES ('but not my problem','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 1);

INSERT INTO public.comment (content, post_id, user_id) VALUES ('Me too....', 1, 'user_2f02EDTfrcAuyhODlRHaNLP6LQQ');
INSERT INTO public.comment (content, post_id, user_id) VALUES ('sure, but dockerize it yourself', 1, 'user_2f2BNrbARuhvr1M84Jq4kALpw9O');
