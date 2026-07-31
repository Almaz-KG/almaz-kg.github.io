import { Backdrop } from "@/components/layout/Backdrop";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Focus } from "@/components/sections/Focus";
import { Projects } from "@/components/sections/Projects";
import { Shelf } from "@/components/sections/Shelf";

export default function App() {
  return (
    <div className="grain relative min-h-screen overflow-x-hidden">
      <Backdrop />
      <ScrollProgress />

      <main className="relative z-20">
        <Hero />
        <About />
        <Focus />
        <Projects />
        <Shelf />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
