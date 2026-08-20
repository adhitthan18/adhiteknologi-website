import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Services } from "@/components/sections/services";
import { Products } from "@/components/sections/products";
import { Process } from "@/components/sections/process";
import { WhyUs } from "@/components/sections/why-us";
import { Tech } from "@/components/sections/tech";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Hero dict={dict} />
      <Stats dict={dict} />
      <Services dict={dict} />
      <Products dict={dict} />
      <Process dict={dict} />
      <WhyUs dict={dict} />
      <Tech dict={dict} />
      <Faq dict={dict} />
      <Contact dict={dict} />
    </>
  );
}
