import { Activity, Database, Key, Sliders } from "lucide-react";

const Settings = () => {
  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
          <Sliders className="w-5 h-5 text-indigo-600" />
          System Configuration
        </h1>
        <p className="text-slate-500 text-xs">
          Manage database bindings, local Tally port integration, and security hooks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-5 rounded-xl shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-105 transition-transform">
              <Database className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Database Connection
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Manage database connection URIs, pooling limits, and host configurations
            </p>
          </div>
          <span className="mt-4 text-[11px] font-semibold text-indigo-600 group-hover:underline inline-flex items-center gap-1">
            Configure URIs &rarr;
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-5 rounded-xl shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-105 transition-transform">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Tally XML Port
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Configure local Tally.exe XML server 9000 port binding and request timeouts
            </p>
          </div>
          <span className="mt-4 text-[11px] font-semibold text-indigo-600 group-hover:underline inline-flex items-center gap-1">
            Port Settings &rarr;
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-5 rounded-xl shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-105 transition-transform">
              <Key className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Security Hooks
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Configure JWT access token secrets, refresh tokens, and encryption keys
            </p>
          </div>
          <span className="mt-4 text-[11px] font-semibold text-indigo-600 group-hover:underline inline-flex items-center gap-1">
            Security Keys &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};

export default Settings;

