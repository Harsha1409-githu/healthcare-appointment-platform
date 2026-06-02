import {
  HeartPulse,
  Brain,
  Baby,
  Eye,
  Bone,
  Stethoscope,
} from "lucide-react";

export default function Specialties() {

  const items = [
    { name: "Cardiology", icon: HeartPulse },
    { name: "Neurology", icon: Brain },
    { name: "Pediatrics", icon: Baby },
    { name: "Ophthalmology", icon: Eye },
    { name: "Orthopedics", icon: Bone },
    { name: "General", icon: Stethoscope },
  ];

  return (
    <section className="bg-gray-50 py-16">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-10">
          Popular Specialties
        </h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.name}
                className="
                  bg-white
                  rounded-xl
                  shadow
                  p-6
                  text-center
                  hover:shadow-lg
                  cursor-pointer
                "
              >
                <Icon
                  className="mx-auto text-blue-600"
                  size={36}
                />

                <p className="mt-4 font-medium">
                  {item.name}
                </p>
              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}