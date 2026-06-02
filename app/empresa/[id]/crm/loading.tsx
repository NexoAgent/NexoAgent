export default function CRMLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-24 bg-gray-200 rounded mb-2" />
      <div className="h-5 w-64 bg-gray-200 rounded mb-8" />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div>
          <div className="h-80 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
