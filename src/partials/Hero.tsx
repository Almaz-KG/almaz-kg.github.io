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
          className="mt-0"
          src="/assets/images/almaz.png"
          alt="Avatar"
          loading="lazy"
          width={350}
          height={350}
        />
      }
    />
  </Section>
);

export { Hero };
