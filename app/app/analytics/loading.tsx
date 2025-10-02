export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-muted rounded mb-2" />
        <div className="h-4 w-96 bg-muted rounded" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="h-4 w-24 bg-muted rounded mb-4" />
            <div className="h-8 w-20 bg-muted rounded mb-2" />
            <div className="h-3 w-28 bg-muted rounded" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 border rounded-lg h-[340px]">
            <div className="h-4 w-32 bg-muted rounded mb-2" />
            <div className="h-3 w-40 bg-muted rounded mb-4" />
            <div className="h-full w-full bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
