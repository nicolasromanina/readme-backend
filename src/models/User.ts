import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  pseudo: string;
  mood?: string;
  email?: string;
  password?: string;
  gender?: 'homme' | 'femme';
  hair?: number;
  style?: number;
  traits?: string[];
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
  gender: {
    type: String,
    enum: ['homme', 'femme'],
  },
  hair: {
    type: Number,
  },
  style: {
    type: Number,
  },
  traits: {
    type: [String],
  },
});

export default model<IUser>('User', UserSchema);
