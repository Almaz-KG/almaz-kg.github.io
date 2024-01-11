import { SocialLink } from '../components/SocialLink';
import { Section } from '../components/Section';
import { HeroAvatar } from '../components/HeroAvatar'


const Hero = () => (
  <Section>
    <HeroAvatar
      title={
        <>
          Exploring the Digital Landscape
        </>
      }
      description={
        <>
        A personal blog on Data Engineering, Modern Data Stack Techs, Rust, Frontend, React, and all the beyond
        </>
      }
      avatar={
        <img
          className="h-80 w-72"
          src="/assets/images/almaz.png"
          alt="Avatar image"
          loading="lazy"
        />
      }
      socialButtons={
        <>
          <SocialLink 
            name='Email' 
            href="mailto:almaz@murzabekov.net" 
            icon_path="/assets/images/social/mail-icon.png"
            alt="Mail icon" />
          {/* <SocialLink 
            name='RSS' 
            href="/index.xml" 
            icon_path="/assets/images/social/rss-icon.png"
            alt="RSS icon" /> */}
          <SocialLink 
            name='Linkedin' 
            href="https://www.linkedin.com/in/almazmurzabekov/" 
            icon_path="/assets/images/social/linkedin-icon.png"
            alt="Linkedin icon" />
          <SocialLink 
            name='Gitlab' 
            href="https://gitlab.com/almazmurzabekov" 
            icon_path="/assets/images/social/gitlab-icon.png"
            alt="Gitlab icon" />
          <SocialLink 
            name='Telegram' 
            href="https://t.me/AlmazKG" 
            icon_path="/assets/images/social/telegram-icon.png"
            alt="Telegram icon" />
          <SocialLink 
            name='Instagram' 
            href="https://www.instagram.com/almazmurzabekov/" 
            icon_path="/assets/images/social/instagram-icon.png"
            alt="Instagram icon" />
        </>
      }
    />
  </Section>
);

export { Hero };
