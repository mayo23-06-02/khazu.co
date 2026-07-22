export interface ListingCommentAuthor {
  full_name: string | null;
  avatar_url: string | null;
}

export interface ListingComment {
  id: string;
  listing_id: string;
  seller_id: string;
  author_id: string;
  parent_comment_id: string | null;
  message: string;
  created_at: string;
  author?: ListingCommentAuthor | null;
}

export interface ListingCommentThread extends ListingComment {
  replies: ListingComment[];
}
