import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  type: 'movie_added' | 'movie_updated';
  message: string;
  link: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    type: { type: String, enum: ['movie_added', 'movie_updated'], required: true },
    message: { type: String, required: true },
    link: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
