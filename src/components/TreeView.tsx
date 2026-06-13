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
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { RefreshCw, Loader, X, Focus, ChevronDown, ChevronRight, ZoomIn, ZoomOut, Lock, Unlock, Rows, Columns, ExternalLink } from 'lucide-react'

import EntityNode from './nodes/EntityNode'
import FlowEdge from './edges/FlowEdge'
import Dashboard from './Dashboard'
import ElectricityTariffPanel from './ElectricityTariffPanel'
import CommodityTicker from './CommodityTicker'
import { useLanguage, UNIT_EXPLANATIONS } from '@/contexts/LanguageContext'
import { fetchAllNodes, overrideNodeCoordinates, NodeData } from '@/lib/api'
import { snapToGrid } from '@/utils/layout'
import { getDagreLayout } from '@/lib/layoutUtils'

const getCategoryTheme = (category: string) => {
  switch (category) {
    case 'government': return { accent: '#f94144' };
    case 'generation': return { accent: '#f3722c' };
    case 'transmission': return { accent: '#f8961e' };
    case 'distribution': return { accent: '#f9c74f' };
    case 'consumer': return { accent: '#90be6d' };
    case 'fuel': return { accent: '#43aa8b' };
    case 'regulator': return { accent: '#577590' };
    default: return { accent: '#577590' };
  }
};

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

const GRID_SIZE = 20

const CATEGORY_LEGEND = [
  { id: 'government', color: '#f94144', glow: '249, 65, 68', label: 'Government' },
  { id: 'generation', color: '#f3722c', glow: '243, 114, 44', label: 'Generation' },
  { id: 'transmission', color: '#f8961e', glow: '248, 150, 30', label: 'Transmission' },
  { id: 'distribution', color: '#f9c74f', glow: '249, 199, 79', label: 'Distribution' },
  { id: 'consumer', color: '#90be6d', glow: '144, 190, 109', label: 'Consumer' },
  { id: 'fuel', color: '#43aa8b', glow: '67, 170, 139', label: 'Fuel Supply' },
  { id: 'regulator', color: '#577590', glow: '87, 117, 144', label: 'Regulator' },
]

export type LayoutType = 'Default' | 'Horizontal'

