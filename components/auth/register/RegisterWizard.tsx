"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { Body, Logo, StepProgress } from "@/components/ui";
import { checkContactAvailability, registerUser } from "@/lib/auth/actions";
import { BrandPanel } from "./BrandPanel";
import { buildRegisterFormData } from "./buildFormData";
import { RegisterFeedback, type RegisterFeedbackStatus } from "./RegisterFeedback";
import { defaultRegisterValues, REGISTER_STEPS } from "./schema";
import type { RegisterFormValues, RegisterStepId } from "./schema";
import { validateRegisterStep } from "./validateStep";
import { WizardActions } from "./WizardActions";
import { AccountTypeStep } from "./steps/AccountTypeStep";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { DealerDetailsStep } from "./steps/DealerDetailsStep";
import { IndividualDetailsStep } from "./steps/IndividualDetailsStep";
import { ReviewStep } from "./steps/ReviewStep";

export function RegisterWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isCheckingContact, setIsCheckingContact] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    status: RegisterFeedbackStatus;
    message: string;
    loginHref: string;
  } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<RegisterFormValues>({
    defaultValues: defaultRegisterValues,
    mode: "onTouched",
  });
  const { watch, getValues, setError: setFieldError, clearErrors } = form;
  const accountType = watch("account_type");

  const steps = REGISTER_STEPS;
  const currentStep = steps[stepIndex];

  // Move focus to the step heading whenever the step changes — keeps
  // screen reader / keyboard users oriented without a full page reload.
  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  const validateStep = (id: RegisterStepId): boolean => {
    clearErrors();
    const errorMessage = validateRegisterStep(id, getValues(), setFieldError);
    return !errorMessage;
  };

  const next = async () => {
    if (!validateStep(currentStep.id as RegisterStepId)) return;

    if (currentStep.id === "basic") {
      setIsCheckingContact(true);
      try {
        const { emailTaken, phoneTaken } = await checkContactAvailability(
          getValues("email"),
          getValues("phone"),
        );
        let hasConflict = false;
        if (emailTaken) {
          setFieldError("email", {
            message: "This email is already registered.",
          });
          hasConflict = true;
        }
        if (phoneTaken) {
          setFieldError("phone", {
            message: "This phone number is already registered.",
          });
          hasConflict = true;
        }
        if (hasConflict) return;
      } finally {
        setIsCheckingContact(false);
      }
    }

    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));
  const goToStep = (id: RegisterStepId) => {
    const idx = steps.findIndex((s) => s.id === id);
    if (idx >= 0) setStepIndex(idx);
  };

  const onSubmit = () => {
    if (!validateStep("review")) return;

    startTransition(async () => {
      const fd = buildRegisterFormData(getValues(), avatarFile);
      const result = await registerUser(fd);
      if (!result.success) {
        setSubmitResult({
          status: "error",
          message:
            result.error || "Something went wrong while creating your account. Please try again.",
          loginHref: "/auth/login",
        });
        return;
      }

      setSubmitResult({
        status: "success",
        message: "Your account has been created. Sign in to get started.",
        loginHref: result.redirectTo || "/auth/login",
      });
    });
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden">
      <div className="absolute inset-0 z-0">
       
        <div className="absolute inset-0 bg-gradient-to-br from-black/15 via-black/20 to-[#a72346]/10" />
      </div>

      {/* Form panel */}
      <div className="relative z-10 w-full flex items-center justify-start  lg:p-0">
        <div className="w-full lg:max-w-4xl ">
          <div className="bg-white lg:px-16 backdrop-blur-xl w-full h-screen overflow-hidden flex flex-col">
            <div className="px-6 pt-6 lg:px-8 lg:pt-8">
              <Logo />
            </div>
            {!submitResult && (
              <div className="px-6 lg:px-8 pt-8 flex-shrink-0">
                <StepProgress
                  steps={steps.map((s) => ({ id: s.id, label: s.label }))}
                  currentIndex={stepIndex}
                />
              </div>
            )}

            <div className="p-4 lg:p-8 pt-4 flex-1 overflow-y-auto">
              {submitResult ? (
                <RegisterFeedback
                  status={submitResult.status}
                  message={submitResult.message}
                  loginHref={submitResult.loginHref}
                  onRetry={() => setSubmitResult(null)}
                />
              ) : (
                <FormProvider {...form}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (currentStep.id === "review") onSubmit();
                      else void next();
                    }}
                    className="space-y-5"
                    noValidate
                  >
                    {currentStep.id === "type" && (
                      <AccountTypeStep headingRef={headingRef} />
                    )}
                    {currentStep.id === "basic" && (
                      <BasicInfoStep headingRef={headingRef} />
                    )}
                    {currentStep.id === "specific" &&
                      (accountType === "dealer" ? (
                        <DealerDetailsStep
                          headingRef={headingRef}
                          onAvatarChange={setAvatarFile}
                        />
                      ) : (
                        <IndividualDetailsStep
                          headingRef={headingRef}
                          onAvatarChange={setAvatarFile}
                        />
                      ))}
                    {currentStep.id === "review" && (
                      <ReviewStep
                        headingRef={headingRef}
                        avatarFile={avatarFile}
                        goToStep={goToStep}
                      />
                    )}

                    <WizardActions
                      showBack={stepIndex > 0}
                      onBack={back}
                      isReview={currentStep.id === "review"}
                      isPending={isPending || isCheckingContact}
                    />
                  </form>
                </FormProvider>
              )}
            </div>

            <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 text-center flex-shrink-0">
              <Body size="sm" className="text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-[#a72346] hover:underline font-bold"
                >
                  Sign in
                </Link>
              </Body>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
