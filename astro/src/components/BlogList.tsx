import type { MarkdownInstance } from 'astro';

import type { IFrontmatter } from './types/IFrontMatter';
import { BlogListItem } from './BlogListItem';

type IRecentPostsProps = {
  postList: MarkdownInstance<IFrontmatter>[];
};

const BlogList = (props: IRecentPostsProps) => (
  <div className="grid grid-cols-1 gap-6">
    {props.postList.map((elt) => (
      <BlogListItem key={elt.url} instance={elt} />
    ))}
  </div>
);

export { BlogList };