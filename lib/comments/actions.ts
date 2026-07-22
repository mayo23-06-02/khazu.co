"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CommentActionResult = {
  success: boolean;
  error?: string;
};

const MAX_MESSAGE_LENGTH = 1000;

function schemaMissingError(error: { message: string }, table: string) {
  const missing =
    error.message.includes("schema cache") ||
    error.message.includes("Could not find the table");
  return missing
    ? `${table} table missing. Run supabase/listing_engagement.sql in the Supabase SQL Editor.`
    : error.message;
}

export async function addComment(input: {
  listingId: string;
  message: string;
}): Promise<CommentActionResult> {
  try {
    const message = input.message.trim();
    if (!message) return { success: false, error: "Comment can't be empty." };
    if (message.length > MAX_MESSAGE_LENGTH) {
      return { success: false, error: "Comment is too long." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "You must be signed in to comment." };
    }

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, seller_id, status")
      .eq("id", input.listingId)
      .maybeSingle();
    if (listingError || !listing || listing.status !== "active") {
      return { success: false, error: "This listing is no longer available." };
    }

    const { error } = await supabase.from("listing_comments").insert({
      listing_id: listing.id,
      seller_id: listing.seller_id,
      author_id: user.id,
      message,
    });
    if (error) {
      return { success: false, error: schemaMissingError(error, "Comments") };
    }

    await supabase.from("listing_events").insert({
      listing_id: listing.id,
      seller_id: listing.seller_id,
      actor_id: user.id,
      event_type: "comment",
      message,
    });

    revalidatePath(`/deals/${listing.id}`);
    revalidatePath("/dashboard/personal");
    revalidatePath("/dashboard/dealer");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to add comment",
    };
  }
}

export async function replyToComment(input: {
  listingId: string;
  parentCommentId: string;
  message: string;
}): Promise<CommentActionResult> {
  try {
    const message = input.message.trim();
    if (!message) return { success: false, error: "Reply can't be empty." };
    if (message.length > MAX_MESSAGE_LENGTH) {
      return { success: false, error: "Reply is too long." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "You must be signed in to reply." };
    }

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, seller_id, status")
      .eq("id", input.listingId)
      .maybeSingle();
    if (listingError || !listing) {
      return { success: false, error: "Listing not found." };
    }
    if (listing.seller_id !== user.id) {
      return {
        success: false,
        error: "Only the seller can reply to comments.",
      };
    }

    const { data: parent } = await supabase
      .from("listing_comments")
      .select("id, listing_id")
      .eq("id", input.parentCommentId)
      .maybeSingle();
    if (!parent || parent.listing_id !== listing.id) {
      return { success: false, error: "Comment not found." };
    }

    const { error } = await supabase.from("listing_comments").insert({
      listing_id: listing.id,
      seller_id: listing.seller_id,
      author_id: user.id,
      parent_comment_id: input.parentCommentId,
      message,
    });
    if (error) {
      return { success: false, error: schemaMissingError(error, "Comments") };
    }

    revalidatePath(`/deals/${listing.id}`);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send reply",
    };
  }
}

export type ToggleLikeResult = CommentActionResult & {
  liked?: boolean;
  likesCount?: number;
};

export async function toggleLike(input: {
  listingId: string;
}): Promise<ToggleLikeResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: "You must be signed in to like a listing.",
      };
    }

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, seller_id, status, likes_count")
      .eq("id", input.listingId)
      .maybeSingle();
    if (listingError || !listing || listing.status !== "active") {
      return { success: false, error: "This listing is no longer available." };
    }

    const { data: existing } = await supabase
      .from("listing_likes")
      .select("id")
      .eq("listing_id", listing.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("listing_likes")
        .delete()
        .eq("id", existing.id);
      if (error) return { success: false, error: error.message };

      await supabase.from("listing_events").insert({
        listing_id: listing.id,
        seller_id: listing.seller_id,
        actor_id: user.id,
        event_type: "unlike",
      });

      revalidatePath(`/deals/${listing.id}`);
      return {
        success: true,
        liked: false,
        likesCount: Math.max((listing.likes_count ?? 1) - 1, 0),
      };
    }

    const { error } = await supabase.from("listing_likes").insert({
      listing_id: listing.id,
      seller_id: listing.seller_id,
      user_id: user.id,
    });
    if (error) {
      return { success: false, error: schemaMissingError(error, "Likes") };
    }

    await supabase.from("listing_events").insert({
      listing_id: listing.id,
      seller_id: listing.seller_id,
      actor_id: user.id,
      event_type: "like",
    });

    revalidatePath(`/deals/${listing.id}`);
    return {
      success: true,
      liked: true,
      likesCount: (listing.likes_count ?? 0) + 1,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update like",
    };
  }
}
