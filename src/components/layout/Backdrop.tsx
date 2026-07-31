import { NodeField } from "./NodeField";

/** Fixed, non-interactive background: colour blobs, a fading grid, and the node field. */
export function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* colour blobs */}
      <div className="animate-float-slow absolute -top-[22%] -left-[12%] h-[62vw] w-[62vw] rounded-full bg-[radial-gradient(circle,rgba(47,240,208,0.20),transparent_65%)] blur-[60px]" />
      <div className="animate-float-slower absolute top-[8%] -right-[16%] h-[58vw] w-[58vw] rounded-full bg-[radial-gradient(circle,rgba(139,123,255,0.20),transparent_65%)] blur-[70px]" />
      <div className="animate-float-slow absolute bottom-[-25%] left-[18%] h-[55vw] w-[55vw] rounded-full bg-[radial-gradient(circle,rgba(182,255,46,0.14),transparent_65%)] blur-[80px]" />

      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, #000 30%, transparent 78%)",
        }}
      />

      <div className="absolute inset-x-0 top-0 h-[110vh]">
        <NodeField />
      </div>
    </div>
  );
}
