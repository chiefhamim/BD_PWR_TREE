'use client'

import React, { useCallback, useState, useEffect, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  NodeMouseHandler,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { RotateCcw, Loader } from 'lucide-react'

import EntityNode from './nodes/EntityNode'
import FlowEdge from './edges/FlowEdge'
import Dashboard from './Dashboard'
import { fetchAllNodes, overrideNodeCoordinates, NodeData } from '@/lib/api'
import { calculateSymmetricLayout, LayoutNode, snapToGrid } from '@/utils/layout'

const nodeTypes = {
  customNode: EntityNode,
}

const edgeTypes = {
  default: FlowEdge,
}

interface DrillPanelState {
  isOpen: boolean
  nodeId: string | null
  nodeData: NodeData | null
}

const GRID_SIZE = 100

const TreeView: React.FC = () => {
  const { fitView, getNode } = useReactFlow()
  const [drillPanel, setDrillPanel] = useState<DrillPanelState>({
    isOpen: false,
    nodeId: null,
    nodeData: null,
  })
  const [loading, setLoading] = useState(true)
  const [apiNodes, setApiNodes] = useState<NodeData[]>([])
  const [isPanning, setIsPanning] = useState(false)

  // Fetch nodes from API on mount
  useEffect(() => {
    const loadNodes = async () => {
      setLoading(true)
      try {
        console.log('TreeView: Fetching nodes...')
        const data = await fetchAllNodes()
        console.log('TreeView: Got nodes:', data?.length || 0)
        setApiNodes(data || [])
      } catch (error) {
        console.error('TreeView: Failed to load nodes:', error)
      } finally {
        setLoading(false)
      }
    }
    loadNodes()
  }, [])

  // Convert API nodes to ReactFlow nodes and build edges from hierarchy
  const { rfNodes, rfEdges } = useMemo(() => {
    if (apiNodes.length === 0) {
      return { rfNodes: [], rfEdges: [] }
    }

    // Build hierarchy map
    const childrenMap = new Map<string, string[]>()
    const parentMap = new Map<string, string>()

    apiNodes.forEach((node) => {
      if (!childrenMap.has(node.id)) {
        childrenMap.set(node.id, [])
      }
      if (node.parentId) {
        if (!childrenMap.has(node.parentId)) {
          childrenMap.set(node.parentId, [])
        }
        childrenMap.get(node.parentId)!.push(node.id)
        parentMap.set(node.id, node.parentId)
      }
    })

    // Find root nodes
    const rootNodes = apiNodes.filter((n) => !parentMap.has(n.id))
    console.log('Layout: Root nodes:', rootNodes.map(r => r.id), 'Total nodes:', apiNodes.length)

    // Hierarchical tree layout with golden ratio spacing - children centered under parents
    const layoutMap = new Map<string, { x: number; y: number }>()
    const blockSize = 200
    const goldenRatio = 1.618
    const blockGap = blockSize / goldenRatio  // ≈ 123.6px golden ratio spacing
    const verticalGap = blockGap  // Same spacing vertically

    // Calculate subtree width (how much horizontal space a node and all its descendants need)
    const getSubtreeWidth = (nodeId: string): number => {
      const children = childrenMap.get(nodeId) || []
      if (children.length === 0) {
        return blockSize
      }

      const childrenWidths = children.map(childId => getSubtreeWidth(childId))
      const totalChildrenWidth = childrenWidths.reduce((a, b) => a + b, 0)
      const gapsBetweenChildren = (children.length - 1) * blockGap
      const totalWidth = totalChildrenWidth + gapsBetweenChildren

      return Math.max(blockSize, totalWidth)
    }

    // Position nodes recursively - children centered under parent
    const layoutNode = (nodeId: string, x: number, y: number): void => {
      layoutMap.set(nodeId, { x, y })

      const children = childrenMap.get(nodeId) || []
      if (children.length === 0) return

      // Calculate positions for children
      const childrenWidths = children.map(childId => getSubtreeWidth(childId))
      const totalChildrenWidth = childrenWidths.reduce((a, b) => a + b, 0)
      const gapsBetweenChildren = (children.length - 1) * blockGap
      const totalRowWidth = totalChildrenWidth + gapsBetweenChildren

      // Position children in a row, centered under parent
      let childX = x - totalRowWidth / 2 + childrenWidths[0] / 2

      children.forEach((childId, index) => {
        const childY = y + blockSize + verticalGap
        layoutNode(childId, childX, childY)

        if (index < children.length - 1) {
          childX += childrenWidths[index] + blockGap + childrenWidths[index + 1] / 2 - childrenWidths[index] / 2
        }
      })
    }

    // Layout all root nodes and their trees
    const rootNodesList = Array.from(rootNodes)
    if (rootNodesList.length > 0) {
      const rootWidths = rootNodesList.map(r => getSubtreeWidth(r.id))
      const totalRootWidth = rootWidths.reduce((a, b) => a + b, 0)
      const rootGaps = (rootNodesList.length - 1) * blockGap
      const totalRootRowWidth = totalRootWidth + rootGaps

      let rootX = -totalRootRowWidth / 2 + rootWidths[0] / 2
      rootNodesList.forEach((root, index) => {
        layoutNode(root.id, rootX, 0)

        if (index < rootNodesList.length - 1) {
          rootX += rootWidths[index] + blockGap + rootWidths[index + 1] / 2 - rootWidths[index] / 2
        }
      })
    }

    // Convert to ReactFlow nodes
    const rfNodes: Node<NodeData>[] = apiNodes.map((node) => {
      const position = layoutMap.get(node.id) || { x: 0, y: 0 }
      // Snap to grid
      const snappedPos = snapToGrid(position.x, position.y, GRID_SIZE)

      if (apiNodes.length <= 10) {
        console.log(`Node ${node.id}: y=${snappedPos.y}, parent=${node.parentId || 'ROOT'}`)
      }

      return {
        id: node.id,
        type: 'customNode',
        data: node,
        position: snappedPos,
        draggable: true,
      }
    })

    // Build edges from hierarchy with parent node colors
    const nodeColorMap = new Map<string, string>()
    apiNodes.forEach(node => {
      nodeColorMap.set(node.id, node.nodeColor || '#94a3b8')
    })

    const rfEdges: Edge[] = apiNodes
      .filter((node) => node.parentId)
      .map((node) => ({
        id: `${node.parentId}-${node.id}`,
        source: node.parentId!,
        target: node.id,
        data: {
          nodeColor: nodeColorMap.get(node.parentId!) || '#94a3b8',
        }
      }))

    return { rfNodes, rfEdges }
  }, [apiNodes])

  // Initialize nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges)

  // Update nodes and edges when layout changes
  useEffect(() => {
    console.log('TreeView: Updating state with', rfNodes.length, 'nodes and', rfEdges.length, 'edges')
    setNodes(rfNodes)
    setEdges(rfEdges)
  }, [rfNodes, rfEdges, setNodes, setEdges])

  // Handle node drag end - snap to grid
  const handleNodeDragStop = useCallback(
    async (event: React.MouseEvent, node: Node<NodeData>) => {
      const snappedPos = snapToGrid(node.position.x, node.position.y, GRID_SIZE)

      // Update local state
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, position: snappedPos }
            : n
        )
      )

      // Persist to backend if position changed
      if (node.position.x !== snappedPos.x || node.position.y !== snappedPos.y) {
        await overrideNodeCoordinates(node.id, snappedPos.x, snappedPos.y)
      }
    },
    [setNodes]
  )

  // Handle node click
  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      setDrillPanel({
        isOpen: true,
        nodeId: node.id,
        nodeData: node.data as NodeData,
      })

      if (getNode(node.id)) {
        fitView({
          nodes: [{ id: node.id }],
          padding: 0.5,
          duration: 800,
        })
      }
    },
    [fitView, getNode]
  )

  const handleResetLayout = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const apiNode = apiNodes.find((n) => n.id === node.id)
        if (!apiNode?.useManualOverride && apiNode?.manualX !== undefined) {
          return {
            ...node,
            position: snapToGrid(apiNode.x || 0, apiNode.y || 0, GRID_SIZE),
          }
        }
        return node
      })
    )

    setTimeout(() => {
      fitView({
        padding: 0.2,
        duration: 600,
      })
    }, 100)
  }, [setNodes, fitView, apiNodes])

  const closeDrillPanel = () => {
    setDrillPanel({
      isOpen: false,
      nodeId: null,
      nodeData: null,
    })
  }

  const getNodeColor = (node: Node<NodeData>) => {
    const data = node.data as NodeData
    switch (data?.category) {
      case 'government':
        return '#64748b'
      case 'generation':
        return '#0D9488'
      case 'transmission':
        return '#1E3A8A'
      case 'distribution':
        return '#D97706'
      case 'consumer':
        return '#7C3AED'
      case 'fuel':
        return '#DC2626'
      case 'regulator':
        return '#059669'
      default:
        return '#94a3b8'
    }
  }

  if (loading) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading Power Sector Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeDragStop={handleNodeDragStop}
        onMoveStart={() => setIsPanning(true)}
        onMoveEnd={() => setIsPanning(false)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background
          color="transparent"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)' }}
        />

        <Controls
          position="bottom-left"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
          }}
        />

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

      <div style={{ opacity: isPanning ? 0 : 1, transition: 'opacity 0s', pointerEvents: isPanning ? 'none' : 'auto' }}>
        <Dashboard />
      </div>

      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-10" style={{ opacity: isPanning ? 0 : 1, transition: 'opacity 0s' }}>
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-white mb-1">
            Bangladesh Power Sector
          </h1>
          <p className="text-sm text-slate-300">
            Interactive Hierarchy Tree | Real-time Grid Operations & Distribution Network
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {nodes.length} nodes • Drag to move (snaps to grid) • Click to view details
          </p>
        </div>
      </div>

      <button
        onClick={handleResetLayout}
        className="absolute top-32 left-8 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-lg z-20 border border-slate-600 hover:border-slate-500"
        title="Reset to hierarchical layout"
        style={{ opacity: isPanning ? 0 : 1, transition: 'opacity 0s', pointerEvents: isPanning ? 'none' : 'auto' }}
      >
        <RotateCcw className="w-4 h-4" />
        Reset Layout
      </button>

      <div className="absolute top-32 left-8 ml-32 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4 shadow-lg z-20 max-w-xs" style={{ opacity: isPanning ? 0 : 1, transition: 'opacity 0s', pointerEvents: isPanning ? 'none' : 'auto' }}>
        <h3 className="text-sm font-bold text-white mb-3">Entity Categories</h3>
        <div className="space-y-2 text-xs">
          {[
            { color: '#64748b', label: 'Government & Policy' },
            { color: '#059669', label: 'Regulator' },
            { color: '#0D9488', label: 'Generation' },
            { color: '#DC2626', label: 'Fuel Supply' },
            { color: '#1E3A8A', label: 'Transmission' },
            { color: '#D97706', label: 'Distribution' },
            { color: '#7C3AED', label: 'Consumer' },
          ].map((cat) => (
            <div key={cat.label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-slate-300">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-40 left-8 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4 shadow-lg z-20 max-w-xs" style={{ opacity: isPanning ? 0 : 1, transition: 'opacity 0s', pointerEvents: isPanning ? 'none' : 'auto' }}>
        <h3 className="text-sm font-bold text-white mb-3">Grid Controls</h3>
        <div className="space-y-2 text-xs text-slate-300">
          <p>• Grid Size: {GRID_SIZE}px</p>
          <p>• Drag nodes to reposition</p>
          <p>• Release to snap to grid</p>
          <p>• Click Reset to auto-layout</p>
        </div>
      </div>

      {/* Right Side Drill Panel */}
      <div
        className={`fixed right-0 top-0 h-screen w-96 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto ${
          drillPanel.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ opacity: isPanning ? 0 : 1, pointerEvents: isPanning ? 'none' : 'auto' }}
      >
        {drillPanel.isOpen && drillPanel.nodeData && (
          <div className="p-6">
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

            <div className="mb-6 pr-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {drillPanel.nodeData.label}
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-block px-3 py-1 text-xs font-semibold rounded-full text-white"
                  style={{ backgroundColor: drillPanel.nodeData.nodeColor || '#0D9488' }}
                >
                  {drillPanel.nodeData.category}
                </span>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <div className="text-slate-300 text-xs mb-2">Primary Metric</div>
              <div className="text-4xl font-mono font-bold text-white mb-1">
                {drillPanel.nodeData.kpiValue || 'N/A'}
              </div>
              <div className="text-sm text-slate-400">
                {drillPanel.nodeData.kpiUnit}
              </div>
            </div>

            {drillPanel.nodeData.description && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-white mb-2">Description</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {drillPanel.nodeData.description}
                </p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-bold text-white mb-3">Details</h3>
              <div className="space-y-3">
                {drillPanel.nodeData.designation && (
                  <div className="bg-slate-700 bg-opacity-50 rounded p-3">
                    <div className="text-xs text-slate-400 mb-1">Designation</div>
                    <div className="text-sm font-semibold text-white">
                      {drillPanel.nodeData.designation}
                    </div>
                  </div>
                )}
                {drillPanel.nodeData.status && (
                  <div className="bg-slate-700 bg-opacity-50 rounded p-3">
                    <div className="text-xs text-slate-400 mb-1">Status</div>
                    <div className="text-sm font-semibold text-white capitalize">
                      {drillPanel.nodeData.status}
                    </div>
                  </div>
                )}
                {drillPanel.nodeData.websiteUrl && (
                  <div className="bg-slate-700 bg-opacity-50 rounded p-3">
                    <div className="text-xs text-slate-400 mb-1">Website</div>
                    <a
                      href={drillPanel.nodeData.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 break-all"
                    >
                      {drillPanel.nodeData.websiteUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <a
              href="/admin"
              className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Go to Admin Panel
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default TreeView
