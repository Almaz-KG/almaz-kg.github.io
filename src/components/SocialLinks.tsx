import { SocialLink } from './SocialLink';

const socialLinks = [
  {
    'name': 'Linkedin',
    'href': "https://www.linkedin.com/in/almazmurzabekov/",
    'icon_path': "/assets/images/social/linkedin.png",
    'alt': "Linkedin icon"
  },
  {
    'name': 'GitHub',
    'href': "https://github.com/Almaz-KG/",
    'icon_path': "/assets/images/social/github.png",
    'alt': "GitHub icon"
  },
  {
    'name': 'Telegram',
    'href': "https://t.me/AlmazKG",
    'icon_path': "/assets/images/social/telegram.png",
    'alt': "Telegram icon"
  },
  {
    'name': 'Email',
    'href': "mailto:almaz@murzabekov.net",
    'icon_path': "/assets/images/social/mail.png",
    'alt': "Mail icon"
  },
]

const SocialLinks = () => (
  <>
    <div className="mt-3 flex gap-1"> { socialLinks.map((social) => <SocialLink 
          id={social.name}
          name={social.name} 
          href={social.href} 
          alt={social.alt}
          icon_path={social.icon_path} />) }
      </div>
  </>
);

export { SocialLinks };
