import type { ReactNode } from 'react';
import { SocialLink } from './SocialLink';

type IHeroAvatarProps = {
  title: ReactNode;
  description: ReactNode;
  avatar: ReactNode;
  socialButtons: Array<{ name: string, href: string, alt: string, icon_path: string }>;
};

const HeroAvatar = (props: IHeroAvatarProps) => (
  <div className="flex flex-col items-center md:flex-row md:justify-between md:gap-x-24">
    <div>
      <h1 className="text-3xl font-bold">{props.title}</h1>

      <p className="mt-6 text-xl leading-9">{props.description}</p>

      <div className="mt-3 flex gap-1"> { props.socialButtons.map((social) => <SocialLink 
          name={social.name} 
          href={social.href} 
          alt={social.alt}
          icon_path={social.icon_path} />) }</div>
    </div>

    <div className="shrink-0">{props.avatar}</div>
  </div>
);

export { HeroAvatar };