import About from "@/components/About";
import BestSellers from "@/components/BestSellers";
import CustomOrders from "@/components/CustomOrders";
import Occasions from "@/components/Occasions";
import RnqHero from "@/components/RnqHero";

export default function Home() {
  return (
    <main>
      <RnqHero />
      <BestSellers />
      <Occasions />
      <CustomOrders />
      <About />
    </main>
  );
}
