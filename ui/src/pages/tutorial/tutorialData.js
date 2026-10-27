import { Building2, Clock, Bell } from "lucide-react";

export const TUTORIAL_STEPS = [
  {
    id: 1,
    shortTitle: "Sync Initialization",
    badge: "Step 1 of 3 • Company Added",
    title: "Company Sync Queued & License Check",
    description:
      "Thank you for adding the company. Your data sync should start approximately in a minute. Please ensure an active Tally License is available as it is required to perform data synchronization.",
    icon: Building2,
    accentColor: "indigo",
    details: [
      "Valid Tally License Required: An active Tally License (Single-user Silver or Multi-user Gold) is required. Educational mode cannot sync full accounting data.",
      "Company connection details established with local Tally Prime / ERP 9 instance.",
      "Initial handshake and license validation with the cloud server takes ~60 seconds.",
      "You can monitor live synchronization status anytime from the Sync menu.",
    ],
  },
  {
    id: 2,
    shortTitle: "Sync Duration",
    badge: "Step 2 of 3 • Data Processing",
    title: "Data Sync Processing Window",
    description:
      "Depending on the data size, it may take 15 - 45 mins for the sync to complete.",
    icon: Clock,
    accentColor: "amber",
    details: [
      "Vouchers, ledgers, and stock items are extracted in parallel batches.",
      "Larger databases with multi-year transactions require up to 45 minutes.",
      "The bridge client runs smoothly in the background without affecting Tally performance.",
    ],
  },
  {
    id: 3,
    shortTitle: "Completion Alert",
    badge: "Step 3 of 3 • Notification",
    title: "Sync Completion Pop-up",
    description:
      "After the sync is complete, you will get a Pop-up notifying the sync process has completed.",
    icon: Bell,
    accentColor: "emerald",
    details: [
      "A system pop-up notification will appear on your desktop instantly.",
      "Summary report will detail total records synced and timestamp.",
      "Your company dashboard will automatically reflect updated figures.",
    ],
  },
];

export const TUTORIAL_FAQS = [
  {
    q: "Is a Tally License required to sync company data?",
    a: "Yes. An active Tally License (Silver or Gold Edition) is required for Tally Bridge to connect and synchronize complete data. Educational Mode limits XML data extraction.",
  },
  {
    q: "How do I know if my Tally software is connected?",
    a: "Look at the 'Bridge Active' badge on the sidebar. If green, Tally Bridge is actively communicating with your Tally Prime/ERP 9 XML server port.",
  },
  {
    q: "Can I use Tally while the sync is running?",
    a: "Yes! Tally Bridge performs read-only XML requests in low-priority background threads so your daily voucher entry remains fast and uninterrupted.",
  },
  {
    q: "What happens if my internet connection drops during sync?",
    a: "Tally Bridge automatically pauses the queue and resumes from the last successfully synced batch once your connection is restored.",
  },
  {
    q: "Where do I check detailed sync logs?",
    a: "Navigate to the 'Synchronization Pipeline' tab in the left sidebar menu to view module-wise real-time sync progress and status indicators.",
  },
];
