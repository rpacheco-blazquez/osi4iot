export interface LoginData {
	emailOrLogin: string;
	password: string;
}

export interface AuthDispatch {
	(arg0: { type: string; payload?: any; error?: any }): void;
}

export interface AuthContextProps {
	userName: string;
	accessToken: string;
	refreshToken: string;
	expirationDate: string;
	userRole: string;
	numOrganizationManaged: number;
	numGroupsManaged: number; 
	numDevicesManage: number;
	loading: boolean;
	errorMessage: string | null;
}

export interface AuthActionPayload {
	userName: string;
	accessToken: string;
	refreshToken: string;
	userRole: string;
	numOrganizationManaged: number;
	numGroupsManaged: number; 
	numDevicesManage: number;
}

export interface AuthAction {
	type: string;
	payload: AuthActionPayload;
	error: string;
}