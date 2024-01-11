type ISocialLink = {
    name: string;
    href: string;
    icon_path: string;
    alt: string;
    w_size?: number;
    h_size?: number;
};

const SocialLink = (props: ISocialLink) => (
    <a href={props.href}>
         <img
            className="h-12 w-12 hover:translate-y-1"
            src={props.icon_path}
            alt={props.alt}
            loading="lazy"
        />
    </a>
)
export { SocialLink };
  
