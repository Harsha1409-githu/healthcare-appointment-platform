import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { buildCarePlan } from "@/modules/my-care/utils";
import { myCareService } from "@/modules/my-care/services";

export function useMyCare() {
  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [labOrders, setLabOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const fetchMyCare = useCallback(async () => {
    if (!patient?.id) return;

    try {
      setLoading(true);

      const [medicineData, recommendationData, labOrderData, appointmentData, prescriptionData] =
        await Promise.all([
          myCareService.getMedicineReminders(patient.id),
          myCareService.getRecommendations(patient.id),
          myCareService.getLabOrders(patient.id),
          myCareService.getAppointments(),
          myCareService.getPrescriptions(),
        ]);

      setMedicines(medicineData);
      setRecommendations(recommendationData);
      setLabOrders(labOrderData);
      setAppointments(appointmentData);
      setPrescriptions(prescriptionData);
    } catch (error) {
      console.error("My Care load error:", error);
      toast.error("Unable to load My Care");
    } finally {
      setLoading(false);
    }
  }, [patient?.id]);

  useEffect(() => {
    fetchMyCare();
  }, [fetchMyCare]);

  const stats = useMemo(() => {
    const pendingRecommendations = recommendations.filter(
      (item) => item.status === "RECOMMENDED"
    ).length;

    const activeMedicines = medicines.filter((item) => item.isActive).length;

    const upcomingAppointments = appointments.filter(
      (item) => item.status === "BOOKED"
    ).length;

    return {
      activeMedicines,
      pendingRecommendations,
      upcomingAppointments,
      labOrders: labOrders.length,
      prescriptions: prescriptions.length,
      totalActions: activeMedicines + pendingRecommendations + upcomingAppointments,
    };
  }, [medicines, recommendations, appointments, labOrders, prescriptions]);

  const carePlan = useMemo(
  () =>
    buildCarePlan({
      medicines,
      recommendations,
      labOrders,
      appointments,
      prescriptions,
    }),
  [medicines, recommendations, labOrders, appointments, prescriptions]
);

  return {
    patient,
    loading,
    carePlan,
    medicines,
    recommendations,
    labOrders,
    appointments,
    prescriptions,

    stats,
    fetchMyCare,
  };
}
