"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Code2,
  Server,
  Database,
  Boxes,
  ArrowLeft,
  ArrowRight,
  Wand2,
} from "lucide-react";
import SettingsHeader from "@/components/settings/SettingsHeader";
import { categories } from "./config/templateConfig";
import { CategoryConfig } from "./types/templates";

const iconMap = {
  frontend: Code2,
  backend: Server,
  fullstack: Boxes,
  database: Database,
};

const TemplatesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("category") || null;

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const renderTemplateCard = (templateId: string, category: CategoryConfig) => {
    const CategoryIcon = iconMap[category.id as keyof typeof iconMap];
    return (
      <div
        key={templateId}
        onClick={() => router.push(`/templates/template?name=${templateId}`)}
        className="group rounded-xl border border-white/[0.08] bg-surface-hover p-6 hover:border-primary-purple-400 transition-colors cursor-pointer"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`p-3 rounded-lg bg-gradient-to-br ${category.color}`}
            >
              <CategoryIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {templateId}
            </h3>
            <p className="text-sm text-gray-400">
              {/* Add template description from config */}
            </p>
          </div>
          <div className="mt-auto pt-4">
            <div className="text-sm text-primary-purple-400 group-hover:text-primary-purple-500 flex items-center gap-2">
              Use Template
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryCard = (category: CategoryConfig) => {
    const Icon = iconMap[category.id as keyof typeof iconMap];
    return (
      <div
        key={category.id}
        onClick={() => router.push(`templates?category=${category.id}`)}
        className="group rounded-xl border border-white/[0.08] bg-surface-hover p-6 hover:border-primary-purple-400 transition-colors cursor-pointer"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`p-3 rounded-lg bg-gradient-to-br ${category.color}`}
            >
              {Icon && <Icon className="w-6 h-6 text-white" />}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {category.name}
            </h3>
            <p className="text-sm text-gray-400">{category.description}</p>
          </div>
          <div className="mt-auto pt-4">
            <div className="text-sm text-primary-purple-400 group-hover:text-primary-purple-500 flex items-center gap-2">
              View Templates
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCustomWorkspaceCard = () => (
    <div
      onClick={() => router.push("/templates/template?name=custom")}
      className="group relative rounded-xl border-2 border-dashed border-white/[0.15] bg-white/[0.02] p-6 hover:border-primary-purple-400 transition-colors cursor-pointer"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary-purple-400 to-primary-purple-600">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Custom Workspace
          </h3>
          <p className="text-sm text-gray-400">
            Start from scratch with complete control
          </p>
        </div>
        <div className="mt-auto pt-4">
          <div className="text-sm text-primary-purple-400 group-hover:text-primary-purple-500 flex items-center gap-2">
            Start from Scratch
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <SettingsHeader
        breadcrumbs={
          selectedCategory
            ? [
                { title: "Templates", href: "/templates" },
                { title: selectedCategory.name },
              ]
            : [{ title: "Templates", href: "/templates" }]
        }
      />

      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                {selectedCategory ? selectedCategory.name : "Choose a Category"}
              </h1>
              <p className="mt-1 text-base text-gray-400">
                {selectedCategory
                  ? selectedCategory.description
                  : "Select a category to start building your workspace"}
              </p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => router.push("/templates")}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All Categories
              </button>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-6 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCategory
              ? selectedCategory.templateIds.map((templateId) =>
                  renderTemplateCard(templateId, selectedCategory)
                )
              : categories.map(renderCategoryCard)}
            {!selectedCategory && renderCustomWorkspaceCard()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
