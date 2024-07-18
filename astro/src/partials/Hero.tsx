import { Section } from '@/components/Section';
import { HeroAvatar } from '@/components/HeroAvatar'

const Hero = () => (
  <Section>
    <HeroAvatar
      title={
        <> Exploring the Digital Landscape </> }
      description={
        <> A personal blog on Data Engineering, Modern Data Stack, Rust, Frontend and all the beyond</>
      }
      avatar={
        <img
          className="h-80 w-72"
          src="/assets/images/almaz.png"
          alt="Avatar"
          loading="lazy"
        />
      }
    />
  </Section>
);

export { Hero };
