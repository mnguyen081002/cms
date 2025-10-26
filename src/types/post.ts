/**
 * Post type definition
 * Centralized type for all post-related operations
 */
export type Post = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  published: boolean;
};

/**
 * Post with author information
 */
export type PostWithAuthor = Post & {
  author: {
    id: string;
    email: string;
  };
};

