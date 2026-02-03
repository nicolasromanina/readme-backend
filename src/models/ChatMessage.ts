import { Schema, model, Document } from 'mongoose';

export interface IChatMessage extends Document {
  role: 'user' | 'assistant' | 'system';
  content: string;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IChatMessage>('ChatMessage', ChatMessageSchema);