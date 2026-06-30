import { Send } from "lucide-react";

export default function ReviewSheet({
  appointment,
  reviewForm,
  setReviewForm,
  onSubmit,
  onClose,
}) {
  if (!appointment) return null;

  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-slate-100 bg-white p-4"
    >
      <h3 className="text-base font-black text-slate-950">
        Write a Review
      </h3>

      <div className="space-y-3 mt-3">
        <select
          value={reviewForm.rating}
          onChange={(e) =>
            setReviewForm({
              ...reviewForm,
              rating: e.target.value,
            })
          }
          className="w-full border border-slate-200 bg-slate-50 rounded-2xl p-3 outline-none text-sm font-bold"
        >
          <option value={5}>⭐⭐⭐⭐⭐ 5</option>
          <option value={4}>⭐⭐⭐⭐ 4</option>
          <option value={3}>⭐⭐⭐ 3</option>
          <option value={2}>⭐⭐ 2</option>
          <option value={1}>⭐ 1</option>
        </select>

        <input
          value={reviewForm.comment}
          onChange={(e) =>
            setReviewForm({
              ...reviewForm,
              comment: e.target.value,
            })
          }
          placeholder="Write your feedback"
          className="w-full border border-slate-200 bg-slate-50 rounded-2xl p-3 outline-none text-sm"
        />
      </div>

      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 text-white px-4 py-3 rounded-xl font-black text-xs"
        >
          <Send size={15} />
          Submit
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-slate-300 px-4 py-3 rounded-xl font-black text-xs"
        >
          Close
        </button>
      </div>
    </form>
  );
}