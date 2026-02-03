import { Schema, model, Document } from 'mongoose';

export interface IIdea extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  description?: string;
  tags?: string[];
  status: 'open' | 'done';
  createdAt: Date;
  updatedAt: Date;
}

const IdeaSchema = new Schema<IIdea>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ['open', 'done'], default: 'open' },
}, { timestamps: true });

export default model<IIdea>('Idea', IdeaSchema);
