// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs


Table post {
  id integer [primary key,
              ref: < comment.post_id, 
              ref: > post_hashtag.post_id,
              ref: > user_likes_post.post_id,
              ref: - user_shares_post.post_id]
  content varchar
  user_id varchar
  category_name varchar
  created_at timestamp
  updated_at timestamp
}


Table user {
  id varchar [primary key, 
              ref: < post.user_id, 
              ref: < comment.user_id,
              ref: > user_likes_post.user_id,
              ref: > user_follow.user_id,
              ref: > user_follow.follow_id,
              ref: - user_shares_post.user_id]
  username varchar
  email varchar
  bio varchar
  display_name varchar
  profile_picture varchar
  created_at timestamp
  updated_at timestamp
}
Table hashtag {
  id integer [primary key, ref: > post_hashtag.hashtag_id]
  name varchar [unique]
}

Table post_hashtag {
  post_id integer
  hashtag_id integer
}

Table user_follow {
  user_id varchar
  follow_id varchar
}

Table user_shares_post {
  user_id varchar
  post_id varchar
  content varchar
}

Table user_likes_post {
  post_id integer
  user_id varchar
}

Table category {
  name varchar [primary key, ref: - post.category_name]
}

Table comment {
  id integer [primary key]
  content varchar
  post_id integer
  user_id varchar
  created_at timestamp
  updated_at timestamp
}
