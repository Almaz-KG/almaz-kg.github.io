import avatar from "@/assets/almaz-avatar.webp";

/** Avatar in a gradient ring, with a conic glow that intensifies on hover. */
export function HeroAvatar() {
  return (
    <div className="group relative shrink-0">
      <span className="absolute -inset-2 rounded-full bg-[conic-gradient(from_140deg,rgba(182,255,46,0.35),rgba(47,240,208,0.25),rgba(139,123,255,0.35),rgba(182,255,46,0.35))] opacity-70 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative rounded-full bg-gradient-to-br from-lime/70 via-aqua/40 to-violet/70 p-[1.5px]">
        <div className="overflow-hidden rounded-full bg-gradient-to-br from-lime/20 via-ink-3 to-violet/20">
          <img
            src={avatar}
            alt="Almaz Murzabekov"
            width={320}
            height={320}
            decoding="async"
            className="h-14 w-14 scale-[1.04] object-cover transition-transform duration-500 group-hover:scale-110 sm:h-16 sm:w-16"
          />
        </div>
      </div>
    </div>
  );
}
