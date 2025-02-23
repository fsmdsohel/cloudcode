import React from "react";
import { Check } from "lucide-react";
import { IPricingCard } from "@/types/app";
import Link from "next/link";

interface PricingCardProps extends IPricingCard {
  isCurrentPlan?: boolean;
  showPopularBadge?: boolean;
}

const PricingCard = ({
  title,
  price,
  features,
  highlight = false,
  isCurrentPlan = false,
  showPopularBadge = true,
}: PricingCardProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Popular Badge - Only show in landing page */}
      {highlight && showPopularBadge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-primary-blue-400 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className="text-white/60">/month</span>
        </div>
      </div>

      {/* Features List */}
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <Check
              className={`w-5 h-5 flex-shrink-0 ${
                highlight ? "text-primary-blue-400" : "text-primary-purple-400"
              }`}
            />
            <span className="text-white/80">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <div className="mt-auto">
        <Link
          href={isCurrentPlan ? "/settings/billing" : "/auth/register"}
          className={`
            block w-full py-3 px-6 rounded-xl text-center font-medium 
            transition-all duration-300 hover:scale-105
            ${
              isCurrentPlan
                ? "bg-surface-hover text-white/60 cursor-not-allowed"
                : highlight
                ? "bg-primary-blue-400 hover:bg-primary-blue-500 text-white shadow-glow-blue"
                : "bg-surface-card hover:bg-surface-hover text-white/80 border border-white/[0.08]"
            }
          `}
        >
          {isCurrentPlan ? "Current Plan" : "Get Started"}
        </Link>
      </div>
    </div>
  );
};

export default PricingCard;
