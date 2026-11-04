import Banner from "@/components/home/Banner";
import PopularCategories from "@/components/home/PopularCategories";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import HowBookingWorks from "@/components/home/HowBookingWorks";
import HostGuarantee from "@/components/home/HostGuarantee";
import CallToAction from "@/components/home/CallToAction";

export default function Home() {
  return (
    <>
      <Banner />
      <FeaturedStudios />
      <PopularCategories />
      <HowBookingWorks />
      <HostGuarantee />
      <CallToAction />
    </>
  );
}
