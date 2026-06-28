import { useEffect, useMemo, useState } from "react";
import {
  Star,
  MessageSquareText,
  UserRound,
  Loader2,
  RefreshCw,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import api from "../api/axios";

export default function DoctorReviews() {
  const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    totalReviews: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      if (!doctor?.id) return;

      const [reviewsRes, summaryRes] = await Promise.all([
        api.get(`/review/doctor/${doctor.id}`),
        api.get(`/review/doctor/${doctor.id}/summary`),
      ]);

      setReviews(reviewsRes.data || []);
      setSummary(
        summaryRes.data || {
          totalReviews: 0,
          averageRating: 0,
        }
      );
    } catch (error) {
      console.error("Doctor reviews error:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const breakdown = useMemo(() => {
    return [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter(
        (item) => Number(item.rating) === rating
      ).length;

      const percent = reviews.length
        ? Math.round((count / reviews.length) * 100)
        : 0;

      return {
        rating,
        count,
        percent,
      };
    });
  }, [reviews]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
          <Loader2 className="text-cyan-600 animate-spin mx-auto mb-3" size={36} />
          <p className="text-slate-500 font-bold">Loading reviews...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      <PageHeader
        title="Reviews"
        subtitle={`${summary.totalReviews || 0} patient reviews`}
      />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-slate-950 rounded-3xl p-5 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-cyan-200 text-xs font-black">
                PATIENT RATING
              </p>

              <h1 className="text-5xl font-black mt-2">
                {summary.averageRating
                  ? Number(summary.averageRating).toFixed(1)
                  : "0.0"}
              </h1>

              <p className="text-sm text-slate-300 mt-1">
                Based on {summary.totalReviews || 0} reviews
              </p>
            </div>

            <button
              type="button"
              onClick={fetchReviews}
              className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center"
            >
              <RefreshCw size={21} />
            </button>
          </div>

          <div className="flex gap-1 mt-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star
                key={item}
                size={22}
                className={
                  item <= Math.round(Number(summary.averageRating || 0))
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-slate-600"
                }
              />
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <h2 className="text-lg font-black text-slate-950 mb-4">
            Rating Breakdown
          </h2>

          <div className="space-y-3">
            {breakdown.map((item) => (
              <div key={item.rating} className="flex items-center gap-3">
                <div className="w-10 text-sm font-black text-slate-700 flex items-center gap-1">
                  {item.rating}
                  <Star size={13} className="text-yellow-500 fill-yellow-500" />
                </div>

                <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-600"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>

                <span className="w-8 text-right text-xs font-black text-slate-500">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-3 space-y-3">
          {reviews.length === 0 ? (
            <EmptyState />
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </section>
      </div>
    </main>
  );
}

function ReviewCard({ review }) {
  const patientName =
    review.patient?.fullName || review.patientName || "Patient";

  const dateLabel = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Review date";

  return (
    <article className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
          <UserRound className="text-cyan-600" size={24} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-black text-slate-950 truncate">
                {patientName}
              </h3>

              <p className="text-xs text-slate-500">
                {dateLabel}
              </p>
            </div>

            <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-black">
              <Star size={13} className="fill-yellow-500 text-yellow-500" />
              {review.rating || 0}
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mt-3">
            {review.comment || review.review || "No comment added."}
          </p>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
      <MessageSquareText className="text-cyan-600 mx-auto mb-3" size={36} />

      <h3 className="text-lg font-black text-slate-950">
        No reviews yet
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Patient reviews will appear here after consultations.
      </p>
    </div>
  );
}