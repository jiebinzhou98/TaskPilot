export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#f5f5f5] flex flex-col justify-center items-center z-[9999]">
      <div className="w-12 h-12 border-4 border-t-orange-400 border-gray-300 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-700 text-sm font-medium">Loading TaskPilot...</p>
    </div>
  );
}
