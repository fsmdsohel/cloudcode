import React from "react";
import { IFeatureCard } from "@/types/app";

const FeatureCard = ({ icon: Icon, title, description }: IFeatureCard) => {
  return (
    <div className="h-full p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-purple-600 dark:text-purple-500" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 flex-grow">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
