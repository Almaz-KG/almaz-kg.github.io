// import type { MarkdownInstance } from 'astro';
// import type { IFrontmatter } from 'astro-boilerplate-components';
// import {
//   GradientText,
// } from 'astro-boilerplate-components';

import { Section } from '@/components/Section';
import { IFrontMatter, MarkdownInstance } from '@/components/types/IFrontMatter'
import { BlogList } from '@/components/BlogList';
import { GradientText } from '@/components/GradientText' 

type IRecentPostsProps = {
  postList: MarkdownInstance<IFrontmatter>[];
};

const RecentPosts = (props: IRecentPostsProps) => (
  <Section
    title={
      <div className="flex items-baseline justify-between">
        <div>
          Recent <GradientText>Posts</GradientText>
        </div>

        <div className="text-sm">
          <a href="/posts/">View all Posts →</a>
        </div>
      </div>
    }>
    <BlogList postList={props.postList} />
  </Section>
);

export { RecentPosts };
