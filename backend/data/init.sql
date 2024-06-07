CREATE TABLE public.user (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    username VARCHAR(255) ,
    email VARCHAR(255) NOT NULL,
    bio VARCHAR(255),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP 
);

CREATE TABLE public.category (
  name VARCHAR(255) UNIQUE
);

CREATE TABLE public.post (
    id SERIAL PRIMARY KEY,
    content VARCHAR NOT NULL,
    user_id VARCHAR(255) NOT NULL REFERENCES public.user (id) ON DELETE CASCADE ON UPDATE CASCADE,
    category_name VARCHAR(255) REFERENCES public.category (name) ON DELETE SET NULL ON UPDATE CASCADE,
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

CREATE TABLE public.post_deletion_log (
    id SERIAL PRIMARY KEY,
    post_id INTEGER,
    user_id VARCHAR(255) REFERENCES public.user (id) ON DELETE SET NULL ON UPDATE CASCADE,
    deleted_at TIMESTAMP
);

CREATE TABLE public.media (
    id  VARCHAR PRIMARY KEY,
    url VARCHAR NOT NULL,
    post_id INTEGER REFERENCES public.post (id) ON DELETE CASCADE ON UPDATE CASCADE
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

CREATE TABLE public.user_likes_comment (
    user_id VARCHAR(255) REFERENCES public.user (id) ON DELETE CASCADE ON UPDATE CASCADE,
    comment_id INTEGER REFERENCES public.comment (id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (user_id, comment_id)
);

CREATE OR REPLACE VIEW post_like_counts AS
    SELECT
    	post.id AS post_id,
    	COALESCE(
    		COUNT(post_id), 0) AS likes_count
    FROM
    	public.post AS post
    	LEFT JOIN public.user_likes_post AS user_likes_post ON post.id = user_likes_post.post_id
    GROUP BY
    	post.id
    ORDER BY
    	post.id;

CREATE OR REPLACE FUNCTION log_post_deletion() RETURNS TRIGGER AS $$ BEGIN
    INSERT INTO
        post_deletion_log (post_id, user_id, deleted_at)
    VALUES
        (OLD.id, OLD.user_id, NOW());
    RETURN OLD;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_log BEFORE DELETE ON post
FOR EACH ROW EXECUTE FUNCTION log_post_deletion();

CREATE INDEX post_created_at_idx ON public.post (created_at);

INSERT INTO public.user (id, username, email, bio, profile_picture) VALUES ('user_2f2BNrbARuhvr1M84Jq4kALpw9O', 'chinathai', 'cartoonabe@gmail.com', 'super cool guy working on the backend',  'https://images.clerk.dev/oauth_google/img_2f2BNtJlk61Ubm5YZfPLTAqUTVU');
INSERT INTO public.user (id, username, email, bio, profile_picture) VALUES ('user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'tawan', 'alohasunshineday@gmail.com', 'this guy write the frontend for course compose', 'https://images.clerk.dev/oauth_google/img_2f02ECClQ9noFSgkv8NHZpJmIDc');
INSERT INTO public.user (id, username, email, bio, profile_picture) VALUES ('user_2fMEDm1UZ3hZp1RyRijAQ4Psh2I', 'tester', 'tochar@proton.me', 'who is this guy?', 'https://images.clerk.dev/oauth_google/img_2f02ECClQ9noFSgkv8NHZpJmIDc');

INSERT INTO public.category (name) VALUES ('general');
INSERT INTO public.category (name) VALUES ('education');
INSERT INTO public.category (name) VALUES ('technology');
INSERT INTO public.category (name) VALUES ('entertainment');

INSERT INTO public.post (content, user_id, category_name) VALUES ('How I get 0 hours of sleep because of classes','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 'general');
INSERT INTO public.post (content, user_id, category_name) VALUES ('NextJS is great and all that....','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'technology');
INSERT INTO public.post (content, user_id, category_name) VALUES ('yee haaa','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 'general');
INSERT INTO public.post (content, user_id, category_name) VALUES ('hiiiiiii','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'general');
INSERT INTO public.post (content, user_id, category_name) VALUES ('woohoooo!!!','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 'general');
INSERT INTO public.post (content, user_id, category_name) VALUES ('Stamford Syntax Club!','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'education');
INSERT INTO public.post (content, user_id, category_name) VALUES ('ITE442 projectsssss','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 'education');
INSERT INTO public.post (content, user_id, category_name) VALUES ('NestJS is legit','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'technology');
INSERT INTO public.post (content, user_id, category_name) VALUES ('But Go Fiber is better','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 'technology');
INSERT INTO public.post (content, user_id, category_name) VALUES ('Pagintion in GraphQL is annoying','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'technology');
INSERT INTO public.post (content, user_id, category_name) VALUES ('this is 11','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'general');
INSERT INTO public.post (content, user_id, category_name) VALUES ('12 is my life','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 'general');
INSERT INTO public.post (content, user_id, category_name) VALUES ('13 is not death','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'general');
INSERT INTO public.post (content, user_id, category_name) VALUES ('but 14 is lol','user_2fMEDm1UZ3hZp1RyRijAQ4Psh2I', 'general');
INSERT INTO public.post (content, user_id, category_name) VALUES ('something is wrong 15','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 'general');
INSERT INTO public.post (content, user_id, category_name) VALUES ('in your neighbourhood 16','user_2f2BNrbARuhvr1M84Jq4kALpw9O', 'general');
INSERT INTO public.post (content, user_id, category_name) VALUES ('who you gonna call? 17','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'general');
INSERT INTO public.post (content, user_id, category_name) VALUES ('ghost BUSTAS 18','user_2fMEDm1UZ3hZp1RyRijAQ4Psh2I', 'general');
INSERT INTO public.post (content, user_id, category_name) VALUES ('but 19 ghosts','user_2fMEDm1UZ3hZp1RyRijAQ4Psh2I', 'general');
INSERT INTO public.post (content, user_id, category_name) VALUES ('but not my problem','user_2f02EDTfrcAuyhODlRHaNLP6LQQ', 'general');

INSERT INTO public.comment (content, post_id, user_id) VALUES ('Me too....', 1, 'user_2f02EDTfrcAuyhODlRHaNLP6LQQ');
INSERT INTO public.comment (content, post_id, user_id) VALUES ('sure, but dockerize it yourself', 1, 'user_2f2BNrbARuhvr1M84Jq4kALpw9O');
