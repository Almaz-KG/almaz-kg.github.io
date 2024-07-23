type ISocialLink = {
    name: string;
    href: string;
    id: string;
    icon_path: string;
    alt: string;
    w_size?: number;
    h_size?: number;
};

const SocialLink = (props: ISocialLink) => (
    <a href={props.href} id={props.id} key={props.id}>
         <img
            className="h-12 w-12 hover:translate-y-1"
            src={props.icon_path}
            alt={props.name}
            loading="lazy"
        />
    </a>
)
export { SocialLink };
  
