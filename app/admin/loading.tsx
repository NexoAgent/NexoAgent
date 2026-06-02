export default function AdminLoading() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-8 animate-pulse">
      <div className="h-10 w-64 bg-gray-200 rounded mb-8" />
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
