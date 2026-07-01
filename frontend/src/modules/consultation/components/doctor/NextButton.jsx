export default function NextButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 h-11 w-full rounded-2xl bg-slate-950 text-xs font-black text-white"
    >
      Next
    </button>
  );
}