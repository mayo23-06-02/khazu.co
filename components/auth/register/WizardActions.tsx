"use client";

import { FaArrowLeft, FaArrowRight, FaUserPlus } from "react-icons/fa";
import { Button } from "@/components/ui";

export function WizardActions({
  showBack,
  onBack,
  isReview,
  isPending,
}: {
  showBack: boolean;
  onBack: () => void;
  isReview: boolean;
  isPending: boolean;
}) {
  return (
    <div className="flex gap-3 pt-2">
      {showBack && (
        <Button
          type="button"
          variant="outline"
          
          onClick={onBack}
          disabled={isPending}
          className="flex-1"
        >
          <FaArrowLeft className="mr-2" /> Back
        </Button>
      )}
      <Button
        type="submit"
        variant="primary"
        
        loading={isPending}
        className="flex-1 bg-[#a72346] hover:bg-[#8e1c3a] text-white font-bold"
      >
        {isReview ? (
          <>
            <FaUserPlus className="mr-2" /> Create Account
          </>
        ) : (
          <>
            Next <FaArrowRight className="ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
