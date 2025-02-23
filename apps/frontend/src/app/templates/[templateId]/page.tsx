"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Code2,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import SettingsHeader from "@/components/settings/SettingsHeader";
import { templates, languageConfigs } from "../config/templateConfig";
import { Template } from "../types/templates";

interface StepConfig {
  number: number;
  title: string;
}

const STEPS: StepConfig[] = [
  { number: 1, title: "Project Details" },
  { number: 2, title: "Language" },
  { number: 3, title: "Libraries" },
];

const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#020817] flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
  </div>
);

const TemplatePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>([]);
  const [template, setTemplate] = useState<Template | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const templateName = searchParams.get("name");
  const isCustomWorkspace = templateName === "custom";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
    if (templateName && templates[templateName]) {
      setTemplate(templates[templateName]);
    } else if (templateName !== "custom") {
      router.push("/dashboard");
    }
  }, [templateName, router]);

  const handleLibraryToggle = (libraryId: string) => {
    setSelectedLibraries((prev) =>
      prev.includes(libraryId)
        ? prev.filter((id) => id !== libraryId)
        : [...prev, libraryId]
    );
  };

  if (!isMounted) {
    return <LoadingSpinner />;
  }

  // For non-custom workspaces, ensure we have a template
  if (!isCustomWorkspace && !template) {
    return <LoadingSpinner />;
  }

  // At this point, we know we either have a valid template or it's a custom workspace
  const templateData = (
    isCustomWorkspace ? templates.custom : template
  ) as Template;

  return (
    <div className="min-h-screen">
      <SettingsHeader
        breadcrumbs={[
          { title: "Templates", href: "/templates" },
          { title: isCustomWorkspace ? "Custom Workspace" : templateData.name },
        ]}
      />

      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 py-8 border-b border-gray-800/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                {isCustomWorkspace
                  ? "Create Custom Workspace"
                  : templateData.name}
              </h1>
              <p className="mt-1 text-base text-gray-400">
                {isCustomWorkspace
                  ? "Start with a blank workspace"
                  : "Configure your workspace settings"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-3xl">
            {!isCustomWorkspace && (
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  {STEPS.map((step, index) => (
                    <React.Fragment key={step.number}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center justify-center w-7 h-7 rounded-lg ${
                            currentStep >= step.number
                              ? "bg-primary-purple-400 text-white"
                              : "bg-surface-hover text-gray-400"
                          } text-sm transition-colors duration-300`}
                        >
                          {currentStep > step.number ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            step.number
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-400">
                          {step.title}
                        </span>
                      </div>
                      {index < STEPS.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="bg-surface-card border border-white/[0.08] rounded-xl divide-y divide-white/[0.08]">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white">
                    {STEPS[currentStep - 1].title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {currentStep === 1
                      ? "Configure your project settings"
                      : currentStep === 2
                      ? "Choose your primary programming language"
                      : "Select additional libraries and tools"}
                  </p>
                </div>

                <div className="p-6">
                  {isCustomWorkspace ? (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-semibold text-white mb-2">
                          Create Custom Workspace
                          <span className="text-gray-400 text-lg block mt-1 font-normal">
                            Start with a blank workspace and customize as needed
                          </span>
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Workspace name
                          </label>
                          <input
                            type="text"
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                            placeholder="my-workspace"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Description
                          </label>
                          <textarea
                            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                            rows={3}
                            placeholder="Brief description of your workspace"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {currentStep === 1 && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold text-white mb-6">
                            Project Details
                          </h2>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Project name
                              </label>
                              <input
                                type="text"
                                value={workspaceName}
                                onChange={(e) =>
                                  setWorkspaceName(e.target.value)
                                }
                                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                                placeholder="my-awesome-project"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Description
                              </label>
                              <textarea
                                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                                rows={3}
                                placeholder="Brief description of your project"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold text-white">
                            Select Language
                            <span className="text-gray-400 text-lg block mt-1 font-normal">
                              Choose your primary programming language for{" "}
                              {templateData.name}
                            </span>
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {templateData.languages.map((lang) => (
                              <button
                                key={lang}
                                onClick={() => setSelectedLanguage(lang)}
                                className={`group p-6 rounded-xl border transition-all duration-300 
                                  ${
                                    selectedLanguage === lang
                                      ? "border-purple-500/50 bg-purple-500/5 hover:bg-purple-500/10"
                                      : "border-gray-800 hover:border-gray-700 hover:bg-gray-800/50"
                                  }  hover:scale-[1.02] relative overflow-hidden`}
                              >
                                <div className="flex items-center gap-4">
                                  <Code2
                                    className={`w-6 h-6 ${
                                      languageConfigs[lang]?.color ||
                                      "text-gray-400"
                                    }`}
                                  />
                                  <div className="text-left">
                                    <h3 className="text-lg font-semibold text-white">
                                      {languageConfigs[lang]?.name ||
                                        lang.charAt(0).toUpperCase() +
                                          lang.slice(1)}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                      {languageConfigs[lang]?.description ||
                                        "Programming language"}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold text-white">
                            Add Libraries
                            <span className="text-gray-400 text-lg block mt-1 font-normal">
                              Enhance your {templateData.name} workspace with
                              additional tools
                            </span>
                          </h2>

                          <div className="flex items-center justify-between px-1">
                            <span className="text-sm text-gray-400">
                              {selectedLibraries.length} libraries selected
                            </span>
                            {selectedLibraries.length > 0 && (
                              <button
                                onClick={() => setSelectedLibraries([])}
                                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                              >
                                Clear all
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {templateData.libraries.map((library) => (
                              <button
                                key={library.id}
                                onClick={() => handleLibraryToggle(library.id)}
                                className={`group p-6 rounded-xl border transition-all duration-300 
                                ${
                                  selectedLibraries.includes(library.id)
                                    ? "border-purple-500/50 bg-purple-500/5 hover:bg-purple-500/10"
                                    : "border-gray-800 hover:border-gray-700 hover:bg-gray-800/50"
                                }
                                hover:scale-[1.02] relative overflow-hidden`}
                              >
                                <div
                                  className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent 
                                  transition-opacity duration-300
                                  ${
                                    selectedLibraries.includes(library.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />

                                <div className="relative flex items-start gap-4">
                                  <div
                                    className={`w-5 h-5 rounded-md border-2 transition-all duration-300 
                                    flex items-center justify-center flex-shrink-0 mt-1
                                    ${
                                      selectedLibraries.includes(library.id)
                                        ? "border-purple-500 bg-purple-500"
                                        : "border-gray-600 group-hover:border-gray-500"
                                    }`}
                                  >
                                    <CheckCircle2
                                      className={`w-4 h-4 transition-all duration-300
                                      ${
                                        selectedLibraries.includes(library.id)
                                          ? "text-white scale-100"
                                          : "scale-0"
                                      }`}
                                    />
                                  </div>

                                  <div className="text-left flex-grow">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-medium text-white">
                                        {library.name}
                                      </h3>
                                      {library.recommended && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                                          Recommended
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">
                                      {library.description}
                                    </p>
                                    {library.version && (
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                                          v{library.version}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="bg-surface-card border border-white/[0.08] rounded-xl">
                <div className="px-6 py-4 flex items-center justify-between">
                  {!isCustomWorkspace && currentStep > 1 ? (
                    <button
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous Step
                    </button>
                  ) : (
                    <div />
                  )}
                  {!isCustomWorkspace && currentStep < 3 ? (
                    <button
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-purple-400 text-white rounded-lg hover:bg-primary-purple-500 transition-colors"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/workspaces/new`)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-purple-400 text-white rounded-lg hover:bg-primary-purple-500 transition-colors"
                    >
                      Create Workspace
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePage;
