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
  genres: string[];
  releaseYear?: number;
  quality?: string;
  cast?: string[];
  languages?: string[];
  size?: string;
  resolution?: string;
  audio?: string;
  series?: string;
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
    genres: [{ type: String }],
    releaseYear: { type: Number },
    quality: { type: String, default: 'HD' },
    cast: [{ type: String }],
    languages: [{ type: String }],
    size: { type: String },
    resolution: { type: String },
    audio: { type: String },
    series: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);
