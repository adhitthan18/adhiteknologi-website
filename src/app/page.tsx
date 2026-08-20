import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Services } from "@/components/sections/services";
import { Products } from "@/components/sections/products";
import { Process } from "@/components/sections/process";
import { WhyUs } from "@/components/sections/why-us";
import { Tech } from "@/components/sections/tech";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Products />
      <Process />
      <WhyUs />
      <Tech />
      <Faq />
      <Contact />
    </>
  );
}
