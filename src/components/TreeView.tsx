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
import { RotateCcw, Loader, X, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react'

import EntityNode from './nodes/EntityNode'
import FlowEdge from './edges/FlowEdge'
import Dashboard from './Dashboard'
import CommodityTicker from './CommodityTicker'
import { useLanguage, UNIT_EXPLANATIONS } from '@/contexts/LanguageContext'
import { fetchAllNodes, overrideNodeCoordinates, NodeData } from '@/lib/api'
import { snapToGrid } from '@/utils/layout'
import { getDagreLayout } from '@/lib/layoutUtils'

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
  const { fitView, getNode } = useReactFlow()
  const [drillPanel, setDrillPanel] = useState<DrillPanelState>({
    isOpen: false,
    nodeId: null,
    nodeData: null,
  })
  const { t, language, formatNum, translateKpi } = useLanguage()
  const fontClass = language === 'BN' ? 'font-bengali' : 'font-sans'
  const [loading, setLoading] = useState(true)
  const [apiNodes, setApiNodes] = useState<NodeData[]>([])
  const [isPanning, setIsPanning] = useState(false)
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
        draggable: true,
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
        source: node.parentId!,
        target: node.id,
        data: {
          nodeColor: nodeColorMap.get(node.parentId!) || '#94a3b8',
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
          style: { ...n.style, opacity: isActive ? 1 : 0.2, transition: 'opacity 0.3s' },
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
          style: { ...e.style, opacity: isActive ? 0.8 : 0.1, transition: 'opacity 0.3s' },
        }
      })
    )
  }, [selectedCategory, apiNodes, setNodes, setEdges])

  useEffect(() => {
    if (selectedCategory) {
      setTimeout(() => {
        const nodesToFit = rfNodes.filter(n => n.data.category === selectedCategory).map(n => ({ id: n.id }));
        if (nodesToFit.length > 0) {
          fitView({ nodes: nodesToFit, padding: 0.2, duration: 800 });
        }
      }, 50);
    } else {
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 800 });
      }, 50);
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
    setDrillPanel({ isOpen: false, nodeId: null, nodeData: null })
  }

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
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeDragStop={handleNodeDragStop}
        onMoveStart={(event) => {
          if (event) setIsPanning(true)
        }}
        onMoveEnd={() => setIsPanning(false)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={[20, 20]}
        fitView
        fitViewOptions={{ padding: 0.12, maxZoom: 0.85 }}
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background
          color="rgba(148, 163, 184, 0.04)"
          gap={GRID_SIZE}
          size={1.5}
          style={{ backgroundColor: '#080c14' }}
        />
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          nodeColor={getNodeColor}
          maskColor="rgba(0, 0, 0, 0.6)"
        />
      </ReactFlow>

      {/* UI Overlay Layer — fades during panning */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          opacity: isPanning ? 0 : 1,
          transition: `opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${isPanning ? '150ms' : '0ms'}`,
        }}
      >
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

        {/* Floating Controls Bar */}
        <div 
          className={`pointer-events-auto absolute top-10 right-8 flex flex-col md:flex-row items-center gap-2 md:gap-3 px-4 py-2.5 rounded-2xl z-20 ${fontClass}`}
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          <button
            onClick={handleResetPanels}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-95 w-full md:w-auto"
            title={t('Reset Layout')}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">{t('Reset Layout')}</span>
          </button>
          
          <div className="w-full md:w-px h-px md:h-5 bg-slate-700/60" />

          <button
            onClick={handleResetView}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-95 w-full md:w-auto"
            title={t('Reset View')}
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden md:inline">{t('Reset View')}</span>
          </button>

          <div className="w-full md:w-px h-px md:h-5 bg-slate-700/60" />

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('View')}:</span>
            <div className="flex bg-slate-800/60 p-1 rounded-full border border-slate-700/50 shadow-inner">
              <button
                onClick={() => setLayoutType('Default')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${layoutType === 'Default' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm' : 'text-slate-400 hover:text-white border border-transparent'}`}
              >
                {t('Vertical')}
              </button>
              <button
                onClick={() => setLayoutType('Horizontal')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${layoutType === 'Horizontal' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm' : 'text-slate-400 hover:text-white border border-transparent'}`}
              >
                {t('Horizontal')}
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div
          className={`pointer-events-auto absolute top-28 left-7 rounded-[20px] overflow-hidden z-50 ${fontClass} transition-all duration-500 group`}
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
        <div className="pointer-events-auto">
          <Dashboard />
        </div>
      </div>

      {/* Drill Panel */}
      <div
        className={`fixed right-0 top-0 h-screen w-[380px] transform z-30 overflow-y-auto ${
          drillPanel.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          opacity: isPanning ? 0 : 1,
          background: 'rgba(10, 15, 28, 0.95)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(148, 163, 184, 0.08)',
          boxShadow: drillPanel.isOpen ? '-20px 0 80px rgba(0, 0, 0, 0.5)' : 'none',
          transition: `transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${isPanning ? '150ms' : '0ms'}`,
        }}
      >
        {drillPanel.isOpen && drillPanel.nodeData && (
          <div className="p-6 animate-fade-in">
            {/* Close button */}
            <button
              onClick={closeDrillPanel}
              className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Category pill */}
            <div className="mb-5 flex">
              <span
                className="inline-flex items-center justify-center text-center px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  color: drillPanel.nodeData.nodeColor || '#14b8a6',
                  background: `rgba(${drillPanel.nodeData.nodeColor ? '148, 163, 184' : '20, 184, 166'}, 0.1)`,
                  border: `1px solid rgba(${drillPanel.nodeData.nodeColor ? '148, 163, 184' : '20, 184, 166'}, 0.15)`,
                }}
              >
                {t(CATEGORY_LEGEND.find(c => c.id === drillPanel.nodeData!.category)?.label || drillPanel.nodeData!.category)}
              </span>
            </div>

            {/* Title */}
            <div className="mb-6 pr-8">
              <h2 className="text-xl font-bold text-white leading-tight tracking-tight">
                {t(drillPanel.nodeData.label)}
              </h2>
              <div className="flex items-center gap-1.5 mt-2 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                <span className="text-emerald-500/80">{t('Source')}: <a href={drillPanel.nodeData.websiteUrl || "https://power.gov.bd"} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline decoration-emerald-500/30 underline-offset-2 transition-colors">{drillPanel.nodeData.category === 'government' ? 'MoPEMR' : 'BPDB Database'}</a></span>
                <span className="text-slate-700">•</span>
                <span>{t('Updated')}: {new Date().toLocaleTimeString(language === 'EN' ? 'en-US' : 'bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* KPI Card */}
            {(() => {
              const kpi = translateKpi(drillPanel.nodeData.kpiValue, drillPanel.nodeData.kpiUnit);
              return (
                <div
                  className="rounded-xl p-5 mb-6"
                  style={{
                    background: 'rgba(148, 163, 184, 0.04)',
                    border: '1px solid rgba(148, 163, 184, 0.08)',
                  }}
                >
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-2">{t('Primary Metric')}</div>
                  <div
                    className="text-3xl font-bold text-white mb-1"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {kpi.value}
                  </div>
                  <div className="text-xs text-slate-500">{kpi.unit}</div>
                </div>
              );
            })()}

            {/* KPI Definition block */}
            {drillPanel.nodeData.kpiUnit && UNIT_EXPLANATIONS[drillPanel.nodeData.kpiUnit] && (
              <div
                className="rounded-xl p-4 mb-6 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                }}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
                <h3 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">{t('Definition')}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {language === 'EN' ? UNIT_EXPLANATIONS[drillPanel.nodeData.kpiUnit].defEn : UNIT_EXPLANATIONS[drillPanel.nodeData.kpiUnit].defBn}
                </p>
                <h3 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">{t('Example')}</h3>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  {language === 'EN' ? UNIT_EXPLANATIONS[drillPanel.nodeData.kpiUnit].exEn : UNIT_EXPLANATIONS[drillPanel.nodeData.kpiUnit].exBn}
                </p>
              </div>
            )}

            {/* Description */}
            {drillPanel.nodeData.description && (
              <div className="mb-6">
                <h3 className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">{t('Description')}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t(drillPanel.nodeData.description)}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="space-y-2.5 mb-6">
              {drillPanel.nodeData.designation && (
                <div
                  className="rounded-lg p-3.5"
                  style={{ background: 'rgba(148, 163, 184, 0.04)', border: '1px solid rgba(148, 163, 184, 0.06)' }}
                >
                  <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-medium">{t('Designation')}</div>
                  <div className="text-sm font-medium text-slate-200">{t(drillPanel.nodeData.designation)}</div>
                </div>
              )}
              {drillPanel.nodeData.status && (
                <div
                  className="rounded-lg p-3.5"
                  style={{ background: 'rgba(148, 163, 184, 0.04)', border: '1px solid rgba(148, 163, 184, 0.06)' }}
                >
                  <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-medium">{t('Status')}</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: drillPanel.nodeData.status === 'alert' ? '#f87171'
                          : drillPanel.nodeData.status === 'warning' ? '#fbbf24' : '#34d399',
                        boxShadow: drillPanel.nodeData.status === 'alert' ? '0 0 6px rgba(248,113,113,0.5)'
                          : drillPanel.nodeData.status === 'warning' ? '0 0 6px rgba(251,191,36,0.5)' : '0 0 6px rgba(52,211,153,0.5)',
                      }}
                    />
                    <span className="text-sm font-medium text-slate-200 capitalize">{t(drillPanel.nodeData.status)}</span>
                  </div>
                </div>
              )}
              {drillPanel.nodeData.websiteUrl && (
                <div
                  className="rounded-lg p-3.5"
                  style={{ background: 'rgba(148, 163, 184, 0.04)', border: '1px solid rgba(148, 163, 184, 0.06)' }}
                >
                  <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-medium">{t('Website')}</div>
                  <a
                    href={drillPanel.nodeData.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5"
                  >
                    <span className="truncate">{drillPanel.nodeData.websiteUrl}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TreeView
