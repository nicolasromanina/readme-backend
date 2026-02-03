import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  pseudo: string;
  mood?: string;
  email?: string;
  password?: string;
}

const UserSchema = new Schema<IUser>({
  pseudo: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
  },
  email: {
    type: String,
    index: true,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
  },
});

export default model<IUser>('User', UserSchema);
