'use client';

import { ReactFlowProvider } from 'reactflow';
import TreeView from '@/components/TreeView';

export default function Home() {
  return (
    <ReactFlowProvider>
      <TreeView />
    </ReactFlowProvider>
  );
}
