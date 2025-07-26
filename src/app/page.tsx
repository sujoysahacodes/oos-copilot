export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 OOS Copilot</h1>
      <p>Welcome to the Out-of-Stock Management System!</p>
      <p>Production deployment is working correctly.</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Status: ✅ Production Deployment Successful</h3>
        <p>The Next.js application is running properly on Vercel.</p>
        <p>Full dashboard will be restored shortly.</p>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'OOS Copilot - Out of Stock Management',
  description: 'AI-driven Out-of-Stock monitoring and management system',
};
