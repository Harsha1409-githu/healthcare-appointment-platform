import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Specialties from "../components/Specialties";
import FeaturedDoctors from "../components/FeaturedDoctors";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Specialties />
      <FeaturedDoctors />
    </>
  );
}