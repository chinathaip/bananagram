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
	username: string | null;
	public_metadata: { bio: string };
	profile_image_url: string | null;
	email_addresses: { email_address: string }[];
	created_at: Date;
	updated_at: Date | null;
}
