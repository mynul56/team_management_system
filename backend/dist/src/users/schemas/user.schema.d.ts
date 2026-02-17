import { Document } from 'mongoose';
import { UserRole, Position, Seniority } from '../../common/enums';
export declare class User extends Document {
    email: string;
    passwordHash: string;
    name: string;
    role: UserRole;
    position: Position;
    seniority: Seniority;
    isActive: boolean;
    emailVerified: boolean;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<User> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
