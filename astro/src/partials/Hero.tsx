import { Section } from '../components/Section';
import { HeroAvatar } from '../components/HeroAvatar'

const socialLinks = [
  {
    'name': 'Telegram',
    'href': "https://t.me/AlmazKG",
    'icon_path': "/assets/images/social/telegram-icon.png",
    'alt': "Telegram icon"
  },
  {
    'name': 'Email',
    'href': "mailto:almaz@murzabekov.net",
    'icon_path': "/assets/images/social/mail-icon.png",
    'alt': "Mail icon"
  },
  {
    'name': 'Linkedin',
    'href': "https://www.linkedin.com/in/almazmurzabekov/",
    'icon_path': "/assets/images/social/linkedin-icon.png",
    'alt': "Linkedin icon"
  },
  {
    'name': 'Gitlab',
    'href': "https://gitlab.com/almazmurzabekov",
    'icon_path': "/assets/images/social/gitlab-icon.png",
    'alt': "Gitlab icon"
  },
  {
    'name': 'Instagram',
    'href': "https://www.instagram.com/almazmurzabekov/",
    'icon_path': "/assets/images/social/instagram-icon.png",
    'alt': "Instagram icon"
  },
]

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
          alt="Avatar image"
          loading="lazy"
        />
      }
      socialButtons={ socialLinks }
    />
  </Section>
);

export { Hero };
