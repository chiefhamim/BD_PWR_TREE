'use client'

import { useState, useEffect } from 'react'
import { fetchAllNodes, updateNodeColor, Node } from '@/lib/api'
import { Save } from 'lucide-react'

export default function StylingPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(true)
  const [colorMap, setColorMap] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    loadNodes()
  }, [])

  const loadNodes = async () => {
    setLoading(true)
    const data = await fetchAllNodes()
    setNodes(data || [])
    const colors: { [key: string]: string } = {}
    data?.forEach((node) => {
      colors[node.id] = node.nodeColor || '#0D9488'
    })
    setColorMap(colors)
    setLoading(false)
  }

  const handleColorChange = (nodeId: string, color: string) => {
    setColorMap({ ...colorMap, [nodeId]: color })
  }

  const handleSave = async (nodeId: string) => {
    await updateNodeColor(nodeId, colorMap[nodeId])
    alert('Color updated successfully')
  }

  if (loading) {
    return <p className="text-white">Loading nodes...</p>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Styling & Colors</h1>

      <div className="space-y-4">
        {nodes.length === 0 ? (
          <p className="text-slate-400">No nodes to style. Create nodes first.</p>
        ) : (
          nodes.map((node) => (
            <div
              key={node.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex-1">
                <h3 className="text-white font-semibold">{node.label}</h3>
                <p className="text-slate-400 text-sm">{node.designation}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-slate-300 text-sm font-medium">Color:</label>
                  <input
                    type="color"
                    value={colorMap[node.id] || '#0D9488'}
                    onChange={(e) => handleColorChange(node.id, e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <span className="text-slate-400 text-sm ml-2">
                    {colorMap[node.id]}
                  </span>
                </div>
                <button
                  onClick={() => handleSave(node.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
