import { Section } from '@/components/Section';

import { AppConfig } from '@/utils/AppConfig';
const { site_name } = AppConfig;

const Footer = () => (
  <Section>
    <div className="border-t border-gray-600 pt-5 text-center">
      <div className="text-sm text-gray-200">
        © Copyright {new Date().getFullYear()} by { site_name }
      </div>
    </div>
  </Section>
);

export { Footer };
