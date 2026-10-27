import React from "react";
import { Building2, RefreshCw } from "lucide-react";
import CompanyTableRow from "./CompanyTableRow";

export const CompanyTable = ({
  companies,
  loading,
  error,
  selectedTenant,
  onRetry,
  onOpenAddModal,
}) => {
  if (loading) {
    return (
      <div className="flex-1 rounded-xl border border-slate-200/80 bg-white/60 backdrop-blur-md shadow-xs flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium text-xs">
          Fetching company databases...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 rounded-xl border border-red-200 bg-red-50/50 backdrop-blur-md shadow-xs flex flex-col items-center justify-center gap-2 p-6">
        <p className="text-red-600 font-medium text-sm">{error}</p>
        <button
          onClick={onRetry}
          className="px-3 py-1.5 mt-1 bg-white hover:bg-red-50 text-red-600 rounded-md text-xs font-bold transition-colors border border-red-200 shadow-xs cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!selectedTenant) {
    return (
      <div className="flex-1 rounded-xl border border-slate-200/80 bg-white/60 backdrop-blur-md shadow-xs flex items-center justify-center">
        <p className="text-slate-500 font-medium text-xs">
          Select an active tenant above to view synchronized companies.
        </p>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="flex-1 rounded-xl border border-slate-200/80 bg-white/60 backdrop-blur-md shadow-xs flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <Building2 className="w-5 h-5" />
        </div>
        <p className="text-slate-500 font-medium text-xs">
          No companies found for this tenant.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl overflow-hidden shadow-xs relative flex flex-col">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 sticky top-0 z-10 border-b border-slate-200/80 backdrop-blur-xs">
            <tr>
              <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider w-12 text-center">
                #
              </th>
              <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider w-36 text-center">
                Tally Status
              </th>
              <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider w-36 text-center">
                Sync Status
              </th>
              <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider w-36 text-right pr-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companies.map((company, idx) => (
              <CompanyTableRow
                key={company._id || company.id || company.guid || idx}
                company={company}
                onOpenAddModal={onOpenAddModal}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyTable;
