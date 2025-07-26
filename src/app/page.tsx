import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Dashboard />
    </main>
  );
}

export const metadata = {
  title: 'OOS Copilot - Out of Stock Management',
  description: 'AI-driven Out-of-Stock monitoring and management system',
};
