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
    "\n\tquery Posts($page: Int!) {\n\t\tposts(page: $page) {\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t\tstartCursor\n\t\t\t\tendCursor\n\t\t\t\ttotalEdges\n\t\t\t}\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tcontent\n\t\t\t\t\tuser_id\n\t\t\t\t\tcategory_id\n\t\t\t\t\tcreated_at\n\t\t\t\t\tupdated_at\n\t\t\t\t\tuser {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tusername\n\t\t\t\t\t\temail\n\t\t\t\t\t\tbio\n\t\t\t\t\t\tdisplay_name\n\t\t\t\t\t\tprofile_picture\n\t\t\t\t\t\tcreated_at\n\t\t\t\t\t}\n\t\t\t\t\tcategory {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.PostsDocument,
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
export function graphql(source: "\n\tquery Posts($page: Int!) {\n\t\tposts(page: $page) {\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t\tstartCursor\n\t\t\t\tendCursor\n\t\t\t\ttotalEdges\n\t\t\t}\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tcontent\n\t\t\t\t\tuser_id\n\t\t\t\t\tcategory_id\n\t\t\t\t\tcreated_at\n\t\t\t\t\tupdated_at\n\t\t\t\t\tuser {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tusername\n\t\t\t\t\t\temail\n\t\t\t\t\t\tbio\n\t\t\t\t\t\tdisplay_name\n\t\t\t\t\t\tprofile_picture\n\t\t\t\t\t\tcreated_at\n\t\t\t\t\t}\n\t\t\t\t\tcategory {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery Posts($page: Int!) {\n\t\tposts(page: $page) {\n\t\t\tpageInfo {\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t\tstartCursor\n\t\t\t\tendCursor\n\t\t\t\ttotalEdges\n\t\t\t}\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\tcontent\n\t\t\t\t\tuser_id\n\t\t\t\t\tcategory_id\n\t\t\t\t\tcreated_at\n\t\t\t\t\tupdated_at\n\t\t\t\t\tuser {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tusername\n\t\t\t\t\t\temail\n\t\t\t\t\t\tbio\n\t\t\t\t\t\tdisplay_name\n\t\t\t\t\t\tprofile_picture\n\t\t\t\t\t\tcreated_at\n\t\t\t\t\t}\n\t\t\t\t\tcategory {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;