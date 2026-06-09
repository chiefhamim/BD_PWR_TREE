# Bangladesh Power Sector Interactive Dashboard

## Overview

A sophisticated, data-dense interactive hierarchy tree visualization of the Bangladesh national power sector infrastructure. Built with **React Flow**, **Next.js**, and **TypeScript**, this dashboard provides real-time insights into the complete power generation, transmission, and distribution ecosystem.

## Features

### 🎨 Visual Architecture
- **Professional Design**: Glassmorphism effects with crisp borders and category-based color coding
- **Custom Styled Nodes**: Rich data visualization with icons, KPI metrics, status indicators, and timestamps
- **Animated Power Flows**: Dynamic edge thickness based on MW capacity, color-coded flow types (power, fuel, subsidy)
- **Blueprint Background**: Subtle dots grid with dark theme for Bloomberg-terminal aesthetic
- **Responsive Controls**: Zoom, pan, fit-view controls positioned intuitively

### 📊 Data Representation
Complete hierarchy covering:
- **Government & Policy**: MPEMR, Power Division, Energy Division
- **Regulator**: Bangladesh Energy Regulatory Commission (BERC)
- **Generation** (14,400+ MW total capacity):
  - BPDB (State-owned): Coal, Gas, Hydro, Solar/Wind
  - IPPs: Summit Power, United Power, Confidence Power, Others
  - Rental Power & Cross-border Imports (Adani Godda, Tripura)
- **Fuel Supply**: Petrobangla, RPGCL, Coal Suppliers, Renewable Sources
- **Transmission**: PGCB (National Grid), NLDC (Despatch Centre)
- **Distribution**: DPDC, DESCO, BREB, NESCO, WZPDC
- **Consumers**: Industrial, Commercial, Agricultural, Residential

### 🔧 Technical Stack
- **React Flow** 11.10+ - Interactive graph visualization
- **Next.js 14** - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Dagre** - Automatic layout algorithm (top-to-bottom hierarchical)
- **Lucide React** - Beautiful icon library

### ✨ Interactive Features
1. **Node Drill-Down**: Click any node to open a detailed panel with:
   - Complete entity information
   - Current status and metrics
   - Last update timestamp
   - Historical data and reporting options
   - Alert configuration

2. **Smooth Navigation**: 
   - Auto-pan to selected nodes
   - Keyboard shortcuts support
   - Zoom and pan controls

3. **Smart Visualization**:
   - Edge thickness scales with power volume (1-12px)
   - Animated dashed lines for fuel/subsidy flows
   - Status badges (normal, warning, alert)
   - Pulsing alert indicators for critical issues

4. **Navigation Aids**:
   - Mini-map with category color coding
   - Legend of entity types and flow types
   - Status indicators panel
   - Interactive tips

## Installation

```bash
# Clone the repository
cd /workspaces/BD_PWR_TREE

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm build
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout wrapper
│   ├── page.tsx            # Main page with React Flow Provider
│   └── globals.css         # Global styles and animations
├── components/
│   ├── TreeView.tsx        # Main canvas component
│   ├── nodes/
│   │   └── EntityNode.tsx  # Custom styled node component
│   └── edges/
│       └── FlowEdge.tsx    # Custom animated edge component
├── data/
│   └── powerSectorData.ts  # Complete nodes and edges dataset
├── utils/
│   └── layout.ts           # Dagre layout calculation
└── store/
    └── gridStore.ts        # Zustand state management (optional)
```

## Component Architecture

### EntityNode.tsx
Custom React Flow node with:
- Category-based color schemes and borders
- Lucide icons for quick identification
- KPI metric display with monospace font
- Status indicators (normal, warning, alert)
- Last updated timestamp
- Alert badges with pulsing animation

### FlowEdge.tsx
Custom React Flow edge with:
- Dynamic stroke width (1-12px) based on MW volume
- Flow type styling (power, fuel, subsidy)
- Dashed patterns for different flow types
- Animated dash pattern for active flows
- Edge labels with volume/metrics

### TreeView.tsx
Main canvas component featuring:
- React Flow integration with custom nodes/edges
- Auto-layout via Dagre algorithm
- Blueprint-style background
- Controls panel (zoom, fit view)
- Mini-map visualization
- Drill-down panel for detailed information
- Legend and status indicators
- Interactive tips

## Data Structure

Nodes include:
- **label**: Display name
- **kpiValue**: Primary metric (number or string)
- **kpiUnit**: Unit of measurement (MW, MMcfd, etc.)
- **category**: Entity type (government, generation, transmission, etc.)
- **status**: Health status (normal, warning, alert)
- **lastUpdated**: Timestamp of last data update
- **icon**: Lucide icon name for visual identification

Edges include:
- **source/target**: Node connection IDs
- **flowVolume**: Power volume in MW (for dynamic sizing)
- **flowType**: Type of flow (power, fuel, subsidy)
- **animated**: Whether to animate the flow
- **label**: Display label for the edge

## Customization

### Add New Nodes
Edit `src/data/powerSectorData.ts`:
```typescript
{
  id: 'unique-id',
  type: 'customNode',
  data: {
    label: 'Entity Name',
    kpiValue: 1000,
    kpiUnit: 'MW',
    category: 'generation',
    status: 'normal',
  },
  position: { x: 0, y: 0 }, // Auto-calculated by layout
}
```

### Add New Edges
```typescript
{
  id: 'edge-id',
  source: 'node-id-1',
  target: 'node-id-2',
  data: {
    flowVolume: 5000,
    flowType: 'power',
    label: '5,000 MW'
  }
}
```

### Modify Colors
Update color mappings in `EntityNode.tsx` `getCategoryColors()` function:
```typescript
case 'custom':
  return {
    border: '#YourColor',
    bg: 'bg-your-tailwind-class',
    // ... other color properties
  };
```

## Performance Optimization

- Uses React Flow's native performance optimizations
- Dagre layout pre-calculated on mount
- Memoized layout calculations
- Efficient state management with React hooks
- CSS-in-JS for animations (reduce bundle size)

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ⚠️ Limited due to large canvas

## Future Enhancements

- [ ] Real-time data integration (WebSocket)
- [ ] Historical trend analysis
- [ ] Advanced filtering and search
- [ ] Export to PDF/PNG
- [ ] Collaborative annotations
- [ ] Mobile-optimized view
- [ ] Dark/Light theme toggle
- [ ] Custom report generation

## License

MIT License - See LICENSE file for details

## Support

For issues or feature requests, please contact the development team or create an issue in the repository.

---

**Built for the Bangladesh Power Sector** | Real-time Grid Operations & Distribution Intelligence