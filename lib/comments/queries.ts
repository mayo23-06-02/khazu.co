import { createClient } from "@/lib/supabase/server";
import type {
  ListingComment,
  ListingCommentAuthor,
  ListingCommentThread,
} from "@/types/comment";

const COMMENT_SELECT = `
  id, listing_id, seller_id, author_id, parent_comment_id, message, created_at,
  author:author_id ( full_name, avatar_url )
`;

function normalizeAuthor(
  raw: ListingCommentAuthor | ListingCommentAuthor[] | null | undefined,
): ListingCommentAuthor | null {
  if (!raw) return null;
  return Array.isArray(raw) ? raw[0] ?? null : raw;
}

export async function getListingComments(
  listingId: string,
): Promise<ListingCommentThread[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listing_comments")
      .select(COMMENT_SELECT)
      .eq("listing_id", listingId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("getListingComments:", error.message);
      return [];
    }

    const comments = (data ?? []).map((row) => {
      const r = row as unknown as ListingComment & {
        author: ListingCommentAuthor | ListingCommentAuthor[] | null;
      };
      return { ...r, author: normalizeAuthor(r.author) } as ListingComment;
    });

    const repliesByParent = new Map<string, ListingComment[]>();
    for (const c of comments) {
      if (!c.parent_comment_id) continue;
      const list = repliesByParent.get(c.parent_comment_id) ?? [];
      list.push(c);
      repliesByParent.set(c.parent_comment_id, list);
    }

    return comments
      .filter((c) => !c.parent_comment_id)
      .map((c) => ({ ...c, replies: repliesByParent.get(c.id) ?? [] }));
  } catch (e) {
    console.error("getListingComments failed:", e);
    return [];
  }
}

export async function hasLikedListing(
  listingId: string,
  userId: string,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("listing_likes")
      .select("id")
      .eq("listing_id", listingId)
      .eq("user_id", userId)
      .maybeSingle();
    return !!data;
  } catch (e) {
    console.error("hasLikedListing failed:", e);
    return false;
  }
}
