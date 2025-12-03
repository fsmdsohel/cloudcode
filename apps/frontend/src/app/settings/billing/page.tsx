"use client";

import React, { useState, useRef, useEffect } from "react";
import { CreditCard, Plus, Receipt, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Modal from "@/components/shared/Modal";

interface PaymentMethod {
  id: string;
  type: "card";
  last4: string;
  expiry: string;
  isDefault: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
}

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (cardDetails: Partial<PaymentMethod>) => void;
  isLoading: boolean;
}

const AddCardModal = ({
  isOpen,
  onClose,
  onAdd,
  isLoading,
}: AddCardModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  if (!isOpen && !isClosing) return null;

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(" ").substr(0, 19);
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    validateField("cardNumber", formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
    validateField("expiry", formatted);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvc(value);
    validateField("cvc", value);
  };

  const validateField = (field: string, value: string) => {
    let error = "";
    switch (field) {
      case "cardNumber":
        if (value.replace(/\s/g, "").length !== 16) {
          error = "Card number must be 16 digits";
        }
        break;
      case "expiry":
        const [month, year] = value.split("/");
        if (!month || !year || month > "12" || month < "01") {
          error = "Invalid expiry date";
        }
        break;
      case "cvc":
        if (value.length !== 3) {
          error = "CVC must be 3 digits";
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isCardNumberValid = validateField("cardNumber", cardNumber);
    const isExpiryValid = validateField("expiry", expiry);
    const isCvcValid = validateField("cvc", cvc);

    if (isCardNumberValid && isExpiryValid && isCvcValid) {
      onAdd({
        type: "card",
        last4: cardNumber.slice(-4),
        expiry: expiry,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Payment Method"
      icon={<CreditCard className="w-5 h-5 text-primary-purple-400" />}
    >
      {/* Card Preview */}
      <div className="mb-6 p-4 bg-gradient-to-br from-primary-purple-400/20 to-primary-purple-400/5 rounded-xl border border-primary-purple-400/20">
        <div className="flex justify-between items-start mb-8">
          <CreditCard className="w-8 h-8 text-primary-purple-400" />
          <div className="text-sm text-white/60">
            {cardNumber ? "Credit Card" : "Enter card details"}
          </div>
        </div>
        <div className="font-mono text-lg text-white mb-4">
          {cardNumber || "•••• •••• •••• ••••"}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <div className="text-white/60 mb-1">Expires</div>
            <div className="font-mono text-white">{expiry || "MM/YY"}</div>
          </div>
          <div className="text-sm">
            <div className="text-white/60 mb-1">CVC</div>
            <div className="font-mono text-white">{cvc || "•••"}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Card Number
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className={`w-full px-4 py-2 bg-surface-hover border rounded-lg text-white placeholder:text-white/40 focus:outline-none transition-colors ${
              errors.cardNumber
                ? "border-red-500/50 focus:border-red-500"
                : "border-white/[0.08] focus:border-primary-purple-400/50"
            }`}
            placeholder="4242 4242 4242 4242"
          />
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-400">{errors.cardNumber}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiry}
              onChange={handleExpiryChange}
              className={`w-full px-4 py-2 bg-surface-hover border rounded-lg text-white placeholder:text-white/40 focus:outline-none transition-colors ${
                errors.expiry
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-white/[0.08] focus:border-primary-purple-400/50"
              }`}
              placeholder="MM/YY"
            />
            {errors.expiry && (
              <p className="mt-1 text-sm text-red-400">{errors.expiry}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={handleCvcChange}
              className={`w-full px-4 py-2 bg-surface-hover border rounded-lg text-white placeholder:text-white/40 focus:outline-none transition-colors ${
                errors.cvc
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-white/[0.08] focus:border-primary-purple-400/50"
              }`}
              placeholder="123"
            />
            {errors.cvc && (
              <p className="mt-1 text-sm text-red-400">{errors.cvc}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || Object.values(errors).some(Boolean)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-purple-400 text-white rounded-lg hover:bg-primary-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding Card...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Add Card
            </>
          )}
        </button>
      </form>
    </Modal>
  );
};

const BillingPage = () => {
  const router = useRouter();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      last4: "4242",
      expiry: "04/24",
      isDefault: true,
    },
  ]);

  const billingHistory: BillingHistory[] = [
    {
      id: "inv_1",
      date: "2024-03-01",
      amount: 29.99,
      status: "paid",
      description: "Pro Plan - Monthly",
    },
    {
      id: "inv_2",
      date: "2024-02-01",
      amount: 29.99,
      status: "paid",
      description: "Pro Plan - Monthly",
    },
  ];

  const handleAddCard = async (cardDetails: Partial<PaymentMethod>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newCard: PaymentMethod = {
        id: Date.now().toString(),
        type: "card",
        last4: cardDetails.last4!,
        expiry: cardDetails.expiry!,
        isDefault: paymentMethods.length === 0,
      };

      setPaymentMethods((prev) => [...prev, newCard]);
      setIsAddingCard(false);
    } catch (error) {
      console.error("Failed to add card:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPaymentMethods((prev) => prev.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error("Failed to remove card:", error);
    }
  };

  const handleSetDefault = async (cardId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPaymentMethods((prev) =>
        prev.map((card) => ({
          ...card,
          isDefault: card.id === cardId,
        }))
      );
    } catch (error) {
      console.error("Failed to set default card:", error);
    }
  };

  const handleDownloadInvoice = async (invoice: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Downloading invoice: ${invoice}`);
    } catch (error) {
      console.error("Failed to download invoice:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <SettingsHeader
        breadcrumbs={[
          { title: "Settings", href: "/settings" },
          { title: "Billing" },
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <h1 className="text-2xl font-semibold text-white">Billing</h1>
          <p className="mt-1 text-base text-gray-400">
            Manage your payment methods and billing history
          </p>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-3xl space-y-8">
            {/* Payment Methods */}
            <div className="bg-surface-card border border-white/[0.08] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Payment Methods
                </h2>
                <button
                  onClick={() => setIsAddingCard(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-purple-400 text-white rounded-lg hover:bg-primary-purple-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </button>
              </div>

              <div className="divide-y divide-white/[0.08]">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-purple-100 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary-purple-400" />
                      </div>
                      <div>
                        <div className="text-white">•••• {method.last4}</div>
                        <div className="text-sm text-white/60">
                          Expires {method.expiry}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {method.isDefault ? (
                        <span className="text-sm text-white/60">Default</span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          className="text-white/60 hover:text-white/80 transition-colors text-sm"
                        >
                          Make Default
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveCard(method.id)}
                        className="text-white/60 hover:text-white/80 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-surface-card border border-white/[0.08] rounded-xl overflow-hidden">
              <h2 className="text-lg font-semibold text-white p-6 border-b border-white/[0.08]">
                Billing History
              </h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left p-4 text-white/60">Date</th>
                    <th className="text-left p-4 text-white/60">Amount</th>
                    <th className="text-left p-4 text-white/60">Status</th>
                    <th className="text-left p-4 text-white/60">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((item) => (
                    <tr key={item.id} className="border-b border-white/[0.08]">
                      <td className="p-4 text-white">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4 text-white">${item.amount}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "paid"
                              ? "bg-green-400/10 text-green-400"
                              : item.status === "pending"
                              ? "bg-yellow-400/10 text-yellow-400"
                              : "bg-red-400/10 text-red-400"
                          }`}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDownloadInvoice(item.id)}
                          className="flex items-center gap-2 text-primary-purple-400 hover:text-primary-purple-300 transition-colors"
                        >
                          <Receipt className="w-4 h-4" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={isAddingCard}
        onClose={() => setIsAddingCard(false)}
        onAdd={handleAddCard}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BillingPage;
