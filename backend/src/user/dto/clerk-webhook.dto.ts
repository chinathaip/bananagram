export class ClerkUserWebhook {
	data: ClerkUserPayload;
	type: ClerkUserEventType;
}

export enum ClerkUserEventType {
	Created = "user.created",
	Updated = "user.updated",
	Deleted = "user.deleted"
}

export class ClerkUserPayload {
	id: string;
	username: string;
	public_metadata: { bio: string; display_name: string };
	profile_image_url: string;
	email_addresses: { email_address: string }[];
	created_at: Date;
	updated_at: Date;
}
