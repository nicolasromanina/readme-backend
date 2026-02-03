import { Schema, model, Document } from 'mongoose';

export interface IMood extends Document {
  userId: Schema.Types.ObjectId;
  level: number; // 1-5
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MoodSchema = new Schema<IMood>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    level: { type: Number, required: true, min: 1, max: 5 },
    notes: { type: String },
  },
  { timestamps: true }
);

export default model<IMood>('Mood', MoodSchema);
