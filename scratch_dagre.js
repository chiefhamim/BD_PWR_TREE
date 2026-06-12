const dagre = require('dagre')

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))
dagreGraph.setGraph({ rankdir: 'TB' })

dagreGraph.setNode('1', { width: 100, height: 100 })
dagreGraph.setNode('2', { width: 100, height: 100 })
dagreGraph.setEdge('1', '2')

dagre.layout(dagreGraph)
console.log('Node 1:', dagreGraph.node('1'))
console.log('Node 2:', dagreGraph.node('2'))
