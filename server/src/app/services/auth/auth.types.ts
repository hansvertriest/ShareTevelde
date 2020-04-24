export enum Role {
	Admin = 'administrator',
	User = 'user',
}

export interface IVerifiedToken {
	verified: boolean;
	id: string | undefined;
	role: string;
	error?: {
		msg: string;
	}
	unknownError?: any;
}