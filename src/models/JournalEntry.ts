import { Schema, model, Document } from 'mongoose';

export interface IJournalEntry extends Document {
  userId: Schema.Types.ObjectId;
  title?: string;
  content: string;
  mood?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JournalEntrySchema = new Schema<IJournalEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  content: { type: String, required: true },
  mood: { type: String },
}, { timestamps: true });

export default model<IJournalEntry>('JournalEntry', JournalEntrySchema);
