import React, { useState } from "react";
import { HelpCircle, ChevronRight } from "lucide-react";
import { TUTORIAL_FAQS } from "../tutorialData";

export const FaqTab = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="w-5 h-5 text-indigo-600" />
        <h2 className="text-base font-bold text-slate-900">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-3">
        {TUTORIAL_FAQS.map((faq, index) => {
          const isOpen = expandedFaq === index;
          return (
            <div
              key={index}
              className="border border-slate-200/80 rounded-xl overflow-hidden bg-white transition-all"
            >
              <button
                onClick={() => setExpandedFaq(isOpen ? null : index)}
                className="w-full text-left p-4 text-xs font-bold text-slate-800 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    isOpen ? "rotate-90 text-indigo-600" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/40">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqTab;