const TreeView: React.FC = () => {
  const { fitView, getNode, zoomIn, zoomOut } = useReactFlow()
  const [isLocked, setIsLocked] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [drillPanel, setDrillPanel] = useState<DrillPanelState>({
    isOpen: false,
    nodeId: null,
    nodeData: null,
  })
  const [isTariffPanelOpen, setIsTariffPanelOpen] = useState(false)
  const { t, language, formatNum, translateKpi } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  const fontClass = language === 'BN' ? 'font-bengali' : 'font-sans'
  const [loading, setLoading] = useState(true)
  const [apiNodes, setApiNodes] = useState<NodeData[]>([])
  const [legendOpen, setLegendOpen] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [layoutType, setLayoutType] = useState<LayoutType>('Default')

  useEffect(() => {
    const loadNodes = async () => {
      setLoading(true)
      try {
        const data = await fetchAllNodes()
        setApiNodes(data || [])
      } catch (error) {
        console.error('TreeView: Failed to load nodes:', error)
      } finally {
        setLoading(false)
      }
    }
    loadNodes()
  }, [])

  const { rfNodes, rfEdges } = useMemo(() => {
    if (apiNodes.length === 0) {
      return { rfNodes: [], rfEdges: [] }
    }

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

    const rootNodes = apiNodes.filter((n) => !parentMap.has(n.id))

    const layoutMap = new Map<string, { x: number; y: number }>()
    const blockSize = 220
    const blockGap = 50
    const verticalGap = 220

    const getSubtreeWidth = (nodeId: string): number => {
      const children = childrenMap.get(nodeId) || []
      if (children.length === 0) return blockSize
      const childrenWidths = children.map(childId => getSubtreeWidth(childId))
      const totalChildrenWidth = childrenWidths.reduce((a, b) => a + b, 0)
      const gapsBetweenChildren = (children.length - 1) * blockGap
      return Math.max(blockSize, totalChildrenWidth + gapsBetweenChildren)
    }

    const layoutNode = (nodeId: string, x: number, y: number): void => {
      layoutMap.set(nodeId, { x, y })
      const children = childrenMap.get(nodeId) || []
      if (children.length === 0) return

      const childrenWidths = children.map(childId => getSubtreeWidth(childId))
      const totalChildrenWidth = childrenWidths.reduce((a, b) => a + b, 0)
      const gapsBetweenChildren = (children.length - 1) * blockGap
      const totalRowWidth = totalChildrenWidth + gapsBetweenChildren

      let childX = x - totalRowWidth / 2 + childrenWidths[0] / 2

      children.forEach((childId, index) => {
        const childY = y + blockSize + verticalGap
        layoutNode(childId, childX, childY)
        if (index < children.length - 1) {
          childX += childrenWidths[index] + blockGap + childrenWidths[index + 1] / 2 - childrenWidths[index] / 2
        }
      })
    }

    // Separate berc to place it explicitly next to mpemr
    const standardRoots = Array.from(rootNodes).filter(r => r.id !== 'berc')
    if (standardRoots.length > 0) {
      const rootWidths = standardRoots.map(r => getSubtreeWidth(r.id))
      const totalRootWidth = rootWidths.reduce((a, b) => a + b, 0)
      const rootGaps = (standardRoots.length - 1) * blockGap
      const totalRootRowWidth = totalRootWidth + rootGaps

      let rootX = -totalRootRowWidth / 2 + rootWidths[0] / 2
      standardRoots.forEach((root, index) => {
        layoutNode(root.id, rootX, 0)
        if (index < standardRoots.length - 1) {
          rootX += rootWidths[index] + blockGap + rootWidths[index + 1] / 2 - rootWidths[index] / 2
        }
      })
    }

    // Explicitly place BERC directly to the right of MPEMR
    const mpemrPos = layoutMap.get('mpemr')
    if (mpemrPos) {
      layoutMap.set('berc', { x: mpemrPos.x + blockSize + blockGap, y: mpemrPos.y })
    }

    const rfNodes: Node<NodeData>[] = apiNodes.map((node) => {
      const position = layoutMap.get(node.id) || { x: 0, y: 0 }
      const snappedPos = snapToGrid(position.x, position.y, GRID_SIZE)
      return {
        id: node.id,
        type: 'customNode',
        data: node,
        position: snappedPos,
        sourcePosition: layoutType === 'Horizontal' ? Position.Right : Position.Bottom,
        targetPosition: layoutType === 'Horizontal' ? Position.Left : Position.Top,
      }
    })

    const nodeColorMap = new Map<string, string>()
    apiNodes.forEach(node => {
      nodeColorMap.set(node.id, node.nodeColor || '#94a3b8')
    })

    const rfEdges: Edge[] = apiNodes
      .filter((node) => node.parentId)
      .map((node) => ({
        id: `${node.parentId}-${node.id}`,
        type: 'customEdge',
        source: node.parentId!,
        target: node.id,
        style: { stroke: node.parentId ? getCategoryTheme(apiNodes.find(n => n.id === node.parentId)?.category || '').accent : '#94a3b8', strokeWidth: 2, opacity: 0.8 },
        data: {
          nodeColor: node.parentId ? getCategoryTheme(apiNodes.find(n => n.id === node.parentId)?.category || '').accent : '#94a3b8',
          animated: true,
        }
      }))

    if (layoutType === 'Horizontal') {
      return { rfNodes: getDagreLayout(rfNodes, rfEdges, 'LR'), rfEdges }
    }

    return { rfNodes, rfEdges }
  }, [apiNodes, layoutType])

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges)

  useEffect(() => {
    setNodes(rfNodes)
    setEdges(rfEdges)
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 600 })
    }, 100)
  }, [rfNodes, rfEdges, setNodes, setEdges, fitView])

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        const isActive = !selectedCategory || n.data.category === selectedCategory
        return {
          ...n,
          className: isActive ? '' : 'not-category-selected',
          data: { ...n.data, isCategoryActive: !!selectedCategory, isActiveCategory: isActive },
          style: { ...n.style, transition: 'all 0.4s ease-in-out' },
        }
      })
    )
    setEdges((eds) =>
      eds.map((e) => {
        const sourceNode = apiNodes.find((n) => n.id === e.source)
        const targetNode = apiNodes.find((n) => n.id === e.target)
        const isActive =
          !selectedCategory ||
          sourceNode?.category === selectedCategory ||
          targetNode?.category === selectedCategory
        return {
          ...e,
          className: isActive ? '' : 'not-category-selected',
          style: { ...e.style, transition: 'all 0.4s ease-in-out', stroke: sourceNode ? getCategoryTheme(sourceNode.category).accent : '#94a3b8', strokeWidth: 2 },
        }
      })
    )
  }, [selectedCategory, apiNodes, setNodes, setEdges])

  useEffect(() => {
    if (selectedCategory) {
      setTimeout(() => {
        const nodesToFit = rfNodes.filter(n => n.data.category === selectedCategory).map(n => ({ id: n.id }));
        if (nodesToFit.length > 0) {
          fitView({ nodes: nodesToFit, padding: 0.5, duration: 1000, maxZoom: 1.2 });
        }
      }, 100);
    } else {
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 800 });
      }, 100);
    }
  }, [selectedCategory, fitView, rfNodes]);

  const handleNodeDragStop = useCallback(
    async (event: React.MouseEvent, node: Node<NodeData>) => {
      const snappedPos = snapToGrid(node.position.x, node.position.y, GRID_SIZE)
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, position: snappedPos } : n
        )
      )
      if (node.position.x !== snappedPos.x || node.position.y !== snappedPos.y) {
        await overrideNodeCoordinates(node.id, snappedPos.x, snappedPos.y)
      }
    },
    [setNodes]
  )

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      setSelectedCategory(null) // Unfade everything

      if (drillPanel.isOpen && drillPanel.nodeId === node.id) {
        setDrillPanel({ isOpen: false, nodeId: null, nodeData: null })
      } else {
        setDrillPanel({
          isOpen: true,
          nodeId: node.id,
          nodeData: node.data as NodeData,
        })
        if (getNode(node.id)) {
          fitView({ nodes: [{ id: node.id }], padding: 0.5, duration: 800 })
        }
      }
    },
    [drillPanel, fitView, getNode]
  )

  const handleResetPanels = useCallback(() => {
    setNodes(rfNodes.map(n => ({ ...n })))
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 600 })
    }, 100)
  }, [setNodes, fitView, rfNodes])

    const handleResetView = useCallback(() => {
    fitView({ padding: 0.2, duration: 600 })
  }, [fitView])

  const closeDrillPanel = () => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })))
    setDrillPanel({ isOpen: false, nodeId: null, nodeData: null })
  }

  const onPaneClick = useCallback(() => {
    setSelectedCategory(null)
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })))
    setDrillPanel({ isOpen: false, nodeId: null, nodeData: null })
  }, [setNodes])

  const getNodeColor = (node: Node<NodeData>) => {
    const data = node.data as NodeData
    switch (data?.category) {
      case 'government': return '#64748b'
      case 'generation': return '#14b8a6'
      case 'transmission': return '#3b82f6'
      case 'distribution': return '#f59e0b'
      case 'consumer': return '#a78bfa'
      case 'fuel': return '#f87171'
      case 'regulator': return '#34d399'
      default: return '#94a3b8'
    }
  }

  if (loading) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center" style={{ background: '#080c14' }}>
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <Loader className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
          <p className="text-sm font-medium text-slate-400">Loading Power Sector Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen" style={{ background: '#080c14' }}>
      {/* React Flow Canvas */}
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeDragStop={handleNodeDragStop}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={[20, 20]}
        defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
        fitView
        fitViewOptions={{ padding: 0.12, maxZoom: 0.85 }}
        minZoom={0.1}
        maxZoom={1.5}
        nodesDraggable={!isLocked}
        className={`focus:outline-none outline-none transition-all duration-500 ${drillPanel.isOpen ? 'drill-active' : ''} ${selectedCategory ? 'category-active' : ''}`}
        style={{
          backgroundColor: '#020617',
        }}
      >
        <Background
          color="rgba(148, 163, 184, 0.04)"
          gap={GRID_SIZE}
          size={1.5}
          style={{ backgroundColor: '#080c14' }}
        />
      </ReactFlow>

      <style>{`
        .drill-active .react-flow__node:not(.selected) {
          opacity: 0.2 !important;
          filter: blur(3px);
          pointer-events: none;
        }
        .drill-active .react-flow__edge {
          opacity: 0.1 !important;
        }
        .drill-active .ui-overlay-element {
          opacity: 0.2 !important;
          filter: blur(3px);
          pointer-events: none;
        }
        .category-active .not-category-selected {
          opacity: 0.2 !important;
          filter: blur(4px) !important;
          pointer-events: none;
        }
        .react-flow__node, .react-flow__edge, .ui-overlay-element {
          transition: all 0.4s ease-in-out;
        }
      `}</style>

      {/* UI Overlay Layer */}
      <div className={`pointer-events-none absolute inset-0 z-10 ui-overlay-element ${drillPanel.isOpen ? 'opacity-0 pointer-events-none transition-opacity duration-500' : 'opacity-100 transition-opacity duration-500'}`}>
        {/* Commodity Ticker */}
        <CommodityTicker />

        {/* Header */}
        <div className="pointer-events-auto absolute top-10 left-0 right-0">
          <div
            className="px-7 py-5"
            style={{
              background: 'linear-gradient(180deg, rgba(8, 12, 20, 0.95) 0%, rgba(8, 12, 20, 0.7) 60%, transparent 100%)',
            }}
          >
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: '#34d399', boxShadow: '0 0 8px rgba(52, 211, 153, 0.6)' }}
              />
              <h1 className="text-xl font-bold text-white tracking-tight">
                {t('Bangladesh Power Sector')}
              </h1>
            </div>
            <p className={`text-[11px] text-slate-500 ml-5 ${fontClass}`}>
              {t('Interactive Hierarchy')} · {formatNum(nodes.length)} {t('entities')} · {t('Click nodes for details')}
            </p>
          </div>
        </div>

        {/* Top Right Controls Container */}
        <div className={`pointer-events-auto absolute top-14 right-6 flex flex-row items-center justify-end gap-4 z-50 ui-overlay-element`}>
          {/* Electricity Tariff Rates Button */}
          <ElectricityTariffPanel onOpenChange={setIsTariffPanelOpen} />

          {/* Floating Controls Bar */}
          <div 
            className="flex items-center bg-slate-800/60 rounded-full border border-slate-700/50 shadow-inner px-1 py-1"
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <div className="group relative flex justify-center">
              <button
                onClick={handleResetPanels}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <div className="absolute top-full mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 text-emerald-400 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 transform translate-y-1 group-hover:translate-y-0">
                {t('Reset Flow Layout')}
              </div>
            </div>
            
            <div className="group relative flex justify-center">
              <button
                onClick={handleResetView}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors"
              >
                <Focus className="w-4 h-4" />
              </button>
              <div className="absolute top-full mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 text-emerald-400 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 transform translate-y-1 group-hover:translate-y-0">
                {t('Center Canvas')}
              </div>
            </div>

            <div className="w-px h-5 mx-1 bg-slate-700/60" />

            <div className="group relative flex justify-center">
              <button
                onClick={() => zoomOut()}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="absolute top-full mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 text-emerald-400 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 transform translate-y-1 group-hover:translate-y-0">
                {t('Zoom Out')}
              </div>
            </div>
            
            <div className="group relative flex justify-center">
              <button
                onClick={() => zoomIn()}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="absolute top-full mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 text-emerald-400 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 transform translate-y-1 group-hover:translate-y-0">
                {t('Zoom In')}
              </div>
            </div>
            
            <div className="group relative flex justify-center">
              <button
                onClick={() => setIsLocked(!isLocked)}
                className={`p-2 rounded-full transition-colors ${isLocked ? 'text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
              >
                {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
              <div className="absolute top-full mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 text-emerald-400 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 transform translate-y-1 group-hover:translate-y-0">
                {isLocked ? t('Unlock Grid') : t('Lock Grid')}
              </div>
            </div>
            
            <div className="w-px h-5 mx-1 bg-slate-700/60" />

            <div className="group relative flex justify-center">
              <button
                onClick={() => setLayoutType('Default')}
                className={`p-2 rounded-full transition-colors ${layoutType === 'Default' ? 'bg-blue-500/20 text-blue-400 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
              >
                <Rows className="w-4 h-4" />
              </button>
              <div className="absolute top-full mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 text-emerald-400 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 transform translate-y-1 group-hover:translate-y-0">
                {t('Vertical View')}
              </div>
            </div>
            
            <div className="group relative flex justify-center">
              <button
                onClick={() => setLayoutType('Horizontal')}
                className={`p-2 rounded-full transition-colors ${layoutType === 'Horizontal' ? 'bg-blue-500/20 text-blue-400 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
              >
                <Columns className="w-4 h-4" />
              </button>
              <div className="absolute top-full mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 text-emerald-400 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 transform translate-y-1 group-hover:translate-y-0">
                {t('Horizontal View')}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div
          className={`pointer-events-auto absolute top-28 left-7 rounded-[20px] overflow-hidden z-50 ${fontClass} group ui-overlay-element ${isTariffPanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            width: 220,
          }}
        >
          <button
            onClick={() => setLegendOpen(!legendOpen)}
            className="w-full flex items-center justify-between px-5 py-4 text-[13px] font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="uppercase tracking-widest text-xs">{t('Categories')}</span>
            {legendOpen ? <ChevronDown className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />}
          </button>
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${legendOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-3 pb-3 space-y-1.5">
              {CATEGORY_LEGEND.map((cat) => {
                const isSelected = selectedCategory === cat.id
                const isFaded = selectedCategory && !isSelected
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                    className={`w-full flex items-center gap-3 hover:bg-slate-700/40 rounded-xl px-3 py-2.5 transition-all duration-300 border border-transparent hover:border-slate-600/50 ${isSelected ? 'bg-slate-800/80 border-slate-600/50 shadow-inner' : ''}`}
                    style={{ opacity: isFaded ? 0.3 : 1 }}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: cat.color,
                        boxShadow: `0 0 10px rgba(${cat.glow}, ${isSelected ? '0.8' : '0.4'})`,
                        transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.3s'
                      }}
                    />
                    <span className={`text-[11px] font-semibold tracking-wide transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>{t(cat.label)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <div className={`pointer-events-auto transition-all duration-500 ${selectedCategory ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <Dashboard />
        </div>
      </div>

      {/* Drill Panel */}
      <div
        className={`fixed right-0 top-0 h-screen w-[380px] transform z-[70] overflow-y-auto ${
          drillPanel.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'rgba(10, 15, 28, 0.95)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(148, 163, 184, 0.08)',
          boxShadow: drillPanel.isOpen ? '-20px 0 80px rgba(0, 0, 0, 0.5)' : 'none',
          transition: `transform 0.4s cubic-bezier(0.16,1,0.3,1)`,
        }}
      >
        {drillPanel.isOpen && drillPanel.nodeData && (
          <div className="p-6 animate-fade-in font-serif">
            {/* Close button */}
            <button
              onClick={closeDrillPanel}
              className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Newspaper Header / Masthead */}
            <div className="mb-6 border-b border-double border-slate-600 pb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-sans">
                  {t(CATEGORY_LEGEND.find(c => c.id === drillPanel.nodeData!.category)?.label || drillPanel.nodeData!.category)}
                </span>
                <span className="text-[9px] font-sans text-slate-500 uppercase tracking-wider">
                  {t('Updated')} {mounted ? new Date().toLocaleTimeString(language === 'EN' ? 'en-US' : 'bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true }) : '--:--'}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                {t(drillPanel.nodeData.label)}
              </h2>
              {drillPanel.nodeData.designation && (
                <h3 className="text-sm italic text-slate-400 mt-1">
                  {t(drillPanel.nodeData.designation)}
                </h3>
              )}
            </div>

            {/* KPI Headline Section */}
            {(() => {
              const kpi = translateKpi(drillPanel.nodeData.kpiValue, drillPanel.nodeData.kpiUnit);
              return (
                <div className="mb-6 border-b border-slate-700 pb-6">
                  <div className="text-[10px] font-sans uppercase tracking-widest text-slate-500 mb-1">{t('Primary Metric')}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white font-serif">{kpi.value}</span>
                    <span className="text-sm font-sans text-slate-400 uppercase tracking-wide">{kpi.unit}</span>
                  </div>
                </div>
              );
            })()}

            {/* Article Body (Description) */}
            {drillPanel.nodeData.description && (
              <div className="mb-6 prose prose-invert prose-sm max-w-none">
                <p className="text-slate-300 leading-relaxed font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-emerald-500 first-letter:float-left first-letter:mr-2 first-letter:mt-1">
                  {t(drillPanel.nodeData.description)}
                </p>
              </div>
            )}

            {/* KPI Definition block (if any) */}
            {drillPanel.nodeData.kpiUnit && UNIT_EXPLANATIONS[drillPanel.nodeData.kpiUnit] && (
               <div className="mb-6 bg-slate-800/30 p-4 border-l-4 border-emerald-600 italic font-serif">
                <h3 className="text-xs uppercase tracking-wider text-emerald-500 font-sans font-bold mb-1">{t('Definition')}</h3>
                <p className="text-xs text-slate-300 mb-2">
                  {language === 'EN' ? UNIT_EXPLANATIONS[drillPanel.nodeData.kpiUnit].defEn : UNIT_EXPLANATIONS[drillPanel.nodeData.kpiUnit].defBn}
                </p>
                <h3 className="text-[10px] uppercase tracking-wider text-slate-500 font-sans font-bold mb-1">{t('Example')}</h3>
                <p className="text-xs text-slate-400">
                  {language === 'EN' ? UNIT_EXPLANATIONS[drillPanel.nodeData.kpiUnit].exEn : UNIT_EXPLANATIONS[drillPanel.nodeData.kpiUnit].exBn}
                </p>
              </div>
            )}

            {/* Institutional Details / Fact Box */}
            <div className="mt-8 border-t border-slate-700 pt-5 font-sans">
              <h4 className="text-[10px] uppercase tracking-widest text-slate-500 mb-4 font-bold">{t('Institutional Fact Sheet')}</h4>
              <div className="grid grid-cols-1 gap-4 text-sm">
                
                {drillPanel.nodeData.status && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t('Status')}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${drillPanel.nodeData.status === 'alert' ? 'bg-red-500' : drillPanel.nodeData.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span className="text-slate-200 capitalize">{t(drillPanel.nodeData.status)}</span>
                    </div>
                  </div>
                )}

                {drillPanel.nodeData.officeAddress && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t('Headquarters')}</span>
                    <span className="text-slate-200">{t(drillPanel.nodeData.officeAddress)}</span>
                  </div>
                )}

                {drillPanel.nodeData.operatingArea && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t('Operating Jurisdiction')}</span>
                    <span className="text-slate-200">{t(drillPanel.nodeData.operatingArea)}</span>
                  </div>
                )}

                {drillPanel.nodeData.websiteUrl && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t('Official Portal')}</span>
                    <a href={drillPanel.nodeData.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1.5 truncate">
                      <span className="truncate">{drillPanel.nodeData.websiteUrl}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t('Data Source')}</span>
                  <a href={drillPanel.nodeData.websiteUrl || "https://power.gov.bd"} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-300 underline decoration-slate-600 underline-offset-2 transition-colors">{drillPanel.nodeData.category === 'government' ? 'MoPEMR' : 'BPDB Database'}</a>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TreeView
