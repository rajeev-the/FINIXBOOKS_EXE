import {
  FileText,
  Users,
  Receipt,
  Boxes,
  Layers,
  FolderTree,
  Warehouse,
  Ruler,
  Landmark,
  TrendingUp,
  ShoppingCart,
  Scale,
  ArrowDownLeft,
  ArrowUpRight,
  Server,
  Database,
  DollarSign,
  Package,
  MapPin,
} from "lucide-react";

export const ENTITIES_CONFIG = [
  { key: "ledgers", label: "Ledgers", icon: FileText, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { key: "groups", label: "Groups", icon: Users, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { key: "vouchers", label: "Vouchers", icon: Receipt, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { key: "stockItems", label: "Stock Items", icon: Boxes, color: "text-amber-600 bg-amber-50 border-amber-200" },
  { key: "stockGroups", label: "Stock Groups", icon: Layers, color: "text-orange-600 bg-orange-50 border-orange-200" },
  { key: "stockCategories", label: "Stock Categories", icon: FolderTree, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  { key: "godowns", label: "Godowns", icon: Warehouse, color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
  { key: "units", label: "Units", icon: Ruler, color: "text-purple-600 bg-purple-50 border-purple-200" },
  { key: "costCentres", label: "Cost Centres", icon: Landmark, color: "text-rose-600 bg-rose-50 border-rose-200" },
];

export const INITIAL_SYNC_STATS = {
  ledgers: { count: 0, status: "pending", currentBatch: 0, totalBatches: 0, batchDates: "", phase: "idle", savedCount: 0 },
  groups: { count: 0, status: "pending" },
  vouchers: { count: 0, status: "pending", currentBatch: 0, totalBatches: 0, batchDates: "" },
  stockItems: { count: 0, status: "pending" },
  stockGroups: { count: 0, status: "pending" },
  stockCategories: { count: 0, status: "pending" },
  godowns: { count: 0, status: "pending" },
  units: { count: 0, status: "pending" },
  costCentres: { count: 0, status: "pending" },
};

export const SYNC_MODULES = [
  {
    name: "Companies",
    endpoint: "companies",
    icon: Server,
  },
  {
    name: "Groups",
    endpoint: "groups",
    icon: Users,
  },
  {
    name: "Ledgers",
    endpoint: "ledgers",
    icon: Database,
  },
  {
    name: "Vouchers",
    endpoint: "vouchers",
    icon: FileText,
  },
  {
    name: "Bills",
    endpoint: "bills",
    icon: DollarSign,
  },
  {
    name: "Stock Groups",
    endpoint: "stock-groups",
    icon: Layers,
  },
  {
    name: "Godowns",
    endpoint: "godowns",
    icon: MapPin,
  },
  {
    name: "Units",
    endpoint: "units",
    icon: Scale,
  },
  {
    name: "Cost Centers",
    endpoint: "cost-centres",
    icon: Package,
  },
];
