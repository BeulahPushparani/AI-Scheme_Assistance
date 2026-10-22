export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="h-10 w-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}