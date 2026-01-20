import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendation extends Document {
  movieName: string;
  email?: string;
  status: 'pending' | 'added';
  createdAt: Date;
}

const RecommendationSchema: Schema = new Schema(
  {
    movieName: { type: String, required: true },
    email: { type: String },
    status: { type: String, enum: ['pending', 'added'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.models.Recommendation || mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
