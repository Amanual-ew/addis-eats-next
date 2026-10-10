export default function OrdersLoading() {
return ( <div className="mx-auto max-w-5xl animate-pulse px-4 py-8">
{/* Heading */} <div className="mb-8"> <div className="h-8 w-48 rounded-lg bg-gray-200" /> <div className="mt-3 h-4 w-64 rounded bg-gray-200" /> </div>

```
  {/* Order cards */}
  <div className="space-y-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="rounded-2xl border border-gray-200 bg-white p-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Order information */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-200" />

            <div className="flex-1 space-y-3">
              <div className="h-5 w-36 rounded bg-gray-200" />
              <div className="h-3 w-48 max-w-full rounded bg-gray-200" />
              <div className="h-3 w-28 rounded bg-gray-200" />
            </div>
          </div>

          {/* Status and price */}
          <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
            <div className="h-7 w-24 rounded-full bg-gray-200" />
            <div className="h-5 w-20 rounded bg-gray-200" />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-gray-100 pt-4">
          <div className="h-9 w-full rounded-lg bg-gray-200 sm:w-32" />
        </div>
      </div>
    ))}
  </div>
</div>


);
}
