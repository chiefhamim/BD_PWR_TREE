'use client'

import { useState, useEffect } from 'react'
import { fetchAllNodes, createNode, updateNode, deleteNode, Node } from '@/lib/api'
import { Trash2, Edit2, Plus } from 'lucide-react'

const CATEGORIES = ['government', 'generation', 'transmission', 'distribution', 'consumer', 'fuel', 'regulator']
const STATUSES = ['normal', 'warning', 'alert']

export default function NodesPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    designation: '',
    category: 'generation',
    status: 'normal',
    nodeColor: '#0D9488',
    websiteUrl: '',
    capacityData: '',
    kpiValue: '',
    kpiUnit: '',
    parentId: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNodes()
  }, [])

  const loadNodes = async () => {
    setLoading(true)
    const data = await fetchAllNodes()
    setNodes(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.label) {
      alert('Label is required')
      return
    }

    try {
      if (editingId) {
        await updateNode(editingId, formData)
      } else {
        if (!formData.id) {
          alert('ID is required')
          return
        }
        await createNode(formData)
      }

      await loadNodes()
      setShowForm(false)
      setEditingId(null)
      setFormData({
        id: '',
        label: '',
        designation: '',
        category: 'generation',
        status: 'normal',
        nodeColor: '#0D9488',
        websiteUrl: '',
        capacityData: '',
        kpiValue: '',
        kpiUnit: '',
        parentId: '',
      })
    } catch (error) {
      alert('Error saving node')
      console.error(error)
    }
  }

  const handleEdit = (node: Node) => {
    setFormData({
      id: node.id,
      label: node.label,
      designation: node.designation,
      category: node.category,
      status: node.status,
      nodeColor: node.nodeColor || '#0D9488',
      websiteUrl: node.websiteUrl || '',
      capacityData: node.capacityData || '',
      kpiValue: String(node.kpiValue || ''),
      kpiUnit: node.kpiUnit || '',
      parentId: node.parentId || '',
    })
    setEditingId(node.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this node?')) {
      await deleteNode(id)
      await loadNodes()
    }
  }

  if (loading) {
    return <p className="text-white">Loading nodes...</p>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Node Management</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Node
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingId ? 'Edit Node' : 'Create New Node'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">ID</label>
              <input
                type="text"
                disabled={!!editingId}
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Label</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              >
                {STATUSES.map((stat) => (
                  <option key={stat} value={stat}>
                    {stat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Node Color</label>
              <input
                type="color"
                value={formData.nodeColor}
                onChange={(e) => setFormData({ ...formData, nodeColor: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Website URL</label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Capacity Data</label>
              <input
                type="text"
                value={formData.capacityData}
                onChange={(e) => setFormData({ ...formData, capacityData: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Parent Node ID</label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              >
                <option value="">None</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {nodes.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No nodes yet. Create one to get started!</p>
        ) : (
          nodes.map((node) => (
            <div
              key={node.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex-1">
                <h3 className="text-white font-semibold">{node.label}</h3>
                <p className="text-slate-400 text-sm">{node.designation}</p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-block px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                    {node.category}
                  </span>
                  <span
                    className="inline-block px-2 py-1 text-xs rounded text-white"
                    style={{ backgroundColor: node.nodeColor }}
                  >
                    {node.nodeColor}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(node)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(node.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
