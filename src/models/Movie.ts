import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  slug: string;
  posterUrl: string;
  imdbRating: number;
  description: string;
  screenshots: string[];
  downloadButtons: {
    text: string;
    link: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    posterUrl: { type: String, required: true },
    imdbRating: { type: Number, required: true },
    description: { type: String, required: true },
    screenshots: [{ type: String }],
    downloadButtons: [
      {
        text: { type: String, required: true },
        link: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);
