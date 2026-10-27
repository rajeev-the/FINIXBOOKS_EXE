import React from "react";
import {
  Check,
  Zap,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { TUTORIAL_STEPS } from "../tutorialData";
import StepPreviewCard from "./StepPreviewCard";

export const SyncWalkthroughTab = ({
  currentStep,
  setCurrentStep,
  isCompleted,
  setIsCompleted,
}) => {
  const steps = TUTORIAL_STEPS;
  const activeStepObj = steps[currentStep - 1];
  const StepIcon = activeStepObj.icon;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setIsCompleted(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stepper Header Bar */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 md:p-6 shadow-xs">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full z-0" />
          <div
            className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full z-0 transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 85}%`,
            }}
          />

          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isPassed = currentStep > step.id;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-4 ring-indigo-50 scale-105"
                      : isPassed
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-white text-slate-400 border border-slate-200 group-hover:border-slate-300"
                  }`}
                >
                  {isPassed ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-[11px] font-semibold tracking-tight transition-colors hidden sm:block ${
                    isActive
                      ? "text-indigo-600 font-bold"
                      : isPassed
                      ? "text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  {step.shortTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Content Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[380px] relative overflow-hidden transition-all duration-300">
        <div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              {activeStepObj.badge}
            </span>

            <span className="text-xs text-slate-400 font-medium">
              {currentStep} of {steps.length} Steps
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs">
              <StepIcon className="w-5 h-5 text-indigo-600" />
            </div>
            {activeStepObj.title}
          </h2>

          <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-slate-200/90 mb-6 shadow-2xs">
            <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
              "{activeStepObj.description}"
            </p>
          </div>

          <StepPreviewCard
            currentStep={currentStep}
            activeStepObj={activeStepObj}
          />
        </div>

        {/* Bottom Controls Bar */}
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between gap-4 mt-auto">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {isCompleted ? (
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-98"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restart Walkthrough
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-98"
              >
                {currentStep === steps.length ? (
                  <>
                    <span>Finish & Got It</span>
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncWalkthroughTab;
