import { Backdrop, CursorGlow } from "./components/Backdrop";
import { Hero } from "./components/Hero";
import { About, Focus } from "./components/Sections";
import { Contact, Footer, Projects } from "./components/Sections2";
import { Shelf } from "./components/Shelf";
import { ScrollProgress } from "./components/ScrollProgress";

export default function App() {
  return (
    <div className="grain relative min-h-screen overflow-x-hidden">
      <Backdrop />
      <CursorGlow />
      <ScrollProgress />

      <main className="relative z-20">
        <Hero />
        <About />
        <Focus />
        {/* <Stack /> — mounting it means renumbering Projects/Shelf/Contact */}
        <Projects />
        <Shelf />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
