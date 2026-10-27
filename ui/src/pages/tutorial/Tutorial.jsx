import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { TUTORIAL_STEPS } from "./tutorialData";
import SyncWalkthroughTab from "./components/SyncWalkthroughTab";
import FaqTab from "./components/FaqTab";

export default function Tutorial() {
  const [activeTab, setActiveTab] = useState("sync-guide"); // 'sync-guide' | 'faqs'
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  // Desktop Keyboard Shortcut Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName))
        return;
      if (activeTab !== "sync-guide") return;

      if (e.key === "ArrowRight") {
        if (currentStep < TUTORIAL_STEPS.length) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsCompleted(true);
        }
      } else if (e.key === "ArrowLeft") {
        if (currentStep > 1) {
          setCurrentStep((prev) => prev - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, activeTab]);

  return (
    <div className="flex flex-col gap-6 h-full max-h-full overflow-y-auto max-w-5xl mx-auto pb-12 pr-1 custom-scrollbar">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            User Tutorial & Guides
          </h1>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap mt-0.5">
            <span>
              Learn how Tally Bridge handles company onboarding, background
              synchronization, and notifications.
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono bg-slate-200/60 border border-slate-300/60 px-2 py-0.5 rounded text-slate-600 font-semibold select-none">
              Press <kbd className="font-sans font-bold">←</kbd>{" "}
              <kbd className="font-sans font-bold">→</kbd> arrow keys to
              navigate
            </span>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("sync-guide")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "sync-guide"
                ? "bg-white text-indigo-600 shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Company Sync Walkthrough
          </button>
          <button
            onClick={() => setActiveTab("faqs")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "faqs"
                ? "bg-white text-indigo-600 shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            FAQs & Help
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "sync-guide" ? (
        <SyncWalkthroughTab
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
        />
      ) : (
        <FaqTab />
      )}
    </div>
  );
}
