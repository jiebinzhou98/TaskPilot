// app/loading.tsx

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 text-gray-800">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#00b894]" />
      <p className="ml-4 text-lg font-semibold">Loading TaskPilot...</p>
    </div>
  );
}
