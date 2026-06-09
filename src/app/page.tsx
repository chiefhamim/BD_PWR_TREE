'use client';

import { ReactFlowProvider } from 'reactflow';
import TreeView from '@/components/TreeView';
import Link from 'next/link';

export default function Home() {
  return (
    <ReactFlowProvider>
      <TreeView />
      <div className="absolute top-4 right-4 z-50">
        <Link
          href="/admin"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Admin Panel
        </Link>
      </div>
    </ReactFlowProvider>
  );
}
