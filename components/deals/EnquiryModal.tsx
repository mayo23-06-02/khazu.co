"use client";

import { useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { Body, Button, InputPhone, InputText, Modal, Textarea } from "@/components/ui";
import { submitEnquiry } from "@/lib/enquiries/actions";

export function EnquiryModal({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  sellerPhone,
}: {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  sellerPhone?: string | null;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    `Hi, I'm interested in the ${listingTitle}. Is it still available?`,
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reset = () => {
    setName("");
    setPhone("");
    setMessage(`Hi, I'm interested in the ${listingTitle}. Is it still available?`);
    setError(null);
    setSubmitted(false);
  };

  const handleClose = () => {
    onClose();
    // Wait for the close animation before wiping state so it doesn't flash empty.
    setTimeout(reset, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await submitEnquiry({ listingId, name, phone, message });
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error || "Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  const handleWhatsApp = () => {
    if (!sellerPhone) return;
    const digits = sellerPhone.replace(/\D/g, "");
    const waPhone = digits.startsWith("268") ? digits : `268${digits}`;
    const vehicleUrl = typeof window !== "undefined" ? window.location.href : "";
    const text = `Hi, I'm interested in the ${listingTitle}. Is it still available? ${vehicleUrl}`;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Enquire about this vehicle" size="lg">
      {submitted ? (
        <div className="flex flex-col items-center text-center gap-3 py-6">
          <MdCheckCircle size={40} className="text-green-600" />
          <div>
            <p className="font-bold text-gray-900">Enquiry sent!</p>
            <Body size="sm" className="text-gray-500 mt-1">
              The seller will get back to you shortly.
            </Body>
          </div>
          <Button variant="outline" onClick={handleClose} className="mt-2">
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Body size="sm" className="text-gray-500">
            Enquiring about the <span className="font-bold text-gray-800">{listingTitle}</span>
          </Body>
          <InputText
            label="Your name"
            placeholder="Thandi Dlamini"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <InputPhone
            label="Phone number"
            placeholder="76123456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Textarea
            label="Message"
            fullWidth
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            className="bg-[#CD2C58] hover:bg-[#a72346] text-white font-bold h-11 rounded-xl border-none"
          >
            Send enquiry
          </Button>
          {sellerPhone && (
            <Button
              type="button"
              fullWidth
              onClick={handleWhatsApp}
              className="bg-[#25D366] hover:bg-[#1da851] text-white font-bold h-11 rounded-xl border-none"
            >
              <FaWhatsapp size={18} className="mr-2" />
              Chat on WhatsApp
            </Button>
          )}
        </form>
      )}
    </Modal>
  );
}
