export default function MenuLoading() {
return ( <div className="mx-auto max-w-7xl animate-pulse px-4 py-8">
{/* Heading */} <div className="mb-8"> <div className="h-8 w-40 rounded-lg bg-gray-200" /> <div className="mt-3 h-4 w-64 rounded bg-gray-200" /> </div>

```
  {/* Category placeholders */}
  <div className="mb-8 flex gap-3 overflow-hidden">
    {[1, 2, 3, 4, 5].map((item) => (
      <div
        key={item}
        className="h-10 w-24 shrink-0 rounded-full bg-gray-200"
      />
    ))}
  </div>

  {/* Dish cards */}
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-3"
      >
        {/* Image */}
        <div className="h-44 rounded-xl bg-gray-200" />

        {/* Dish name */}
        <div className="mt-4 h-5 w-3/4 rounded bg-gray-200" />

        {/* Description */}
        <div className="mt-3 h-3 w-full rounded bg-gray-200" />
        <div className="mt-2 h-3 w-2/3 rounded bg-gray-200" />

        {/* Price and button */}
        <div className="mt-5 flex items-center justify-between">
          <div className="h-6 w-20 rounded bg-gray-200" />
          <div className="h-9 w-24 rounded-lg bg-gray-200" />
        </div>
      </div>
    ))}
  </div>
</div>


);
}
