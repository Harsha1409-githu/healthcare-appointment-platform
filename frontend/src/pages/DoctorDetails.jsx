import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    api.get(`/doctor/${id}`).then((res) => setDoctor(res.data));
  }, [id]);

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{doctor.doctorName}</h1>
      <p>{doctor.specialization}</p>
      <p>Experience: {doctor.experience} years</p>
      <p>Fee: ₹{doctor.consultationFee}</p>
    </div>
  );
}