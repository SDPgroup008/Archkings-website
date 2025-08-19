// app/admin/page.tsx
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  return <AdminDashboard />;
}

export const dynamic = "force-dynamic"; // Prevent SSG, force client-side rendering