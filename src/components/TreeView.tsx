'use client';

import React, { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { RotateCcw } from 'lucide-react';

import EntityNode from './nodes/EntityNode';
import FlowEdge from './edges/FlowEdge';
import Dashboard from './Dashboard';
import { powerSectorNodes, powerSectorEdges, NodeData } from '../data/powerSectorData';
import calculateLayout, { calculateSymmetricLayout, LayoutNode } from '../utils/layout';

// ============================================================================
// CUSTOM NODE & EDGE TYPES
// ============================================================================

const nodeTypes = {
  customNode: EntityNode,
};

const edgeTypes = {
  default: FlowEdge,
};

// ============================================================================
// TREEVIEW COMPONENT
// ============================================================================

interface DrillPanelState {
  isOpen: boolean;
  nodeId: string | null;
  nodeData: NodeData | null;
}

const TreeView: React.FC = () => {
  const { fitView, getNode } = useReactFlow();

  // State for drill panel
  const [drillPanel, setDrillPanel] = useState<DrillPanelState>({
    isOpen: false,
    nodeId: null,
    nodeData: null,
  });

  // Layout mode state
  const [useSymmetricLayout, setUseSymmetricLayout] = useState(true);

  // Calculate layout for nodes
  const layoutedNodes = useMemo(() => {
    return calculateSymmetricLayout(powerSectorNodes as LayoutNode[], powerSectorEdges);
  }, []);

  // Initialize nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(powerSectorEdges);

  // Handle node click - open drill panel and pan to node
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<NodeData>) => {
      setDrillPanel({
        isOpen: true,
        nodeId: node.id,
        nodeData: node.data,
      });

      // Smoothly pan the camera to center the node
      if (getNode(node.id)) {
        fitView({
          nodes: [{ id: node.id }],
          padding: 0.5,
          duration: 800,
        });
      }
    },
    [fitView, getNode]
  );

  // Reset layout to symmetric pyramid
  const handleResetLayout = useCallback(() => {
    const newLayout = calculateSymmetricLayout(
      powerSectorNodes as LayoutNode[],
      powerSectorEdges
    );
    setNodes(newLayout);
    
    // Fit all nodes in view
    setTimeout(() => {
      fitView({
        padding: 0.2,
        duration: 600,
      });
    }, 100);
  }, [setNodes, fitView]);

  // Close drill panel
  const closeDrillPanel = () => {
    setDrillPanel({
      isOpen: false,
      nodeId: null,
      nodeData: null,
    });
  };

  // Get node color based on category for minimap
  const getNodeColor = (node: Node<NodeData>) => {
    switch (node.data?.category) {
      case 'government':
        return '#64748b';
      case 'generation':
        return '#0D9488';
      case 'transmission':
        return '#1E3A8A';
      case 'distribution':
        return '#D97706';
      case 'consumer':
        return '#7C3AED';
      case 'fuel':
        return '#DC2626';
      case 'regulator':
        return '#059669';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        {/* Blueprint-style background with dots */}
        <Background
          color="#334155"
          size={1}
          gap={40}
          variant={'dots' as any}
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
        />

        {/* Controls for zoom and fit view */}
        <Controls
          position="bottom-left"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
          }}
        />

        {/* MiniMap in bottom right */}
        <MiniMap
          position="bottom-right"
          nodeColor={getNodeColor}
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
          }}
          maskColor="rgba(0, 0, 0, 0.3)"
        />
      </ReactFlow>

      {/* Dashboard - Top Right */}
      <Dashboard />

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-10">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-white mb-1">
            Bangladesh Power Sector
          </h1>
          <p className="text-sm text-slate-300">
            Interactive Hierarchy Tree | Real-time Grid Operations & Distribution Network
          </p>
        </div>
      </div>

      {/* Reset Layout Button */}
      <button
        onClick={handleResetLayout}
        className="absolute top-32 left-8 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-lg z-20 border border-slate-600 hover:border-slate-500"
        title="Reset to pyramid layout"
      >
        <RotateCcw className="w-4 h-4" />
        Reset Layout
      </button>

      {/* Legend */}
      <div className="absolute top-32 left-8 ml-32 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4 shadow-lg z-20 max-w-xs">
        <h3 className="text-sm font-bold text-white mb-3">Entity Categories</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#64748b' }} />
            <span className="text-slate-300">Government & Policy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#059669' }} />
            <span className="text-slate-300">Regulator</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0D9488' }} />
            <span className="text-slate-300">Generation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#DC2626' }} />
            <span className="text-slate-300">Fuel Supply</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1E3A8A' }} />
            <span className="text-slate-300">Transmission</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#D97706' }} />
            <span className="text-slate-300">Distribution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#7C3AED' }} />
            <span className="text-slate-300">Consumer</span>
          </div>
        </div>
      </div>

      {/* Flow Types Legend */}
      <div className="absolute bottom-40 left-8 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4 shadow-lg z-20 max-w-xs">
        <h3 className="text-sm font-bold text-white mb-3">Flow Types</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-0.5"
              style={{
                backgroundColor: '#475569',
                opacity: 0.8,
              }}
            />
            <span className="text-slate-300">Power Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-0.5"
              style={{
                backgroundColor: '#22c55e',
                backgroundImage: 'repeating-linear-gradient(90deg, #22c55e 0px, #22c55e 5px, transparent 5px, transparent 10px)',
                opacity: 0.7,
              }}
            />
            <span className="text-slate-300">Subsidy Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-0.5"
              style={{
                backgroundColor: '#f59e0b',
                backgroundImage: 'repeating-linear-gradient(90deg, #f59e0b 0px, #f59e0b 8px, transparent 8px, transparent 12px)',
                opacity: 0.7,
              }}
            />
            <span className="text-slate-300">Fuel Supply</span>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute bottom-4 left-8 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg px-4 py-2 shadow-lg z-20 text-xs text-slate-300">
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> System
          Operational
        </span>
      </div>

      {/* Right Side Drill Panel */}
      <div
        className={`fixed right-0 top-0 h-screen w-96 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto ${
          drillPanel.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {drillPanel.isOpen && drillPanel.nodeData && (
          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={closeDrillPanel}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6 pr-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {drillPanel.nodeData.label}
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                  style={{
                    backgroundColor:
                      drillPanel.nodeData.category === 'government'
                        ? '#334155'
                        : drillPanel.nodeData.category === 'generation'
                          ? '#0d4437'
                          : drillPanel.nodeData.category === 'transmission'
                            ? '#0f1f3c'
                            : drillPanel.nodeData.category === 'distribution'
                              ? '#5a2e0f'
                              : drillPanel.nodeData.category === 'consumer'
                                ? '#3d1d54'
                                : drillPanel.nodeData.category === 'fuel'
                                  ? '#4a0e0e'
                                  : '#0d3d2c',
                    color: 'white',
                  }}
                >
                  {drillPanel.nodeData.category.charAt(0).toUpperCase() +
                    drillPanel.nodeData.category.slice(1)}
                </span>
                {drillPanel.nodeData.status === 'alert' && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-red-900 text-red-200 rounded-full">
                    ⚠️ Alert
                  </span>
                )}
                {drillPanel.nodeData.status === 'warning' && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-yellow-900 text-yellow-200 rounded-full">
                    ⚡ Warning
                  </span>
                )}
              </div>
            </div>

            {/* Main Metrics */}
            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <div className="text-slate-300 text-xs mb-2">Primary Metric</div>
              <div className="text-4xl font-mono font-bold text-white mb-1">
                {typeof drillPanel.nodeData.kpiValue === 'number'
                  ? drillPanel.nodeData.kpiValue.toLocaleString()
                  : drillPanel.nodeData.kpiValue}
              </div>
              <div className="text-sm text-slate-400">
                {drillPanel.nodeData.kpiUnit}
              </div>
            </div>

            {/* Description */}
            {drillPanel.nodeData.description && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-white mb-2">Description</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {drillPanel.nodeData.description}
                </p>
              </div>
            )}

            {/* Detailed Information */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white mb-3">Details</h3>
              <div className="space-y-3">
                <div className="bg-slate-700 bg-opacity-50 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Last Updated</div>
                  <div className="text-sm font-semibold text-white">
                    {drillPanel.nodeData.lastUpdated || 'Real-time'}
                  </div>
                </div>
                <div className="bg-slate-700 bg-opacity-50 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Status</div>
                  <div className="text-sm font-semibold text-white capitalize">
                    {drillPanel.nodeData.status || 'Normal'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button className="w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                View Historical Data
              </button>
              <button className="w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                Generate Report
              </button>
              <button className="w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                Set Alerts
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions Overlay (initially shown) */}
      {!drillPanel.isOpen && (
        <div className="absolute bottom-8 right-8 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg z-20 max-w-sm text-xs text-slate-300">
          <p className="font-semibold text-white mb-2">💡 Interactive Tips</p>
          <ul className="space-y-1">
            <li>• Click any node to view detailed information</li>
            <li>• Drag nodes to rearrange them freely</li>
            <li>• Use &quot;Reset Layout&quot; to return to pyramid view</li>
            <li>• Scroll to zoom in/out</li>
            <li>• Drag canvas to pan around</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default TreeView;
