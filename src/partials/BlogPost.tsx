import type { IFrontmatter } from '@/components/types/IFrontMatter';

import { PostHeader } from '@/components/post/PostHeader'
import { PostContent } from '@/components/post/PostContent'; 
import { Section } from '@/components/Section';
import type { ReactNode } from 'react';

import { AppConfig } from '@/utils/AppConfig';

type IBlogPostProps = {
  frontmatter: IFrontmatter;
  children: ReactNode;
};

const BlogPost = (props: IBlogPostProps) => (
  <Section>
    <PostHeader content={props.frontmatter} author={AppConfig.author} />

    <PostContent content={props.frontmatter}>{props.children}</PostContent>
  </Section>
);

export { BlogPost };
