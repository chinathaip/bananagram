export class Comment {
	id: number;
	content: string;
	post_id: number;
	user_id: string;
	created_at: Date;
	updated_at?: Date;
}
