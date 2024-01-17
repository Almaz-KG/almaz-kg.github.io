import { NavbarTwoColumns } from '@/components/nav/NavBarTwoColumns';
import { NavMenuItem } from '@/components/nav/NavMenuItem';
import { NavMenu } from '@/components/nav/NavMenu';
import { Logo } from '@/components/Logo';
import { Section } from '@/components/Section';
import { AppConfig } from '@/utils/AppConfig';
const { title } = AppConfig;

const Navbar = () => (
  <Section>
    <NavbarTwoColumns>
      <a href="/">
        <Logo
          icon={
            <svg
              className="mr-1 h-10 w-10 stroke-cyan-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M0 0h24v24H0z" stroke="none"></path>
              <rect x="3" y="12" width="6" height="8" rx="1"></rect>
              <rect x="9" y="8" width="6" height="12" rx="1"></rect>
              <rect x="15" y="4" width="6" height="16" rx="1"></rect>
              <path d="M4 20h14"></path>
            </svg>
          }
          name={title}
        />
      </a>

      <NavMenu>
        <NavMenuItem href="/posts/">Posts</NavMenuItem>
        {/* <NavMenuItem href="/">Search</NavMenuItem>
        <NavMenuItem href="/">Tags</NavMenuItem> */}
        <NavMenuItem href="/">Books</NavMenuItem>
        <NavMenuItem href="/">Projects</NavMenuItem>
        <NavMenuItem href="/about">About</NavMenuItem>
      </NavMenu>
    </NavbarTwoColumns>
  </Section>
);

export { Navbar };
