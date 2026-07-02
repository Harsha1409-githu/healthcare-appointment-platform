import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { recommendationService } from "@/modules/recommendation/services";

export function usePatientRecommendations() {
  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const selectedProfile = JSON.parse(
    localStorage.getItem("selectedProfile") || "null"
  );

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("ALL");

  const fetchRecommendations = useCallback(async () => {
    if (!patient?.id) return;

    try {
      setLoading(true);
      const data = await recommendationService.getPatientRecommendations(patient.id);
      setRecommendations(data || []);
    } catch (error) {
      console.error("Recommendation load error:", error);
      toast.error("Unable to load doctor recommendations");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [patient?.id]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((item) => {
      const matchesType = typeFilter === "ALL" || item.service === typeFilter;
      return matchesType;
    });
  }, [recommendations, typeFilter]);

  const stats = useMemo(
    () => ({
      total: recommendations.length,
      lab: recommendations.filter((item) => item.service === "LAB_TEST").length,
      pending: recommendations.filter((item) => item.status === "RECOMMENDED").length,
    }),
    [recommendations]
  );

  return {
    patient,
    selectedProfile,

    recommendations,
    filteredRecommendations,
    loading,

    typeFilter,
    setTypeFilter,

    stats,
    fetchRecommendations,
  };
}
