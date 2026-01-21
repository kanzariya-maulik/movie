import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendation extends Document {
  movieName: string;
  ip?: string;
  userId?: string;
  movieSlug?: string;
  status: 'pending' | 'added' | 'notified';
  createdAt: Date;
}

const RecommendationSchema: Schema = new Schema(
  {
    movieName: { type: String, required: true },
    ip: { type: String },
    userId: { type: String },
    movieSlug: { type: String },
    status: { type: String, enum: ['pending', 'added', 'notified'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.models.Recommendation || mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
