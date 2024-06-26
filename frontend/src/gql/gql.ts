/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n\tquery Category {\n\t\tcategories {\n\t\t\tname\n\t\t}\n\t}\n": types.CategoryDocument,
    "\n\tquery Comments($postId: Int!) {\n\t\tcomments(post_id: $postId) {\n\t\t\tid\n\t\t\tcontent\n\t\t\tpost_id\n\t\t\tuser_liked\n\t\t\tlikes\n\t\t\tcreated_at\n\t\t\tupdated_at\n\t\t\tuser {\n\t\t\t\tid\n\t\t\t\tusername\n\t\t\t\tis_owner\n\t\t\t\tcreated_at\n\t\t\t\tprofile_picture\n\t\t\t}\n\t\t}\n\t}\n": types.CommentsDocument,
    "\n\tmutation CreatePost($createPostInput: CreatePostInput!) {\n\t\tcreatePost(createPostInput: $createPostInput) {\n\t\t\tid\n\t\t\tcontent\n\t\t}\n\t}\n": types.CreatePostDocument,
    "\n\tmutation DeleteMedia($id: String!) {\n\t\tremoveMedia(id: $id) {\n\t\t\tid\n\t\t\turl\n\t\t\tpost_id\n\t\t}\n\t}\n": types.DeleteMediaDocument,
    "\n\tmutation DeletePost($id: Int!) {\n\t\tremovePost(id: $id) {\n\t\t\tid\n\t\t\tcontent\n\t\t}\n\t}\n": types.DeletePostDocument,
    "\n\tmutation EditPost($editPostInput: EditPostInput!) {\n\t\teditPost(editPostInput: $editPostInput) {\n\t\t\tid\n\t\t\tcontent\n\t\t}\n\t}\n": types.EditPostDocument,
    "\n\tmutation Follow($id: String!) {\n\t\tfollow(id: $id) {\n\t\t\tid\n\t\t\tusername\n\t\t\tbio\n\t\t\temail\n\t\t\tfollowing\n\t\t\tfollowers\n\t\t\tis_following\n\t\t\tis_owner\n\t\t\tcreated_at\n\t\t\tprofile_picture\n\t\t}\n\t}\n": types.FollowDocument,
    "\n\tquery Posts($page: Int!, $userId: String, $categoryName: String) {\n\t\tposts(page: $page, user_id: $userId, category_name: $categoryName) {\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\ttotalEdges\n\t\t\t}\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tcontent\n\t\t\t\t\tuser_id\n\t\t\t\t\tcategory_name\n\t\t\t\t\tlikes\n\t\t\t\t\tcomments\n\t\t\t\t\tuser_liked\n\t\t\t\t\tuser_shared\n\t\t\t\t\tcreated_at\n\t\t\t\t\tupdated_at\n\t\t\t\t\tmedias {\n\t\t\t\t\t\tid\n\t\t\t\t\t\turl\n\t\t\t\t\t}\n\t\t\t\t\tuser {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tusername\n\t\t\t\t\t\tbio\n\t\t\t\t\t\temail\n\t\t\t\t\t\tis_owner\n\t\t\t\t\t\tcreated_at\n\t\t\t\t\t\tprofile_picture\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.PostsDocument,
    "\n\tmutation LikeComment($id: Int!) {\n\t\tlikeComment(id: $id) {\n\t\t\tid\n\t\t\tlikes\n\t\t}\n\t}\n": types.LikeCommentDocument,
    "\n\tmutation LikePost($id: Int!) {\n\t\tlikePost(id: $id) {\n\t\t\tid\n\t\t\tlikes\n\t\t}\n\t}\n": types.LikePostDocument,
    "\n\tquery PostShare($userId: String!) {\n\t\tpostShares(user_id: $userId) {\n\t\t\tsharer_id\n\t\t\tshare_content\n\t\t\tis_sharer\n\t\t\tshared_at\n\t\t\tpost {\n\t\t\t\tid\n\t\t\t\tcontent\n\t\t\t\tuser {\n\t\t\t\t\tid\n\t\t\t\t\tusername\n\t\t\t\t\tbio\n\t\t\t\t\temail\n\t\t\t\t\tfollowing\n\t\t\t\t\tfollowers\n\t\t\t\t\tis_following\n\t\t\t\t\tis_owner\n\t\t\t\t\tcreated_at\n\t\t\t\t\tprofile_picture\n\t\t\t\t}\n\t\t\t\tmedias {\n\t\t\t\t\tid\n\t\t\t\t\turl\n\t\t\t\t}\n\t\t\t\tlikes\n\t\t\t\tcomments\n\t\t\t\tcategory_name\n\t\t\t\tcreated_at\n\t\t\t\tuser_liked\n\t\t\t\tuser_shared\n\t\t\t}\n\t\t}\n\t}\n": types.PostShareDocument,
    "\n\tquery Post($id: Int!) {\n\t\tpost(id: $id) {\n\t\t\tid\n\t\t\tcontent\n\t\t\tuser {\n\t\t\t\tid\n\t\t\t\tusername\n\t\t\t\tbio\n\t\t\t\temail\n\t\t\t\tfollowing\n\t\t\t\tfollowers\n\t\t\t\tis_following\n\t\t\t\tis_owner\n\t\t\t\tcreated_at\n\t\t\t\tprofile_picture\n\t\t\t}\n\t\t\tmedias {\n\t\t\t\tid\n\t\t\t\turl\n\t\t\t}\n\t\t\tlikes\n\t\t\tcomments\n\t\t\tcategory_name\n\t\t\tcreated_at\n\t\t\tuser_liked\n\t\t\tuser_shared\n\t\t}\n\t}\n": types.PostDocument,
    "\n\tquery Search($query: String!) {\n\t\tsearch(query: $query) {\n\t\t\tid\n\t\t\tcontent\n\t\t\tuser {\n\t\t\t\tid\n\t\t\t\tusername\n\t\t\t\tbio\n\t\t\t\temail\n\t\t\t\tfollowing\n\t\t\t\tfollowers\n\t\t\t\tis_following\n\t\t\t\tis_owner\n\t\t\t\tcreated_at\n\t\t\t\tprofile_picture\n\t\t\t}\n\t\t\tmedias {\n\t\t\t\tid\n\t\t\t\turl\n\t\t\t}\n\t\t\tlikes\n\t\t\tcomments\n\t\t\tcategory_name\n\t\t\tcreated_at\n\t\t\tuser_id\n\t\t\tuser_liked\n\t\t\tuser_shared\n\t\t}\n\t}\n": types.SearchDocument,
    "\n\tmutation SharePost($sharePostInput: SharePostInput!) {\n\t\tsharePost(sharePostInput: $sharePostInput) {\n\t\t\tid\n\t\t}\n\t}\n": types.SharePostDocument,
    "\n\tmutation SignedUrl($signedUrlInput: SignedUrlInput!) {\n\t\tsignedUrl(signedUrlInput: $signedUrlInput) {\n\t\t\turl\n\t\t\tmediaId\n\t\t}\n\t}\n": types.SignedUrlDocument,
    "\n\tmutation Unfollow($id: String!) {\n\t\tunfollow(id: $id) {\n\t\t\tid\n\t\t\tusername\n\t\t\tbio\n\t\t\temail\n\t\t\tfollowing\n\t\t\tfollowers\n\t\t\tis_following\n\t\t\tis_owner\n\t\t\tcreated_at\n\t\t\tprofile_picture\n\t\t}\n\t}\n": types.UnfollowDocument,
    "\n\tmutation UnlikeComment($id: Int!) {\n\t\tunlikeComment(id: $id) {\n\t\t\tid\n\t\t\tlikes\n\t\t}\n\t}\n": types.UnlikeCommentDocument,
    "\n\tmutation UnlikePost($id: Int!) {\n\t\tunlikePost(id: $id) {\n\t\t\tid\n\t\t\tlikes\n\t\t}\n\t}\n": types.UnlikePostDocument,
    "\n\tquery User($id: String!) {\n\t\tuser(id: $id) {\n\t\t\tid\n\t\t\tusername\n\t\t\tbio\n\t\t\temail\n\t\t\tfollowing\n\t\t\tfollowers\n\t\t\tis_following\n\t\t\tis_owner\n\t\t\tcreated_at\n\t\t\tprofile_picture\n\t\t}\n\t}\n": types.UserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery Category {\n\t\tcategories {\n\t\t\tname\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery Category {\n\t\tcategories {\n\t\t\tname\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery Comments($postId: Int!) {\n\t\tcomments(post_id: $postId) {\n\t\t\tid\n\t\t\tcontent\n\t\t\tpost_id\n\t\t\tuser_liked\n\t\t\tlikes\n\t\t\tcreated_at\n\t\t\tupdated_at\n\t\t\tuser {\n\t\t\t\tid\n\t\t\t\tusername\n\t\t\t\tis_owner\n\t\t\t\tcreated_at\n\t\t\t\tprofile_picture\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery Comments($postId: Int!) {\n\t\tcomments(post_id: $postId) {\n\t\t\tid\n\t\t\tcontent\n\t\t\tpost_id\n\t\t\tuser_liked\n\t\t\tlikes\n\t\t\tcreated_at\n\t\t\tupdated_at\n\t\t\tuser {\n\t\t\t\tid\n\t\t\t\tusername\n\t\t\t\tis_owner\n\t\t\t\tcreated_at\n\t\t\t\tprofile_picture\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation CreatePost($createPostInput: CreatePostInput!) {\n\t\tcreatePost(createPostInput: $createPostInput) {\n\t\t\tid\n\t\t\tcontent\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation CreatePost($createPostInput: CreatePostInput!) {\n\t\tcreatePost(createPostInput: $createPostInput) {\n\t\t\tid\n\t\t\tcontent\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation DeleteMedia($id: String!) {\n\t\tremoveMedia(id: $id) {\n\t\t\tid\n\t\t\turl\n\t\t\tpost_id\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation DeleteMedia($id: String!) {\n\t\tremoveMedia(id: $id) {\n\t\t\tid\n\t\t\turl\n\t\t\tpost_id\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation DeletePost($id: Int!) {\n\t\tremovePost(id: $id) {\n\t\t\tid\n\t\t\tcontent\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation DeletePost($id: Int!) {\n\t\tremovePost(id: $id) {\n\t\t\tid\n\t\t\tcontent\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation EditPost($editPostInput: EditPostInput!) {\n\t\teditPost(editPostInput: $editPostInput) {\n\t\t\tid\n\t\t\tcontent\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation EditPost($editPostInput: EditPostInput!) {\n\t\teditPost(editPostInput: $editPostInput) {\n\t\t\tid\n\t\t\tcontent\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation Follow($id: String!) {\n\t\tfollow(id: $id) {\n\t\t\tid\n\t\t\tusername\n\t\t\tbio\n\t\t\temail\n\t\t\tfollowing\n\t\t\tfollowers\n\t\t\tis_following\n\t\t\tis_owner\n\t\t\tcreated_at\n\t\t\tprofile_picture\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation Follow($id: String!) {\n\t\tfollow(id: $id) {\n\t\t\tid\n\t\t\tusername\n\t\t\tbio\n\t\t\temail\n\t\t\tfollowing\n\t\t\tfollowers\n\t\t\tis_following\n\t\t\tis_owner\n\t\t\tcreated_at\n\t\t\tprofile_picture\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery Posts($page: Int!, $userId: String, $categoryName: String) {\n\t\tposts(page: $page, user_id: $userId, category_name: $categoryName) {\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\ttotalEdges\n\t\t\t}\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tcontent\n\t\t\t\t\tuser_id\n\t\t\t\t\tcategory_name\n\t\t\t\t\tlikes\n\t\t\t\t\tcomments\n\t\t\t\t\tuser_liked\n\t\t\t\t\tuser_shared\n\t\t\t\t\tcreated_at\n\t\t\t\t\tupdated_at\n\t\t\t\t\tmedias {\n\t\t\t\t\t\tid\n\t\t\t\t\t\turl\n\t\t\t\t\t}\n\t\t\t\t\tuser {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tusername\n\t\t\t\t\t\tbio\n\t\t\t\t\t\temail\n\t\t\t\t\t\tis_owner\n\t\t\t\t\t\tcreated_at\n\t\t\t\t\t\tprofile_picture\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery Posts($page: Int!, $userId: String, $categoryName: String) {\n\t\tposts(page: $page, user_id: $userId, category_name: $categoryName) {\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\ttotalEdges\n\t\t\t}\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tcontent\n\t\t\t\t\tuser_id\n\t\t\t\t\tcategory_name\n\t\t\t\t\tlikes\n\t\t\t\t\tcomments\n\t\t\t\t\tuser_liked\n\t\t\t\t\tuser_shared\n\t\t\t\t\tcreated_at\n\t\t\t\t\tupdated_at\n\t\t\t\t\tmedias {\n\t\t\t\t\t\tid\n\t\t\t\t\t\turl\n\t\t\t\t\t}\n\t\t\t\t\tuser {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tusername\n\t\t\t\t\t\tbio\n\t\t\t\t\t\temail\n\t\t\t\t\t\tis_owner\n\t\t\t\t\t\tcreated_at\n\t\t\t\t\t\tprofile_picture\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation LikeComment($id: Int!) {\n\t\tlikeComment(id: $id) {\n\t\t\tid\n\t\t\tlikes\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation LikeComment($id: Int!) {\n\t\tlikeComment(id: $id) {\n\t\t\tid\n\t\t\tlikes\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation LikePost($id: Int!) {\n\t\tlikePost(id: $id) {\n\t\t\tid\n\t\t\tlikes\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation LikePost($id: Int!) {\n\t\tlikePost(id: $id) {\n\t\t\tid\n\t\t\tlikes\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery PostShare($userId: String!) {\n\t\tpostShares(user_id: $userId) {\n\t\t\tsharer_id\n\t\t\tshare_content\n\t\t\tis_sharer\n\t\t\tshared_at\n\t\t\tpost {\n\t\t\t\tid\n\t\t\t\tcontent\n\t\t\t\tuser {\n\t\t\t\t\tid\n\t\t\t\t\tusername\n\t\t\t\t\tbio\n\t\t\t\t\temail\n\t\t\t\t\tfollowing\n\t\t\t\t\tfollowers\n\t\t\t\t\tis_following\n\t\t\t\t\tis_owner\n\t\t\t\t\tcreated_at\n\t\t\t\t\tprofile_picture\n\t\t\t\t}\n\t\t\t\tmedias {\n\t\t\t\t\tid\n\t\t\t\t\turl\n\t\t\t\t}\n\t\t\t\tlikes\n\t\t\t\tcomments\n\t\t\t\tcategory_name\n\t\t\t\tcreated_at\n\t\t\t\tuser_liked\n\t\t\t\tuser_shared\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery PostShare($userId: String!) {\n\t\tpostShares(user_id: $userId) {\n\t\t\tsharer_id\n\t\t\tshare_content\n\t\t\tis_sharer\n\t\t\tshared_at\n\t\t\tpost {\n\t\t\t\tid\n\t\t\t\tcontent\n\t\t\t\tuser {\n\t\t\t\t\tid\n\t\t\t\t\tusername\n\t\t\t\t\tbio\n\t\t\t\t\temail\n\t\t\t\t\tfollowing\n\t\t\t\t\tfollowers\n\t\t\t\t\tis_following\n\t\t\t\t\tis_owner\n\t\t\t\t\tcreated_at\n\t\t\t\t\tprofile_picture\n\t\t\t\t}\n\t\t\t\tmedias {\n\t\t\t\t\tid\n\t\t\t\t\turl\n\t\t\t\t}\n\t\t\t\tlikes\n\t\t\t\tcomments\n\t\t\t\tcategory_name\n\t\t\t\tcreated_at\n\t\t\t\tuser_liked\n\t\t\t\tuser_shared\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery Post($id: Int!) {\n\t\tpost(id: $id) {\n\t\t\tid\n\t\t\tcontent\n\t\t\tuser {\n\t\t\t\tid\n\t\t\t\tusername\n\t\t\t\tbio\n\t\t\t\temail\n\t\t\t\tfollowing\n\t\t\t\tfollowers\n\t\t\t\tis_following\n\t\t\t\tis_owner\n\t\t\t\tcreated_at\n\t\t\t\tprofile_picture\n\t\t\t}\n\t\t\tmedias {\n\t\t\t\tid\n\t\t\t\turl\n\t\t\t}\n\t\t\tlikes\n\t\t\tcomments\n\t\t\tcategory_name\n\t\t\tcreated_at\n\t\t\tuser_liked\n\t\t\tuser_shared\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery Post($id: Int!) {\n\t\tpost(id: $id) {\n\t\t\tid\n\t\t\tcontent\n\t\t\tuser {\n\t\t\t\tid\n\t\t\t\tusername\n\t\t\t\tbio\n\t\t\t\temail\n\t\t\t\tfollowing\n\t\t\t\tfollowers\n\t\t\t\tis_following\n\t\t\t\tis_owner\n\t\t\t\tcreated_at\n\t\t\t\tprofile_picture\n\t\t\t}\n\t\t\tmedias {\n\t\t\t\tid\n\t\t\t\turl\n\t\t\t}\n\t\t\tlikes\n\t\t\tcomments\n\t\t\tcategory_name\n\t\t\tcreated_at\n\t\t\tuser_liked\n\t\t\tuser_shared\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery Search($query: String!) {\n\t\tsearch(query: $query) {\n\t\t\tid\n\t\t\tcontent\n\t\t\tuser {\n\t\t\t\tid\n\t\t\t\tusername\n\t\t\t\tbio\n\t\t\t\temail\n\t\t\t\tfollowing\n\t\t\t\tfollowers\n\t\t\t\tis_following\n\t\t\t\tis_owner\n\t\t\t\tcreated_at\n\t\t\t\tprofile_picture\n\t\t\t}\n\t\t\tmedias {\n\t\t\t\tid\n\t\t\t\turl\n\t\t\t}\n\t\t\tlikes\n\t\t\tcomments\n\t\t\tcategory_name\n\t\t\tcreated_at\n\t\t\tuser_id\n\t\t\tuser_liked\n\t\t\tuser_shared\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery Search($query: String!) {\n\t\tsearch(query: $query) {\n\t\t\tid\n\t\t\tcontent\n\t\t\tuser {\n\t\t\t\tid\n\t\t\t\tusername\n\t\t\t\tbio\n\t\t\t\temail\n\t\t\t\tfollowing\n\t\t\t\tfollowers\n\t\t\t\tis_following\n\t\t\t\tis_owner\n\t\t\t\tcreated_at\n\t\t\t\tprofile_picture\n\t\t\t}\n\t\t\tmedias {\n\t\t\t\tid\n\t\t\t\turl\n\t\t\t}\n\t\t\tlikes\n\t\t\tcomments\n\t\t\tcategory_name\n\t\t\tcreated_at\n\t\t\tuser_id\n\t\t\tuser_liked\n\t\t\tuser_shared\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation SharePost($sharePostInput: SharePostInput!) {\n\t\tsharePost(sharePostInput: $sharePostInput) {\n\t\t\tid\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation SharePost($sharePostInput: SharePostInput!) {\n\t\tsharePost(sharePostInput: $sharePostInput) {\n\t\t\tid\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation SignedUrl($signedUrlInput: SignedUrlInput!) {\n\t\tsignedUrl(signedUrlInput: $signedUrlInput) {\n\t\t\turl\n\t\t\tmediaId\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation SignedUrl($signedUrlInput: SignedUrlInput!) {\n\t\tsignedUrl(signedUrlInput: $signedUrlInput) {\n\t\t\turl\n\t\t\tmediaId\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation Unfollow($id: String!) {\n\t\tunfollow(id: $id) {\n\t\t\tid\n\t\t\tusername\n\t\t\tbio\n\t\t\temail\n\t\t\tfollowing\n\t\t\tfollowers\n\t\t\tis_following\n\t\t\tis_owner\n\t\t\tcreated_at\n\t\t\tprofile_picture\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation Unfollow($id: String!) {\n\t\tunfollow(id: $id) {\n\t\t\tid\n\t\t\tusername\n\t\t\tbio\n\t\t\temail\n\t\t\tfollowing\n\t\t\tfollowers\n\t\t\tis_following\n\t\t\tis_owner\n\t\t\tcreated_at\n\t\t\tprofile_picture\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation UnlikeComment($id: Int!) {\n\t\tunlikeComment(id: $id) {\n\t\t\tid\n\t\t\tlikes\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation UnlikeComment($id: Int!) {\n\t\tunlikeComment(id: $id) {\n\t\t\tid\n\t\t\tlikes\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation UnlikePost($id: Int!) {\n\t\tunlikePost(id: $id) {\n\t\t\tid\n\t\t\tlikes\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation UnlikePost($id: Int!) {\n\t\tunlikePost(id: $id) {\n\t\t\tid\n\t\t\tlikes\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery User($id: String!) {\n\t\tuser(id: $id) {\n\t\t\tid\n\t\t\tusername\n\t\t\tbio\n\t\t\temail\n\t\t\tfollowing\n\t\t\tfollowers\n\t\t\tis_following\n\t\t\tis_owner\n\t\t\tcreated_at\n\t\t\tprofile_picture\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery User($id: String!) {\n\t\tuser(id: $id) {\n\t\t\tid\n\t\t\tusername\n\t\t\tbio\n\t\t\temail\n\t\t\tfollowing\n\t\t\tfollowers\n\t\t\tis_following\n\t\t\tis_owner\n\t\t\tcreated_at\n\t\t\tprofile_picture\n\t\t}\n\t}\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;