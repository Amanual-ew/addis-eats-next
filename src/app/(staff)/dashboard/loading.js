const shimmer = "animate-pulse rounded-md bg-gray-200";

export default function Loading() {
  return (
    <main aria-busy="true" aria-live="polite" className="space-y-8 p-6">
      <div className={`${shimmer} h-8 w-1/3`} />

      <div className="space-y-2">
        <div className={`${shimmer} h-4 w-1/4`} />
        <div className={`${shimmer} h-4 w-1/5`} />
      </div>

      <div className={`${shimmer} h-[300px] w-full`} />
      <div className={`${shimmer} h-[300px] w-full`} />

      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`${shimmer} h-8 w-full`} />
        ))}
      </div>
    </main>
  );
}