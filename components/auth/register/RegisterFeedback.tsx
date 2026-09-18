"use client";

import { MdCheckCircle, MdError } from "react-icons/md";
import { Body, Button, ButtonLink } from "@/components/ui";

export type RegisterFeedbackStatus = "success" | "error";

export function RegisterFeedback({
  status,
  message,
  loginHref,
  onRetry,
}: {
  status: RegisterFeedbackStatus;
  message: string;
  loginHref: string;
  onRetry: () => void;
}) {
  const isSuccess = status === "success";

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          isSuccess ? "bg-green-50 text-green-600" : "bg-danger/10 text-danger"
        }`}
      >
        {isSuccess ? <MdCheckCircle size={36} /> : <MdError size={36} />}
      </div>

      <div>
        <h3 className="text-xl font-black text-ink">
          {isSuccess ? "Account created!" : "Registration failed"}
        </h3>
        <Body size="sm" className="mt-1 max-w-xs text-muted">
          {message}
        </Body>
      </div>

      {isSuccess ? (
        <ButtonLink href={loginHref} fullWidth className="font-bold">
          Sign in
        </ButtonLink>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="w-full"
        >
          Try again
        </Button>
      )}
    </div>
  );
}
