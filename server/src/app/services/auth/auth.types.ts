export enum Role {
	Admin = 'administrator',
	User = 'user',
}

export interface IVerifiedToken {
	verified: boolean;
	id: string | undefined;
	error?: {
		msg: string;
	}
	unknownError?: any;
}