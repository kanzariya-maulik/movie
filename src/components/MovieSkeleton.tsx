export default function MovieSkeleton() {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-gray-800 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-700" />
        <div className="h-3 w-1/4 rounded bg-gray-700" />
      </div>
    </div>
  );
}
