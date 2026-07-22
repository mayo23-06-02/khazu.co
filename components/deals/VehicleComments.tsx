"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Avatar, Body, Button, Heading3, Textarea } from "@/components/ui";
import { addComment, replyToComment, toggleLike } from "@/lib/comments/actions";
import type { ListingComment, ListingCommentThread } from "@/types/comment";

const MAX_MESSAGE_LENGTH = 1000;

function initialsFor(name: string | null | undefined) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function formatCommentDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function VehicleComments({
  listingId,
  comments,
  likesCount,
  liked,
  isLoggedIn,
  isOwner,
}: {
  listingId: string;
  comments: ListingCommentThread[];
  likesCount: number;
  liked: boolean;
  isLoggedIn: boolean;
  isOwner: boolean;
}) {
  const router = useRouter();
  const tempIdRef = useRef(0);
  const [items, setItems] = useState(comments);
  const [prevComments, setPrevComments] = useState(comments);
  const [likeState, setLikeState] = useState({ liked, count: likesCount });
  const [prevLikeProps, setPrevLikeProps] = useState({ liked, likesCount });
  const [isLiking, setIsLiking] = useState(false);

  const [message, setMessage] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Reconcile local (optimistic) state with fresh server props after a
  // router.refresh() — adjusting state during render, not in an effect.
  if (comments !== prevComments) {
    setPrevComments(comments);
    setItems(comments);
  }
  if (liked !== prevLikeProps.liked || likesCount !== prevLikeProps.likesCount) {
    setPrevLikeProps({ liked, likesCount });
    setLikeState({ liked, count: likesCount });
  }

  const nextTempId = () => {
    tempIdRef.current += 1;
    return `local-${tempIdRef.current}`;
  };

  const handleLike = () => {
    if (!isLoggedIn || isLiking) return;
    const prev = likeState;
    setIsLiking(true);
    setLikeState({
      liked: !prev.liked,
      count: prev.count + (prev.liked ? -1 : 1),
    });
    toggleLike({ listingId }).then((result) => {
      setIsLiking(false);
      if (!result.success) {
        setLikeState(prev);
        return;
      }
      if (typeof result.likesCount === "number") {
        setLikeState({ liked: !!result.liked, count: result.likesCount });
      }
      router.refresh();
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;
    setCommentError(null);
    setIsSubmittingComment(true);
    const result = await addComment({ listingId, message: text });
    setIsSubmittingComment(false);
    if (!result.success) {
      setCommentError(result.error || "Something went wrong. Please try again.");
      return;
    }
    const optimistic: ListingCommentThread = {
      id: nextTempId(),
      listing_id: listingId,
      seller_id: "",
      author_id: "",
      parent_comment_id: null,
      message: text,
      created_at: new Date().toISOString(),
      author: { full_name: "You", avatar_url: null },
      replies: [],
    };
    setItems((prevItems) => [...prevItems, optimistic]);
    setMessage("");
    router.refresh();
  };

  const handleSubmitReply = async (parentId: string) => {
    const text = replyMessage.trim();
    if (!text) return;
    setReplyError(null);
    setIsSubmittingReply(true);
    const result = await replyToComment({
      listingId,
      parentCommentId: parentId,
      message: text,
    });
    setIsSubmittingReply(false);
    if (!result.success) {
      setReplyError(result.error || "Something went wrong. Please try again.");
      return;
    }
    const optimisticReply: ListingComment = {
      id: nextTempId(),
      listing_id: listingId,
      seller_id: "",
      author_id: "",
      parent_comment_id: parentId,
      message: text,
      created_at: new Date().toISOString(),
      author: { full_name: "Seller", avatar_url: null },
    };
    setItems((prevItems) =>
      prevItems.map((c) =>
        c.id === parentId
          ? { ...c, replies: [...c.replies, optimisticReply] }
          : c,
      ),
    );
    setReplyMessage("");
    setReplyingTo(null);
    router.refresh();
  };

  return (
    <section className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <Heading3 className="font-bold">
          Comments{items.length > 0 ? ` (${items.length})` : ""}
        </Heading3>
        <button
          type="button"
          onClick={handleLike}
          disabled={!isLoggedIn || isLiking}
          title={isLoggedIn ? undefined : "Log in to like this listing"}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-60 hover:text-[#CD2C58] transition-colors"
        >
          {likeState.liked ? (
            <FaHeart className="text-[#CD2C58]" />
          ) : (
            <FaRegHeart />
          )}
          <span>{likeState.count}</span>
        </button>
      </div>

      {isLoggedIn ? (
        <form onSubmit={handleSubmitComment} className="space-y-2">
          <Textarea
            placeholder="Ask the seller a question or leave a comment..."
            fullWidth
            rows={3}
            maxLength={MAX_MESSAGE_LENGTH}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {commentError && (
            <p className="text-sm text-danger" role="alert">
              {commentError}
            </p>
          )}
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={isSubmittingComment}
              disabled={!message.trim()}
            >
              Post comment
            </Button>
          </div>
        </form>
      ) : (
        <Body size="sm" className="text-gray-500">
          <Link href="/login" className="text-[#CD2C58] font-semibold">
            Log in
          </Link>{" "}
          to comment or like this listing.
        </Body>
      )}

      <div className="space-y-5">
        {items.length === 0 && (
          <Body size="sm" className="text-gray-400">
            No comments yet. Be the first to ask about this vehicle.
          </Body>
        )}

        {items.map((c) => (
          <div key={c.id} className="space-y-3">
            <div className="flex gap-3">
              <Avatar
                src={c.author?.avatar_url ?? undefined}
                initials={initialsFor(c.author?.full_name)}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-gray-800">
                    {c.author?.full_name || "Khazu user"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatCommentDate(c.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">
                  {c.message}
                </p>
                {isOwner && (
                  <button
                    type="button"
                    onClick={() =>
                      setReplyingTo(replyingTo === c.id ? null : c.id)
                    }
                    className="text-xs font-semibold text-[#CD2C58] mt-1"
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>

            {c.replies.length > 0 && (
              <div className="ml-11 space-y-3 border-l-2 border-gray-100 pl-4">
                {c.replies.map((r) => (
                  <div key={r.id} className="flex gap-3">
                    <Avatar
                      src={r.author?.avatar_url ?? undefined}
                      initials={initialsFor(r.author?.full_name)}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-gray-800">
                          {r.author?.full_name || "Seller"}
                        </span>
                        <span className="rounded bg-[#CD2C58]/10 text-[#CD2C58] text-[10px] font-bold uppercase px-1.5 py-0.5">
                          Seller
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatCommentDate(r.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">
                        {r.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isOwner && replyingTo === c.id && (
              <div className="ml-11 space-y-2">
                <Textarea
                  fullWidth
                  rows={2}
                  placeholder="Write a reply..."
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                {replyError && (
                  <p className="text-sm text-danger" role="alert">
                    {replyError}
                  </p>
                )}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    loading={isSubmittingReply}
                    disabled={!replyMessage.trim()}
                    onClick={() => handleSubmitReply(c.id)}
                  >
                    Send reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
