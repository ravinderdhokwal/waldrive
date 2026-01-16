interface IUser {
    id: string;
    verified: boolean;
}

declare namespace Express {
    export interface Request {
        user?: IUser;
    }
}