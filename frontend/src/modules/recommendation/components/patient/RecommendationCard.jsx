import { UserRound } from "lucide-react";

import { getRecommendationConfig } from "@/modules/recommendation/utils";
import {
  RecommendationAction,
  RecommendationCard as Card,
  RecommendationHeader,
  RecommendationItem,
} from "@/modules/recommendation/components/common";

export default function RecommendationCard({ recommendation }) {
  const config = getRecommendationConfig(recommendation.service);
  const items = recommendation.items || [];

  return (
    <Card>
      <RecommendationHeader
        icon={config.icon}
        title={config.title}
        date={recommendation.createdAt}
        priority={recommendation.priority}
        status={recommendation.status}
      />

      {recommendation.clinicalReason && (
        <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 p-3">
          <p className="text-[10px] font-black uppercase text-slate-500">
            Reason
          </p>
          <p className="mt-1 text-sm font-bold text-slate-800">
            {recommendation.clinicalReason}
          </p>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-3 space-y-2">
          {items.map((item) => (
            <RecommendationItem key={item.id || item.name} item={item} />
          ))}
        </div>
      )}

      {recommendation.notes && (
        <div className="mt-3 rounded-2xl bg-cyan-50 border border-cyan-100 p-3">
          <p className="text-[10px] font-black uppercase text-cyan-700">
            Doctor Notes
          </p>
          <p className="mt-1 text-sm font-bold text-cyan-900">
            {recommendation.notes}
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-600">
          <UserRound size={13} />
          {recommendation.status || "RECOMMENDED"}
        </span>

        <RecommendationAction to={config.route} label={config.action} />
      </div>
    </Card>
  );
}