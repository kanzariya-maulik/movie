'use client';

import MovieForm from "@/components/MovieForm";
import { useParams } from "next/navigation";

export default function EditMoviePage() {
  const { id } = useParams();
  
  return <MovieForm id={id as string} />;
}
