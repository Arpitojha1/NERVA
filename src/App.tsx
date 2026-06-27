import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layers, 
  Cpu, 
  GitFork, 
  Network, 
  Activity, 
  Map, 
  Play, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Plus, 
  Trash, 
  AlertTriangle, 
  Server, 
  TrendingUp, 
  Database, 
  Maximize, 
  Minimize, 
  Grid, 
  Tv, 
  FileText, 
  Sparkles, 
  Clock, 
  Info, 
  ShieldAlert, 
  DollarSign, 
  Settings,
  HelpCircle,
  Code,
  MapPin,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================

interface TeamMember {
  name: string;
  role: string;
  focus: string;
  college: string;
  avatarBg: string;
}

interface Edge {
  id: string;
  from: string;
  to: string;
  name: string;
  length: number; // in km
  weight: number; // baseline commute time weight
  collapsed: boolean;
  criticality: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

interface Node {
  id: string;
  name: string;
  x: number; // percentages for custom map representation
  y: number;
}

export default function App() {
  // Navigation & View Mode State
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'presenter' | 'grid'>('presenter');
  const [isAutoplay, setIsAutoplay] = useState<boolean>(false);
  const [autoplayProgress, setAutoplayProgress] = useState<number>(0);

  // Editable Team Names (for interactive Slide 2)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      name: 'Arpit Ojha',
      role: 'Systems Architect & Graph Intelligence Lead',
      focus: 'Network topology translation, Dijkstra path-routing solvers, FastAPI gateways, & graph-theoretic centrality scoring.',
      college: 'Manipal Institute of Tehcnology, Bengaluru',
      avatarBg: 'bg-[#EC4899]'
    },
    {
      name: 'Ishanya Tripathi',
      role: 'Computer Vision Engineer',
      focus: 'SegFormer-B2 fine-tuning, Topo-Tree Scan connectivity loss formulation, Sentinel-2 spectral analysis, & Zhang-Suen skeletonization.',
      college: 'Lokmanya Tilak College of Engineering, Navi Mumbai',
      avatarBg: 'bg-[#22C55E]'
    }
  ]);

  const updateMemberName = (index: number, newName: string) => {
    const updated = [...teamMembers];
    updated[index].name = newName;
    setTeamMembers(updated);
  };

  // Slide 5: Interactive Process Flow State
  const [activeProcessStep, setActiveProcessStep] = useState<number>(0);

  // Slide 6: Interactive Dashboard Demo State
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'A', name: 'Silk Board Junction', x: 25, y: 75 },
    { id: 'B', name: 'HSR Layout Sec-4', x: 75, y: 75 },
    { id: 'C', name: 'Agara Junction', x: 80, y: 40 },
    { id: 'D', name: 'Koramangala 15th Main', x: 45, y: 25 },
    { id: 'E', name: 'Bellandur Gate', x: 90, y: 15 },
    { id: 'F', name: 'Madivala Junction', x: 15, y: 35 }
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    { 
      id: 'e1', 
      from: 'A', 
      to: 'B', 
      name: 'Outer Ring Road (Silk Board - HSR)', 
      length: 2.2, 
      weight: 40, 
      collapsed: false, 
      criticality: 'HIGH',
      description: 'Major transit corridor connecting south to eastern tech clusters.'
    },
    { 
      id: 'e2', 
      from: 'A', 
      to: 'F', 
      name: 'Hosur Road Expressway', 
      length: 1.5, 
      weight: 30, 
      collapsed: false, 
      criticality: 'MEDIUM',
      description: 'Primary National Highway link carrying massive regional logistics freight.'
    },
    { 
      id: 'e3', 
      from: 'F', 
      to: 'D', 
      name: 'Madivala Main Road', 
      length: 2.5, 
      weight: 50, 
      collapsed: false, 
      criticality: 'LOW',
      description: 'Inner residential arterial road with high tree-canopy shadow.'
    },
    { 
      id: 'e4', 
      from: 'B', 
      to: 'C', 
      name: 'HSR Inner Ring Road', 
      length: 3.1, 
      weight: 45, 
      collapsed: false, 
      criticality: 'MEDIUM',
      description: 'Key commercial boulevard prone to seasonal waterlogging.'
    },
    { 
      id: 'e5', 
      from: 'C', 
      to: 'E', 
      name: 'ORR East Link (Agara - Bellandur)', 
      length: 2.8, 
      weight: 35, 
      collapsed: false, 
      criticality: 'HIGH',
      description: 'Highly vulnerable, congested link supporting major IT business parks.'
    },
    { 
      id: 'e6', 
      from: 'E', 
      to: 'D', 
      name: 'Sarjapur-Koramangala Link', 
      length: 4.0, 
      weight: 60, 
      collapsed: false, 
      criticality: 'LOW',
      description: 'Secondary bypass route with complex irregular intersections.'
    },
    { 
      id: 'e7', 
      from: 'C', 
      to: 'D', 
      name: 'Agara-Koramangala Flyover Corridor', 
      length: 3.5, 
      weight: 90, 
      collapsed: false, 
      criticality: 'HIGH',
      description: 'Critical urban flyover bottleneck under extensive metro construction.'
    }
  ]);

  // Reset collapse states
  const resetDemo = () => {
    setEdges(edges.map(e => ({ ...e, collapsed: false })));
  };

  // Toggle single edge state
  const toggleEdgeCollapse = (edgeId: string) => {
    setEdges(edges.map(e => e.id === edgeId ? { ...e, collapsed: !e.collapsed } : e));
  };

  // Slide 7: Interactive Architecture inspector State
  const [selectedArchLayer, setSelectedArchLayer] = useState<string>('ml');

  // ==========================================
// GRAPH ROUTING CALCULATION ENGINE (DIJKSTRA)
// ==========================================
// Calculate actual routes and metrics dynamically when edges collapse!
// This provides actual mathematical rigor for ISRO scientists.

  const pathMetrics = useMemo(() => {
    // Helper to calculate shortest path between two nodes
    const getShortestPathWeight = (start: string, end: string, activeEdges: Edge[]) => {
      const distances: Record<string, number> = {};
      const visited: Record<string, boolean> = {};
      
      nodes.forEach(n => {
        distances[n.id] = Infinity;
      });
      distances[start] = 0;

      for (let i = 0; i < nodes.length; i++) {
        // Find min distance unvisited node
        let u = '';
        let minDistance = Infinity;
        nodes.forEach(n => {
          if (!visited[n.id] && distances[n.id] < minDistance) {
            minDistance = distances[n.id];
            u = n.id;
          }
        });

        if (!u) break;
        visited[u] = true;

        // Update neighbors
        activeEdges.forEach(e => {
          if (e.from === u || e.to === u) {
            const v = e.from === u ? e.to : e.from;
            if (!visited[v]) {
              const weight = e.weight;
              if (distances[u] + weight < distances[v]) {
                distances[v] = distances[u] + weight;
              }
            }
          }
        });
      }

      return distances[end];
    };

    // Calculate baseline metrics (all edges active)
    const baselineEdges = edges.map(e => ({ ...e, collapsed: false }));
    const currentEdges = edges.filter(e => !e.collapsed);

    let baselineSum = 0;
    let baselineCount = 0;
    let currentSum = 0;
    let currentCount = 0;

    // Calculate all-pairs shortest paths
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const u = nodes[i].id;
        const v = nodes[j].id;

        const bDist = getShortestPathWeight(u, v, baselineEdges);
        if (bDist !== Infinity) {
          baselineSum += bDist;
          baselineCount++;
        }

        const cDist = getShortestPathWeight(u, v, currentEdges);
        if (cDist !== Infinity) {
          currentSum += cDist;
          currentCount++;
        }
      }
    }

    const baselineAvg = baselineCount > 0 ? baselineSum / baselineCount : 0;
    const currentAvg = currentCount > 0 ? currentSum / currentCount : 0;
    
    // Percentage increase in path length
    const pctIncrease = baselineAvg > 0 ? ((currentAvg - baselineAvg) / baselineAvg) * 100 : 0;
    // Number of isolated components / disconnected node pairs
    const totalPossiblePairs = (nodes.length * (nodes.length - 1)) / 2;
    const disconnectedPairs = totalPossiblePairs - currentCount;

    return {
      averageCommuteCost: Math.round(currentAvg),
      percentageIncrease: Number(pctIncrease.toFixed(1)),
      disconnectedPairs,
      networkResilienceScore: Math.max(0, Math.round(100 - (pctIncrease * 1.5) - (disconnectedPairs * 15)))
    };
  }, [edges, nodes]);

  // ==========================================
  // AUTOPLAY EFFECT
  // ==========================================
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoplay && viewMode === 'presenter') {
      interval = setInterval(() => {
        setAutoplayProgress(prev => {
          if (prev >= 100) {
            // Move to next slide or loop
            setCurrentSlide(s => (s + 1) % 9);
            return 0;
          }
          return prev + 2; // Increments of progress
        });
      }, 100);
    } else {
      setAutoplayProgress(0);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, viewMode]);

  // Reset progress when slide changes manually
  useEffect(() => {
    setAutoplayProgress(0);
  }, [currentSlide]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'presenter') return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentSlide(prev => (prev + 1) % 9);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide(prev => (prev - 1 + 9) % 9);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  // ==========================================
  // SLIDE RENDERER MODULES
  // ==========================================

  const renderSlideTitle = () => (
    <div className="h-full flex flex-col justify-between p-8 relative overflow-hidden bg-white border-thick shadow-neo-lg rounded-none transition-all duration-300">
      {/* Bold Topo Grid Background Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1a1a1a_2px,transparent_2px)] [background-size:16px_16px]"></div>
      
      {/* Decorative Bold Shapes */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#F97316] opacity-90 border-4 border-black -rotate-12 flex items-center justify-center font-display text-white text-xs select-none">
        <span className="translate-y-4 -translate-x-4 uppercase font-bold tracking-widest text-[9px]">Route Resilience</span>
      </div>
      
      <div className="absolute bottom-12 right-12 w-32 h-32 bg-[#EC4899] border-4 border-black rotate-12 -z-0 opacity-80"></div>
      <div className="absolute top-1/2 left-8 w-8 h-8 rounded-full bg-[#EAB308] border-2 border-black"></div>

      <div className="z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-[#F5F5F0] text-xs font-black uppercase tracking-widest mb-6">
          <Sparkles className="w-4.5 h-4.5 text-[#EAB308]" /> ISRO Hackathon Problem 4
        </div>
        
        <h1 className="font-display text-7xl md:text-8xl leading-none text-black uppercase tracking-tighter drop-shadow-sm select-all">
          NERVA
        </h1>
        <p className="text-xl md:text-2xl font-black text-[#EC4899] uppercase tracking-wide mt-2">
          Network Resilience &amp; Vulnerability Analyzer
        </p>
      </div>

      <div className="z-10 mt-6 max-w-2xl bg-[#FCFCF9] border-medium p-4 shadow-neo">
        <p className="text-md font-bold text-gray-800 leading-relaxed italic border-l-4 border-black pl-3">
          &ldquo;Seeing through spectral occlusion. Quantifying urban topological fragility.&rdquo;
        </p>
      </div>

      <div className="z-10 mt-auto flex flex-wrap items-end justify-between gap-4 border-t-2 border-black pt-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-black opacity-60">Submitted By Team</span>
          <p className="text-xl font-display uppercase tracking-tight text-black flex items-center gap-1.5">
            <span className="inline-block w-4 h-4 bg-[#22C55E] border border-black"></span>
            Tessellate
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase tracking-widest font-black opacity-60">Design Spec</span>
          <p className="text-sm font-mono font-bold text-[#F97316]">CREATIVE_MODE_DECK_V4</p>
        </div>
      </div>
    </div>
  );

  const renderSlideTeam = () => (
    <div className="h-full flex flex-col justify-between p-8 bg-white border-thick shadow-neo-lg rounded-none">
      <div>
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-black text-[#EC4899]">Slide 02 / 09</span>
            <h2 className="font-display text-4xl text-black uppercase tracking-tighter">Team Roster</h2>
          </div>
          <div className="px-3 py-1 bg-[#EAB308] border-medium text-xs font-mono font-bold uppercase shadow-neo-sm">
            Core Members: 2
          </div>
        </div>
        
        <p className="text-sm text-gray-700 font-medium mb-6">
          Meet team <strong className="text-black">Tessellate</strong>. We combine deep computer vision specialization with topological graph intelligence to build fully queryable urban models. Feel free to customize our names below to test presenter view interactivity:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-cream border-medium p-5 shadow-neo relative hover:scale-[1.01] transition-transform duration-200">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-none border-medium bg-black text-white flex items-center justify-center font-mono font-bold text-xs">
                {idx + 1}
              </div>
              <div className="flex gap-4 items-start">
                <div className={`w-12 h-12 ${member.avatarBg} border-medium flex items-center justify-center text-white shrink-0 shadow-neo-sm`}>
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <label className="block text-[9px] font-black uppercase text-gray-500 mb-0.5">Presenter Name</label>
                    <input 
                      type="text" 
                      value={member.name}
                      onChange={(e) => updateMemberName(idx, e.target.value)}
                      className="w-full bg-white border border-black px-2 py-1 text-sm font-black text-black tracking-tight focus:outline-none focus:ring-1 focus:ring-black rounded-none"
                    />
                  </div>
                  <p className="text-xs font-mono font-bold text-black bg-[#EAB308]/40 inline-block px-1.5 py-0.5 rounded-none uppercase mb-2">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-800 leading-relaxed font-medium">
                    {member.focus}
                  </p>
                </div>
              </div>
              <div className="mt-4 border-t border-black/10 pt-3 text-[10px] font-mono font-bold text-gray-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-black" /> {member.college}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-black/10 pt-4 text-xs font-mono font-bold text-gray-500 flex justify-between items-center bg-cream/50 -mx-8 -mb-8 p-4 border-t-2 border-black">
        <span>&bull; ISRO PROBLEM 4: ROUTE RESILIENCE</span>
        <span>TEAM TESSELLATE &bull; BENGALURU</span>
      </div>
    </div>
  );

  const renderSlidePitch = () => (
    <div className="h-full flex flex-col justify-between p-8 bg-white border-thick shadow-neo-lg rounded-none">
      <div>
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-black text-[#EC4899]">Slide 03 / 09</span>
            <h2 className="font-display text-4xl text-black uppercase tracking-tighter">Core Pitch</h2>
          </div>
          <div className="px-3 py-1 bg-[#22C55E] text-white border-medium text-xs font-mono font-bold uppercase shadow-neo-sm">
            Topological Rigor
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Problem Column */}
          <div className="lg:col-span-5 bg-red-50 border-medium p-5 flex flex-col justify-between relative shadow-neo">
            <div>
              <div className="inline-block px-2 py-0.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest mb-3">
                The Bottleneck
              </div>
              <h3 className="font-display text-xl text-red-900 uppercase leading-none mb-3">
                Spectral Blindness
              </h3>
              <p className="text-xs text-red-950 font-medium leading-relaxed mb-4">
                Satellite-based road extraction in dense urban sectors (e.g. Silk Board corridor, Bengaluru) consistently fails. Dense tree canopies, intense structural building shadows, and persistent cloud cover fragment semantic road masks.
              </p>
              <div className="bg-white border border-red-300 p-3 font-mono text-[10px] text-red-800 leading-normal">
                <strong className="text-red-950 uppercase font-bold">Standard loss (IoU/BCE):</strong> Looks at pixel count accuracy. A model scoring 95% pixel-accuracy might leave a 1-pixel break. For pathfinders, that 1-pixel break is an infinite barrier!
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 border-t border-red-200 pt-3">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
              <span className="text-[10px] font-mono font-black text-red-700 uppercase tracking-tight">Broken Topology = Unusable GIS Data</span>
            </div>
          </div>

          {/* Action Column */}
          <div className="lg:col-span-7 bg-cream border-medium p-5 flex flex-col justify-between shadow-neo">
            <div>
              <div className="inline-block px-2 py-0.5 bg-[#22C55E] text-white text-[10px] font-black uppercase tracking-widest mb-3">
                NERVA Intervention
              </div>
              <h3 className="font-display text-xl text-black uppercase leading-none mb-3">
                Continuous Healed Graph Pipeline
              </h3>
              <div className="space-y-3 text-xs font-medium text-gray-800">
                <p>
                  NERVA introduces a novel two-stage architecture that enforces topological continuity mathematically, rather than just optimizing pixel categories:
                </p>
                <div className="border-l-4 border-black pl-3 py-0.5">
                  <strong className="text-black uppercase text-[11px] block">Stage 1: Occlusion-Robust CNN-Transformer</strong>
                  We integrate a pretrained <strong className="text-black">SegFormer-B2</strong> with a topology-aware loss penalty. The model is penalized specifically for introducing disconnected components under canopy clusters.
                </div>
                <div className="border-l-4 border-black pl-3 py-0.5">
                  <strong className="text-black uppercase text-[11px] block">Stage 2: Graph Theory Repair &amp; Analysis</strong>
                  Remaining gaps are bridged with shortest-path spline-stitching. The healed network is mapped as a weighted <strong className="text-black">NetworkX graph</strong> for active stress testing.
                </div>
              </div>
            </div>

            <div className="mt-4 bg-[#FCFCF9] border border-black p-3 rounded-none">
              <span className="text-[9px] font-mono font-black uppercase text-[#EC4899] block tracking-widest mb-1">Our Unique Value Proposition</span>
              <p className="text-xs font-black text-black leading-snug">
                NERVA is the only end-to-end framework translating raw, highly occluded satellite tiles directly into fully queryable, live simulated resilience networks.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-black/10 pt-4 text-xs font-mono font-bold text-gray-500 flex justify-between items-center bg-cream/50 -mx-8 -mb-8 p-4 border-t-2 border-black">
        <span>&bull; ISRO PROBLEM 4: ROUTE RESILIENCE</span>
        <span>THE CRITICAL HYPOTHESIS &bull; TESSELLATE</span>
      </div>
    </div>
  );

  const renderSlideFeatures = () => {
    const features = [
      {
        num: '01',
        title: 'Occlusion-Robust segmentation',
        color: 'bg-[#F97316]',
        desc: 'SegFormer-B2 segmentation combined with topologic-tree connectivity loss to penalize broken structures in real-time.',
        math: 'Loss = L_bce + λ_topo(G_pred, G_gt)'
      },
      {
        num: '02',
        title: 'Automated Topology Stitching',
        color: 'bg-[#EC4899]',
        desc: 'Zhang-Suen skeletonization coupled with automated shortest-path spline bridging to seal canopy-occluded pathways.',
        math: 'Distance Stitching Threshold ≤ 35m'
      },
      {
        num: '03',
        title: 'Graph Criticality Calculations',
        color: 'bg-[#EAB308]',
        desc: 'Calculates Betweenness Centrality on extracted vertices to highlight key logistical single points of failure.',
        math: 'C_B(v) = ∑ (σ_st(v) / σ_st)'
      },
      {
        num: '04',
        title: 'Dynamic Interactive Stress-Testing',
        color: 'bg-[#22C55E]',
        desc: 'Simulate structural failures (flooding, blockades) by toggling edges and instantly viewing routing overhead impact.',
        math: 'ΔL = (L_collapsed - L_base) / L_base'
      },
      {
        num: '05',
        title: 'Live Decision-Maker Dashboard',
        color: 'bg-black text-white',
        desc: 'Interactive react-driven map canvas with vector-tile overlays, heatmap toggles, and immediate structural reports.',
        math: 'UI Map Canvas Frame Rate: 60fps'
      }
    ];

    return (
      <div className="h-full flex flex-col justify-between p-8 bg-white border-thick shadow-neo-lg rounded-none">
        <div>
          <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-5">
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-[#EC4899]">Slide 04 / 09</span>
              <h2 className="font-display text-4xl text-black uppercase tracking-tighter">Feature Breakdown</h2>
            </div>
            <div className="px-3 py-1 bg-[#F97316] text-white border-medium text-xs font-mono font-bold uppercase shadow-neo-sm">
              Features: 5
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, index) => (
              <div 
                key={index} 
                className={`bg-[#FCFCF9] border-medium p-4 flex flex-col justify-between shadow-neo hover:scale-[1.01] transition-all duration-200 ${
                  index === 4 ? 'md:col-span-2 lg:col-span-1 border-[#EC4899]' : ''
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`w-6 h-6 rounded-none ${feat.color} flex items-center justify-center font-mono font-bold text-xs border border-black ${index === 4 ? 'text-white' : 'text-black'}`}>
                      {feat.num}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest bg-cream px-1.5 py-0.5 border">
                      Production Ready
                    </span>
                  </div>
                  
                  <h3 className="font-display text-sm text-black uppercase leading-tight mb-2">
                    {feat.title}
                  </h3>
                  
                  <p className="text-[11px] text-gray-700 leading-relaxed font-medium mb-4">
                    {feat.desc}
                  </p>
                </div>

                <div className="border-t border-black/10 pt-2 font-mono text-[9px] text-[#EC4899] font-black flex items-center gap-1 bg-cream/30 -mx-4 -mb-4 p-2">
                  <Code className="w-3.5 h-3.5 shrink-0 text-black" />
                  <span className="truncate">{feat.math}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-black/10 pt-4 text-xs font-mono font-bold text-gray-500 flex justify-between items-center bg-cream/50 -mx-8 -mb-8 p-4 border-t-2 border-black">
          <span>&bull; ISRO PROBLEM 4: ROUTE RESILIENCE</span>
          <span>CAPABILITY MATRIX &bull; TESSELLATE</span>
        </div>
      </div>
    );
  };

  const renderSlidePipeline = () => {
    const steps = [
      {
        id: 0,
        title: "Satellite Tile Ingestion",
        tech: "Sentinel-2 / Bhuvan APIs",
        color: "border-[#F97316]",
        accentBg: "bg-[#F97316]",
        input: "Multispectral TIFF (RGB, NIR, SWIR)",
        output: "Tensor [B, 4, H, W] Normalized",
        details: "Ingest raw tiles from ISRO's Bhuvan server or Sentinel-2. Apply orthorectification and radiometric calibration. Add Near-Infrared (NIR) spectrum as a fourth input band to support canopy penetration using the NDVI vegetation index."
      },
      {
        id: 1,
        title: "SegFormer + TopoLoss",
        tech: "PyTorch / HuggingFace",
        color: "border-[#EC4899]",
        accentBg: "bg-[#EC4899]",
        input: "Normalized Spectral Tensor",
        output: "Continuous Probability Road Mask",
        details: "Inference via fine-tuned SegFormer-B2. We penalize disconnects using persistent homology (Euler characteristic curves) computed on the output manifold, forcing the model to resolve occlusion shadows correctly."
      },
      {
        id: 2,
        title: "Discontinuity Stitching",
        tech: "Zhang-Suen / GUDHI",
        color: "border-[#EAB308]",
        accentBg: "bg-[#EAB308]",
        input: "Raw Probability Road Mask",
        output: "Healed & Skeletonized Graph Nodes",
        details: "Sparsify probability masks into 1px thin skeletons. Run local search window vectors to detect broken terminal nodes (degree = 1). Stitch components across shadows with localized shortest path spine-fitting."
      },
      {
        id: 3,
        title: "Weighted Graph Generation",
        tech: "NetworkX Engine",
        color: "border-[#22C55E]",
        accentBg: "bg-[#22C55E]",
        input: "Sparsified Skeleton Arrays",
        output: "Directed Weighted Graph G=(V,E)",
        details: "Transform junctions into graph vertices and continuous roads into weighted edges. Compute edge capacities and weight metrics leveraging inferred widths and spatial connection densities."
      },
      {
        id: 4,
        title: "Criticality Calculations",
        tech: "NetworkX / Centrality solvers",
        color: "border-black",
        accentBg: "bg-black",
        input: "Directed Weighted Graph",
        output: "Centrality Heap & Bridge Nodes",
        details: "Measure network fragility. Calculate vertex betweenness centrality, local clustering coefficients, and detect bridges (edges whose removal splits the city into disconnected subgraphs) in sub-second cycles."
      },
      {
        id: 5,
        title: "Decision Dashboard Viz",
        tech: "React / Leaflet Client",
        color: "border-black",
        accentBg: "bg-cream text-black",
        input: "Criticality GeoJSON payload",
        output: "Interactive Resilience Dashboard",
        details: "Render interactive map client overlays. Display heatmapped critical bottlenecks. Expose toggle simulation handlers to disaster response teams to coordinate emergency routing scenarios."
      }
    ];

    return (
      <div className="h-full flex flex-col justify-between p-8 bg-white border-thick shadow-neo-lg rounded-none">
        <div>
          <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-[#EC4899]">Slide 05 / 09</span>
              <h2 className="font-display text-4xl text-black uppercase tracking-tighter">Process Flow</h2>
            </div>
            <div className="px-3 py-1 bg-[#22C55E] text-white border-medium text-xs font-mono font-bold uppercase shadow-neo-sm">
              End-To-End Pipeline
            </div>
          </div>

          <p className="text-xs text-gray-700 font-medium mb-4">
            NERVA parses raw satellite tiles into actionable resilience graphs in an automated six-stage computational process. Click any pipeline step below to inspect its data specs:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Step Selection List */}
            <div className="lg:col-span-5 space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
              {steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveProcessStep(idx)}
                  className={`w-full text-left p-2.5 border-medium flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    activeProcessStep === idx 
                      ? 'bg-black text-white border-black shadow-neo-sm -translate-y-0.5' 
                      : 'bg-[#FCFCF9] text-black hover:bg-cream border-black'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-5 h-5 shrink-0 text-[10px] font-mono font-bold flex items-center justify-center border border-black ${
                      activeProcessStep === idx ? 'bg-white text-black' : step.accentBg + ' text-black'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold uppercase truncate tracking-tight">{step.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                    activeProcessStep === idx ? 'rotate-90 text-[#EAB308]' : 'text-gray-400'
                  }`} />
                </button>
              ))}
            </div>

            {/* Selected Step Technical Details */}
            <div className={`lg:col-span-7 bg-[#FCFCF9] border-2 border-black p-5 shadow-neo flex flex-col justify-between ${steps[activeProcessStep].color}`}>
              <div>
                <div className="flex justify-between items-center border-b border-black/10 pb-2.5 mb-3">
                  <span className="text-[10px] font-mono font-black text-[#EC4899] uppercase tracking-wider bg-cream border px-2 py-0.5">
                    Engine: {steps[activeProcessStep].tech}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-gray-400">
                    STAGE {activeProcessStep + 1} / 6
                  </span>
                </div>

                <h3 className="font-display text-md text-black uppercase leading-tight mb-3">
                  {steps[activeProcessStep].title}
                </h3>

                <p className="text-xs text-gray-700 leading-relaxed font-medium mb-4">
                  {steps[activeProcessStep].details}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-cream border border-black p-3 font-mono text-[9px]">
                <div className="border-r border-black/10 pr-2">
                  <span className="text-gray-500 uppercase font-bold block mb-1">INPUT PAYLOAD</span>
                  <span className="text-black font-semibold break-all">{steps[activeProcessStep].input}</span>
                </div>
                <div className="pl-1">
                  <span className="text-gray-500 uppercase font-bold block mb-1">OUTPUT PAYLOAD</span>
                  <span className="text-black font-semibold break-all">{steps[activeProcessStep].output}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-black/10 pt-4 text-xs font-mono font-bold text-gray-500 flex justify-between items-center bg-cream/50 -mx-8 -mb-8 p-4 border-t-2 border-black">
          <span>&bull; ISRO PROBLEM 4: ROUTE RESILIENCE</span>
          <span>COMPUTATION FLOW CHART &bull; TESSELLATE</span>
        </div>
      </div>
    );
  };

  const renderSlideWireframe = () => {
    // Count active collapsed edges
    const collapsedCount = edges.filter(e => e.collapsed).length;

    return (
      <div className="h-full flex flex-col justify-between p-8 bg-white border-thick shadow-neo-lg rounded-none">
        <div>
          <div className="flex justify-between items-start border-b-2 border-black pb-3 mb-3">
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-[#EC4899]">Slide 06 / 09</span>
              <h2 className="font-display text-4xl text-black uppercase tracking-tighter">Live Simulation Dashboard</h2>
            </div>
            <div className="px-3 py-1 bg-[#EAB308] border-medium text-xs font-mono font-bold uppercase shadow-neo-sm">
              Demo Sandbox
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
            {/* Left: Map Sandbox */}
            <div className="xl:col-span-7 bg-[#E5E5DB] border-medium p-4 relative flex flex-col min-h-[350px] shadow-neo overflow-hidden">
              {/* Grid Background Mock */}
              <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[radial-gradient(#1a1a1a_2px,transparent_2px)] [background-size:12px_12px]"></div>
              
              {/* Map controls */}
              <div className="relative z-10 flex justify-between items-center bg-white border border-black p-2 mb-3 shadow-neo-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-black">Active Zone: Bengaluru-South</span>
                </div>
                <button 
                  onClick={resetDemo}
                  disabled={collapsedCount === 0}
                  className={`px-2 py-0.5 border text-[9px] font-mono font-bold uppercase tracking-tight transition-all cursor-pointer ${
                    collapsedCount > 0 
                      ? 'bg-[#EC4899] text-white border-black hover:bg-[#c22d7c] shadow-neo-sm' 
                      : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                  }`}
                >
                  Reset Infrastructure
                </button>
              </div>

              {/* Map Canvas (SVG) */}
              <div className="relative flex-1 bg-white border border-black/40 min-h-[220px] rounded-none shadow-inner overflow-hidden">
                {/* Simulated Street View Lines in background */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                  <line x1="0" y1="50" x2="400" y2="150" stroke="#000" strokeWidth="4" />
                  <line x1="100" y1="0" x2="100" y2="300" stroke="#000" strokeWidth="3" />
                  <line x1="250" y1="50" x2="250" y2="300" stroke="#000" strokeWidth="6" />
                </svg>

                {/* Draw edges (Road links) */}
                <svg className="absolute inset-0 w-full h-full">
                  {edges.map((edge) => {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    const toNode = nodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;

                    // Convert percents to approximate coords
                    const x1 = `${fromNode.x}%`;
                    const y1 = `${fromNode.y}%`;
                    const x2 = `${toNode.x}%`;
                    const y2 = `${toNode.y}%`;

                    // Determine stroke color based on state and criticality
                    let strokeColor = '#22C55E'; // green for LOW risk
                    if (edge.criticality === 'MEDIUM') strokeColor = '#F97316'; // orange
                    if (edge.criticality === 'HIGH') strokeColor = '#EC4899'; // pink
                    if (edge.collapsed) strokeColor = '#EF4444'; // bright blood red

                    const strokeDash = edge.collapsed ? '6,6' : 'none';
                    const strokeWidth = edge.collapsed ? 4 : edge.criticality === 'HIGH' ? 5 : 3.5;

                    return (
                      <g key={edge.id} className="cursor-pointer" onClick={() => toggleEdgeCollapse(edge.id)}>
                        {/* Interactive Click Target Padding Line */}
                        <line 
                          x1={x1} y1={y1} x2={x2} y2={y2} 
                          stroke="transparent" 
                          strokeWidth="16" 
                          className="hover:stroke-black/5 transition-colors duration-150"
                        />
                        {/* Actual Road Line */}
                        <line 
                          x1={x1} y1={y1} x2={x2} y2={y2} 
                          stroke={strokeColor} 
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDash}
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}

                  {/* Draw nodes (Intersections) */}
                  {nodes.map((node) => {
                    // Check if node is connected to any collapsed edges
                    const hasCollapsedEdge = edges.some(e => e.collapsed && (e.from === node.id || e.to === node.id));

                    return (
                      <g key={node.id}>
                        <circle 
                          cx={`${node.x}%`} 
                          cy={`${node.y}%`} 
                          r={hasCollapsedEdge ? 8 : 6} 
                          fill={hasCollapsedEdge ? '#EF4444' : '#1A1A1A'} 
                          stroke="#FFFFFF" 
                          strokeWidth="2"
                          className="transition-all duration-300"
                        />
                        <text 
                          x={`${node.x}%`} 
                          y={`${node.y - 4}%`} 
                          textAnchor="middle" 
                          className="font-mono text-[9px] font-black text-black bg-white/90 select-none pointer-events-none drop-shadow-sm"
                        >
                          {node.name.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Instructions Helper overlay inside map */}
                <div className="absolute bottom-2 left-2 bg-black/90 text-white font-mono text-[8px] p-1.5 uppercase tracking-wider select-none">
                  ⚡ Click road segments to toggle occlusion collapses!
                </div>
              </div>
            </div>

            {/* Right: Stress Test Analysis Metrics Panel */}
            <div className="xl:col-span-5 flex flex-col justify-between space-y-4">
              {/* Simulation Metrics Bento */}
              <div className="bg-[#FCFCF9] border-medium p-4 shadow-neo flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-sm text-black uppercase border-b-2 border-black pb-2 mb-3">
                    Calculated Resilience Metrics
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Commute overhead */}
                    <div className="bg-cream border p-2.5 flex flex-col justify-center">
                      <span className="text-[8px] font-mono font-bold text-gray-500 uppercase tracking-wider">Average Route Cost</span>
                      <span className="text-xl font-display text-black">{pathMetrics.averageCommuteCost} min</span>
                      <span className="text-[8px] font-mono text-gray-400 mt-1">Dijkstra cost unit</span>
                    </div>

                    {/* Path increase percentage */}
                    <div className={`border p-2.5 flex flex-col justify-center transition-colors duration-300 ${
                      pathMetrics.percentageIncrease > 0 ? 'bg-red-50 border-red-200' : 'bg-cream border-gray-200'
                    }`}>
                      <span className="text-[8px] font-mono font-bold text-gray-500 uppercase tracking-wider">Commute Increase</span>
                      <span className={`text-xl font-display ${pathMetrics.percentageIncrease > 0 ? 'text-red-600' : 'text-black'}`}>
                        +{pathMetrics.percentageIncrease}%
                      </span>
                      <span className="text-[8px] font-mono text-gray-400 mt-1">Over baseline grid</span>
                    </div>

                    {/* Disconnected Pairs */}
                    <div className="bg-cream border p-2.5 flex flex-col justify-center">
                      <span className="text-[8px] font-mono font-bold text-gray-500 uppercase tracking-wider">Isolated Node Pairs</span>
                      <span className="text-xl font-display text-black">{pathMetrics.disconnectedPairs} / 15</span>
                      <span className="text-[8px] font-mono text-gray-400 mt-1">No continuous route</span>
                    </div>

                    {/* Resilience Score */}
                    <div className={`border p-2.5 flex flex-col justify-center transition-colors duration-300 ${
                      pathMetrics.networkResilienceScore < 70 ? 'bg-red-50 border-red-300' : 'bg-[#22C55E]/10 border-[#22C55E]/30'
                    }`}>
                      <span className="text-[8px] font-mono font-bold text-gray-500 uppercase tracking-wider">Global Resilience</span>
                      <span className={`text-xl font-display ${
                        pathMetrics.networkResilienceScore < 70 ? 'text-red-600' : 'text-[#22C55E]'
                      }`}>
                        {pathMetrics.networkResilienceScore}%
                      </span>
                      <span className="text-[8px] font-mono text-gray-400 mt-1">G_eff dynamic index</span>
                    </div>
                  </div>
                </div>

                {/* Analysis Report block */}
                <div className="bg-[#1A1A1A] text-white p-3 font-mono text-[10px] leading-relaxed">
                  <span className="text-[#EAB308] font-black uppercase text-[9px] tracking-wider block mb-1">
                    System Report // {collapsedCount === 0 ? 'STATUS HEALTHY' : `SIMULATED FRAGILITY INCIDENT`}
                  </span>
                  {collapsedCount === 0 ? (
                    <p className="text-gray-300 text-[9px]">
                      Bengaluru-South corridor operates optimally. Tree foliage occlusions successfully neutralized via fine-tuned SegFormer-B2 and spline-stitching filters. Grid connectivity stands at 100%.
                    </p>
                  ) : (
                    <div className="space-y-1.5 text-[9px]">
                      <p className="text-red-400 font-bold">
                        ALERT: {collapsedCount} network segment{collapsedCount > 1 ? 's' : ''} severed. Average city commute distance increased by {pathMetrics.percentageIncrease}%.
                      </p>
                      <p className="text-gray-400">
                        {pathMetrics.disconnectedPairs > 0 
                          ? `CRITICAL FAILURE: ${pathMetrics.disconnectedPairs} node pairings are entirely stranded. Emergency routing fails.`
                          : 'Topological healing retains grid reachability, but congestion metrics spike along Outer Ring Road vectors.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 border-t border-black/10 pt-4 text-xs font-mono font-bold text-gray-500 flex justify-between items-center bg-cream/50 -mx-8 -mb-8 p-4 border-t-2 border-black">
          <span>&bull; ISRO PROBLEM 4: ROUTE RESILIENCE</span>
          <span>BENGALURU CORRIDOR DEMO &bull; TESSELLATE</span>
        </div>
      </div>
    );
  };

  const renderSlideArchitecture = () => {
    // Technical specs database for interactive inspection
    const layersSpecs: Record<string, {
      title: string;
      framework: string;
      input: string;
      output: string;
      desc: string;
      code: string;
    }> = {
      ml: {
        title: "Stage 1: Segmentation ML Core",
        framework: "PyTorch & HuggingFace (SegFormer-B2)",
        input: "Sentinel-2 Multi-spectral Tensors [B, 4, 512, 512]",
        output: "Raw Binary Segmentation Probability Map [B, 1, 512, 512]",
        desc: "We fine-tune an pre-trained SegFormer-B2 semantic segmentation encoder-decoder on the DeepGlobe Roads and Bhuvan datasets. The standard cross-entropy loss function is enhanced with a custom Euler topological connectivity penalty. This penalty explicitly computes 1D persistent homology barcodes and penalizes the network for forming disconnected spatial clusters.",
        code: `class TopologyLoss(nn.Module):
    def __init__(self, lambda_topo=0.15):
        super().__init__()
        self.lambda_topo = lambda_topo
        
    def forward(self, pred, target):
        bce = F.binary_cross_entropy_with_logits(pred, target)
        # Compute persistent homology Euler curve penalty
        topo_penalty = compute_euler_characteristic_loss(pred, target)
        return bce + (self.lambda_topo * topo_penalty)`
      },
      solver: {
        title: "Stage 2: Graph Extraction & Stitching",
        framework: "Python / Zhang-Suen / GUDHI",
        input: "Segmentation Probability Road Mask [512, 512]",
        output: "NetworkX Weighted Adjacency Matrix",
        desc: "To bridge fragmented mask fragments under dense canopies, we skeletonize the masks to 1px wide lines using the parallel Zhang-Suen thinning algorithm. Any gaps within a threshold distance (≤ 35m) are automatically bridged via shortest-path cubic spline interpolation. Intersections are then categorized as graph nodes, and road lengths are mapped to graph edge weights.",
        code: `def stitch_road_gaps(skeleton_array, max_gap_m=35):
    # Detect endpoint nodes (degree == 1)
    endpoints = get_skeleton_endpoints(skeleton_array)
    # Build pairwise distance matrix for endpoints
    dist_matrix = compute_spatial_distances(endpoints)
    # Bridge matching nodes using shortest-path spline
    for u, v in find_candidate_bridges(dist_matrix, max_gap_m):
        skeleton_array = draw_cubic_spline(skeleton_array, u, v)
    return skeleton_array`
      },
      api: {
        title: "API Gateway Service layer",
        framework: "FastAPI / Uvicorn",
        input: "JSON coordinate coordinate tuples & Node/Edge toggle requests",
        output: "GeoJSON FeatureCollections with Centrality metrics",
        desc: "An asynchronous FastAPI backend service serves as the core broker between the UI and spatial graph models. Real-time Dijkstra routing calculations and graph centrality recomputations are triggered in asynchronous thread pools, enabling sub-second simulation latencies for large municipal scale networks.",
        code: `@app.post("/api/resilience/simulate")
async def simulate_failure(collapsed_edges: list[str]):
    # Instantiate active graph copy
    G_temp = G_base.copy()
    # Prune simulated collapsed road links
    for edge_id in collapsed_edges:
        G_temp.remove_edge(*edge_id.split("-"))
    # Re-evaluate Global Network Efficiency
    eff = compute_global_efficiency(G_temp)
    return {"status": "success", "network_efficiency": eff}`
      },
      frontend: {
        title: "GIS Decision Client",
        framework: "React / Leaflet & deck.gl",
        input: "FastAPI JSON payload output",
        output: "Dynamic interactive canvas rendering",
        desc: "A responsive desktop-first dashboard rendered via React and standard Tailwind CSS, optimized for emergency dispatch units. Interactive overlays represent road networks via SVG paths or deck.gl GPU canvas layers, enabling smooth pan-and-zoom and reactive interactions.",
        code: `export default function MapOverlay({ roads, onToggle }) {
  return (
    <svg className="absolute inset-0 w-full h-full">
      {roads.map(road => (
        <line 
          key={road.id}
          x1={road.x1} y1={road.y1}
          x2={road.x2} y2={road.y2}
          stroke={road.collapsed ? '#EF4444' : '#22C55E'}
          className="transition-colors duration-300"
          onClick={() => onToggle(road.id)}
        />
      ))}
    </svg>
  );
}`
      }
    };

    return (
      <div className="h-full flex flex-col justify-between p-8 bg-white border-thick shadow-neo-lg rounded-none">
        <div>
          <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-[#EC4899]">Slide 07 / 09</span>
              <h2 className="font-display text-4xl text-black uppercase tracking-tighter">System Architecture</h2>
            </div>
            <div className="px-3 py-1 bg-[#F97316] text-white border-medium text-xs font-mono font-bold uppercase shadow-neo-sm">
              Technical Design
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left: Interactive Node Selector */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              <span className="text-[10px] font-mono font-black uppercase text-gray-500 tracking-wider mb-1 block">
                Interactive System Blocks:
              </span>
              
              <button 
                onClick={() => setSelectedArchLayer('ml')}
                className={`text-left p-3 border-medium transition-all cursor-pointer flex items-center justify-between ${
                  selectedArchLayer === 'ml' ? 'bg-[#EC4899] text-white shadow-neo-sm' : 'bg-[#FCFCF9] text-black hover:bg-cream'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Cpu className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-tight truncate">1. Segmentation ML Pipeline</span>
                </div>
              </button>

              <button 
                onClick={() => setSelectedArchLayer('solver')}
                className={`text-left p-3 border-medium transition-all cursor-pointer flex items-center justify-between ${
                  selectedArchLayer === 'solver' ? 'bg-[#EAB308] text-black shadow-neo-sm' : 'bg-[#FCFCF9] text-black hover:bg-cream'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <GitFork className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-tight truncate">2. Topological Graph solver</span>
                </div>
              </button>

              <button 
                onClick={() => setSelectedArchLayer('api')}
                className={`text-left p-3 border-medium transition-all cursor-pointer flex items-center justify-between ${
                  selectedArchLayer === 'api' ? 'bg-[#22C55E] text-white shadow-neo-sm' : 'bg-[#FCFCF9] text-black hover:bg-cream'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Server className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-tight truncate">3. FastAPI async Gateway</span>
                </div>
              </button>

              <button 
                onClick={() => setSelectedArchLayer('frontend')}
                className={`text-left p-3 border-medium transition-all cursor-pointer flex items-center justify-between ${
                  selectedArchLayer === 'frontend' ? 'bg-black text-white shadow-neo-sm' : 'bg-[#FCFCF9] text-black hover:bg-cream'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Map className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-tight truncate">4. React GIS Client</span>
                </div>
              </button>
            </div>

            {/* Right: Technical Inspector Screen */}
            <div className="lg:col-span-8 bg-[#FCFCF9] border-medium p-4 shadow-neo flex flex-col justify-between overflow-hidden">
              <div className="min-h-[140px]">
                <div className="flex justify-between items-center border-b border-black/10 pb-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-black uppercase tracking-widest bg-cream px-1.5 py-0.5 border">
                    {layersSpecs[selectedArchLayer].framework}
                  </span>
                  <span className="text-[9px] font-mono text-gray-400">
                    COMPONENT PROFILE
                  </span>
                </div>
                
                <h3 className="font-display text-sm text-black uppercase tracking-tight mb-2">
                  {layersSpecs[selectedArchLayer].title}
                </h3>
                
                <p className="text-[11px] text-gray-700 leading-relaxed mb-4">
                  {layersSpecs[selectedArchLayer].desc}
                </p>
              </div>

              {/* Code Snippet Box */}
              <div className="bg-[#1a1a1a] text-white p-3 border-t-2 border-black font-mono text-[9px] overflow-x-auto select-all max-h-[150px]">
                <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1.5 text-gray-400">
                  <span>Source Excerpt ({selectedArchLayer === 'ml' || selectedArchLayer === 'solver' ? 'python' : 'typescript'})</span>
                  <Code className="w-3.5 h-3.5" />
                </div>
                <pre className="leading-tight text-green-400">{layersSpecs[selectedArchLayer].code}</pre>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-black/10 pt-4 text-xs font-mono font-bold text-gray-500 flex justify-between items-center bg-cream/50 -mx-8 -mb-8 p-4 border-t-2 border-black">
          <span>&bull; ISRO PROBLEM 4: ROUTE RESILIENCE</span>
          <span>SYSTEM CORE INTERNALS &bull; TESSELLATE</span>
        </div>
      </div>
    );
  };

  const renderSlideStack = () => {
    const stackItems = [
      {
        category: "AI / ML Segment",
        color: "border-[#EC4899]",
        items: [
          { name: "PyTorch", use: "Core deep learning backend framework for inference." },
          { name: "SegFormer-B2", use: "Symmetric transformer Outstanding for complex shadows." },
          { name: "GUDHI Library", use: "Computes persistent homology to evaluate topological loss." }
        ]
      },
      {
        category: "Graph Engine Segment",
        color: "border-[#EAB308]",
        items: [
          { name: "NetworkX", use: "Python mathematical framework to handle directed graphs." },
          { name: "SciPy Sparse", use: "Accelerated Floyd-Warshall/Dijkstra distance matrices." },
          { name: "Fiona / Shapely", use: "Provides geospatial geometry & projection vector operations." }
        ]
      },
      {
        category: "Client & Service Delivery",
        color: "border-[#22C55E]",
        items: [
          { name: "FastAPI Gateway", use: "Asynchronous high-performance service endpoints." },
          { name: "React.js + TS", use: "Core component structure for responsive decision tools." },
          { name: "Leaflet / deck.gl", use: "High performance rendering on GPU canvases." }
        ]
      },
      {
        category: "Geospatial Datasets",
        color: "border-black",
        items: [
          { name: "ISRO Bhuvan", use: "Multispectral satellite tile feeds (LISS-IV)." },
          { name: "Sentinel-2 Tile Feeds", use: "Orthorectified imagery for near-real-time updates." },
          { name: "DeepGlobe Roads", use: "Benchmark ground truth labels for occluded path training." }
        ]
      }
    ];

    return (
      <div className="h-full flex flex-col justify-between p-8 bg-white border-thick shadow-neo-lg rounded-none">
        <div>
          <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-[#EC4899]">Slide 08 / 09</span>
              <h2 className="font-display text-4xl text-black uppercase tracking-tighter">Technology Stack</h2>
            </div>
            <div className="px-3 py-1 bg-black text-white border-medium text-xs font-mono font-bold uppercase shadow-neo-sm">
              FOSS Core
            </div>
          </div>

          <p className="text-xs text-gray-700 font-medium mb-4">
            NERVA is engineered completely using performant Open Source Software (FOSS) frameworks and open geospatial protocols, eliminating proprietary lock-in:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stackItems.map((cat, idx) => (
              <div key={idx} className={`bg-[#FCFCF9] border-medium p-4 shadow-neo flex flex-col justify-between ${cat.color}`}>
                <h3 className="font-display text-xs text-black uppercase border-b border-black pb-1.5 mb-2.5">
                  {cat.category}
                </h3>
                
                <div className="space-y-3">
                  {cat.items.map((item, iIdx) => (
                    <div key={iIdx} className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-black rounded-none"></span>
                        <strong className="text-xs font-black uppercase text-[#EC4899] font-mono tracking-tight">{item.name}</strong>
                      </div>
                      <p className="text-[10px] text-gray-700 font-medium leading-normal pl-3">{item.use}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-black/10 pt-4 text-xs font-mono font-bold text-gray-500 flex justify-between items-center bg-cream/50 -mx-8 -mb-8 p-4 border-t-2 border-black">
          <span>&bull; ISRO PROBLEM 4: ROUTE RESILIENCE</span>
          <span>TECHNOLOGY SPECIFICATIONS &bull; TESSELLATE</span>
        </div>
      </div>
    );
  };

  const renderSlideBudget = () => {
    return (
      <div className="h-full flex flex-col justify-between p-8 bg-white border-thick shadow-neo-lg rounded-none">
        <div>
          <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-[#EC4899]">Slide 09 / 09</span>
              <h2 className="font-display text-4xl text-black uppercase tracking-tighter">Budget &amp; Scaling</h2>
            </div>
            <div className="px-3 py-1 bg-[#F97316] text-white border-medium text-xs font-mono font-bold uppercase shadow-neo-sm">
              Financial Strategy
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Financial details list */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="bg-[#FCFCF9] border-medium p-4 shadow-neo">
                <h3 className="font-display text-sm text-black uppercase border-b border-black pb-2 mb-3">
                  Open Source Cost Optimization
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed font-medium mb-3">
                  Traditional GIS infrastructure deployment involves heavy commercial satellite licensing and proprietary server software (e.g., ArcGIS Enterprise). NERVA scales municipal monitoring on open datasets:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[10px] border-collapse">
                    <thead>
                      <tr className="bg-black text-white">
                        <th className="p-1.5 uppercase font-bold">Category</th>
                        <th className="p-1.5 uppercase font-bold">Source Detail</th>
                        <th className="p-1.5 uppercase font-bold text-right">Cost (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 text-gray-800">
                      <tr>
                        <td className="p-1.5 font-bold">Satellite Data</td>
                        <td className="p-1.5 italic">ISRO Bhuvan / Sentinel APIs</td>
                        <td className="p-1.5 text-right font-black">₹0 (Open Data)</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-bold">ML Core Engine</td>
                        <td className="p-1.5 italic">Pre-trained SegFormer (MIT)</td>
                        <td className="p-1.5 text-right font-black">₹0 (Open Source)</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-bold">Training Compute</td>
                        <td className="p-1.5 italic">AWS g4dn.2xlarge GPU (Spot)</td>
                        <td className="p-1.5 text-right font-black">₹12,400 (one-off)</td>
                      </tr>
                      <tr className="bg-cream">
                        <td className="p-1.5 font-bold">Production Hosting</td>
                        <td className="p-1.5 italic">Serverless GCP Cloud Run</td>
                        <td className="p-1.5 text-right font-black">₹1,500/mo (Dynamic)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pitch justification */}
              <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 p-3 font-mono text-[10px] leading-relaxed text-emerald-950">
                <strong className="text-[#22C55E] uppercase font-bold text-[9px] tracking-wider block mb-1">
                  Value Pitch // Minimal Overhead
                </strong>
                By utilizing serverless containers that scale-to-zero when no planners are queries active, operating costs approach near-zero levels during peacetime monitoring.
              </div>
            </div>

            {/* Right: Scaling Bento */}
            <div className="lg:col-span-5 bg-cream border-medium p-5 flex flex-col justify-between shadow-neo">
              <div>
                <span className="text-[9px] font-mono font-black uppercase text-[#EC4899] block tracking-widest mb-1.5">
                  48-Hour Municipal Porting
                </span>
                <h3 className="font-display text-lg text-black uppercase leading-tight mb-3">
                  Rapid Scale-Out Blueprint
                </h3>
                <div className="space-y-3 text-xs font-medium text-gray-800">
                  <div className="flex gap-2">
                    <span className="w-5 h-5 shrink-0 bg-black text-white font-mono font-bold text-[10px] flex items-center justify-center">A</span>
                    <p><strong>Config Porting:</strong> Simply input center latitudes of any municipal sector to spin up pipeline instances.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-5 h-5 shrink-0 bg-black text-white font-mono font-bold text-[10px] flex items-center justify-center">B</span>
                    <p><strong>Zero Retraining Required:</strong> Our topology-aware loss generalizes outstandingly to other Indian Tier-1 cities.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-5 h-5 shrink-0 bg-black text-white font-mono font-bold text-[10px] flex items-center justify-center">C</span>
                    <p><strong>Sentinel Integration:</strong> Real-time processing triggers on Sentinel satellite orbit overhead passes.</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t-2 border-black pt-4 text-center">
                <div className="text-[10px] font-mono font-black uppercase bg-[#EAB308] text-black px-2 py-1.5 border border-black shadow-neo-sm">
                  Production Deployment Ready
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-black/10 pt-4 text-xs font-mono font-bold text-gray-500 flex justify-between items-center bg-cream/50 -mx-8 -mb-8 p-4 border-t-2 border-black">
          <span>&bull; ISRO PROBLEM 4: ROUTE RESILIENCE</span>
          <span>BUDGET &amp; COMMERCIAL COMPARISONS &bull; TESSELLATE</span>
        </div>
      </div>
    );
  };

  // List of slides for convenient rendering index
  const slideViews = [
    { title: 'Title & Introduction', render: renderSlideTitle, num: '01' },
    { title: 'Team Tessellate', render: renderSlideTeam, num: '02' },
    { title: 'Core Problem & Pitch', render: renderSlidePitch, num: '03' },
    { title: 'Feature Breakdown', render: renderSlideFeatures, num: '04' },
    { title: 'Computational Pipeline', render: renderSlidePipeline, num: '05' },
    { title: 'Interactive Dashboard Demo', render: renderSlideWireframe, num: '06' },
    { title: 'Technical Architecture', render: renderSlideArchitecture, num: '07' },
    { title: 'Open Source Tech Stack', render: renderSlideStack, num: '08' },
    { title: 'Budget & Rapid Scaling', render: renderSlideBudget, num: '09' }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] p-4 md:p-6 flex flex-col justify-between font-sans selection:bg-[#EC4899] selection:text-white">
      {/* ==========================================
          HEADER SECTION
         ========================================== */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 border-b-4 border-black pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-mono font-black uppercase bg-black text-[#F5F5F0] px-1.5 py-0.5 tracking-widest">
              ISRO HACKATHON
            </span>
            <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest">
              PROBLEM 4: ROUTE RESILIENCE
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tighter leading-none text-black flex items-center gap-2">
            NERVA
            <span className="text-xs font-mono font-bold tracking-widest text-[#EC4899] border-medium px-2 py-0.5 bg-white select-all">
              VULNERABILITY_SOLVER
            </span>
          </h1>
        </div>

        {/* View Mode & Global control switches */}
        <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0 bg-white border-medium p-1.5 shadow-neo-sm">
          <button
            onClick={() => setViewMode('presenter')}
            className={`px-3 py-1 text-xs font-mono font-black uppercase tracking-tight flex items-center gap-1.5 cursor-pointer transition-all ${
              viewMode === 'presenter' 
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-cream'
            }`}
          >
            <Tv className="w-3.5 h-3.5" /> Presenter View
          </button>
          
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 text-xs font-mono font-black uppercase tracking-tight flex items-center gap-1.5 cursor-pointer transition-all ${
              viewMode === 'grid' 
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-cream'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> Grid Overview
          </button>
        </div>
      </header>

      {/* ==========================================
          MAIN AREA: GRID OVERVIEW MODE
         ========================================== */}
      {viewMode === 'grid' && (
        <div className="flex-1">
          <div className="bg-[#EAB308]/20 border-medium p-4 mb-6 shadow-neo flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Info className="w-5 h-5 text-black shrink-0" />
              <p className="text-xs font-bold text-gray-800 leading-normal">
                <strong className="text-black">Design-Led Grid Overview:</strong> This view exposes all 9 slides concurrently utilizing bold typography borders and color blocking. Click any slide card below to immediately jump into active Presenter View!
              </p>
            </div>
            <button 
              onClick={() => setViewMode('presenter')}
              className="hidden md:block px-3 py-1.5 bg-black text-white font-mono text-xs font-black uppercase tracking-wider border border-black hover:bg-gray-800 transition-all shadow-neo-sm cursor-pointer"
            >
              Launch Presenter Mode
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slideViews.map((slide, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  setViewMode('presenter');
                }}
                className="group relative bg-white border-medium shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer p-5 flex flex-col justify-between min-h-[220px]"
              >
                {/* Accent Top Bar */}
                <div className={`absolute top-0 left-0 right-0 h-2 border-b-2 border-black ${
                  idx % 4 === 0 ? 'bg-[#F97316]' : idx % 4 === 1 ? 'bg-[#EC4899]' : idx % 4 === 2 ? 'bg-[#EAB308]' : 'bg-[#22C55E]'
                }`}></div>

                <div className="flex justify-between items-start mt-2">
                  <span className="text-[10px] font-mono font-black text-gray-400">SLIDE {slide.num}</span>
                  <span className="w-5 h-5 rounded-none bg-black text-white text-[9px] font-mono font-bold flex items-center justify-center border border-black group-hover:bg-[#EC4899] transition-colors">
                    {idx + 1}
                  </span>
                </div>

                <div className="my-4">
                  <h3 className="font-display text-lg text-black uppercase tracking-tight group-hover:text-[#EC4899] transition-colors">
                    {slide.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-mono mt-1 uppercase">
                    ISRO Problem 4 Section
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-black/10 pt-2 text-[10px] font-mono font-bold text-gray-400">
                  <span>TESSELLATE // 2026</span>
                  <span className="text-black group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Inspect Slide <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          MAIN AREA: PRESENTER VIEW MODE
         ========================================== */}
      {viewMode === 'presenter' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-3 flex flex-col justify-between bg-white border-medium p-4 shadow-neo">
            <div>
              <div className="border-b-2 border-black pb-2 mb-3">
                <span className="text-[10px] font-mono font-black text-[#EC4899] uppercase tracking-wider block">
                  Deck Index List:
                </span>
                <p className="text-xs font-bold text-gray-500">
                  Toggle slides or use arrow keys
                </p>
              </div>

              <nav className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {slideViews.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-full text-left p-2 border-medium transition-all cursor-pointer flex items-center justify-between ${
                      currentSlide === idx 
                        ? 'bg-black text-white border-black shadow-neo-sm -translate-y-0.5' 
                        : 'bg-[#FCFCF9] text-black hover:bg-cream border-black'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-5 h-5 shrink-0 text-[9px] font-mono font-black flex items-center justify-center border border-black ${
                        currentSlide === idx 
                          ? 'bg-white text-black' 
                          : idx % 4 === 0 ? 'bg-[#F97316]' : idx % 4 === 1 ? 'bg-[#EC4899]' : idx % 4 === 2 ? 'bg-[#EAB308]' : 'bg-[#22C55E]'
                      }`}>
                        {slide.num}
                      </span>
                      <span className="text-xs font-bold uppercase truncate tracking-tight">{slide.title}</span>
                    </div>
                    {currentSlide === idx && (
                      <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse shrink-0 ml-1"></span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Helper card at bottom of index */}
            <div className="mt-4 pt-3 border-t border-black/10 text-[10px] font-mono font-bold text-gray-500 space-y-1.5 bg-cream/40 -mx-4 -mb-4 p-3">
              <div className="flex items-center gap-1.5 text-black font-black">
                <HelpCircle className="w-3.5 h-3.5" /> KEYBOARD SHORTCUTS
              </div>
              <div className="flex justify-between items-center text-gray-500 text-[9px]">
                <span>Next Slide:</span>
                <kbd className="bg-white px-1 border border-black shadow-neo-sm font-mono text-[8px]">Space</kbd>
              </div>
              <div className="flex justify-between items-center text-gray-500 text-[9px]">
                <span>Prev Slide:</span>
                <kbd className="bg-white px-1 border border-black shadow-neo-sm font-mono text-[8px]">&larr;</kbd>
              </div>
            </div>
          </aside>

          {/* Right Active Slide Stage */}
          <main className="lg:col-span-9 flex flex-col justify-between min-h-[500px]">
            {/* Active Slide content */}
            <div className="flex-1 mb-4">
              {slideViews[currentSlide].render()}
            </div>

            {/* Stage bottom deck controls */}
            <div className="bg-white border-medium p-4 shadow-neo flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Autoplay & progress controls */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsAutoplay(!isAutoplay)}
                  className={`px-3 py-1 text-xs font-mono font-black uppercase tracking-tight border-medium flex items-center gap-1.5 cursor-pointer transition-all shadow-neo-sm ${
                    isAutoplay 
                      ? 'bg-[#EC4899] text-white border-black' 
                      : 'bg-white text-black hover:bg-cream border-black'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAutoplay ? 'animate-spin' : ''}`} />
                  {isAutoplay ? 'Autoplay: Active' : 'Autoplay: Off'}
                </button>
                
                {isAutoplay && (
                  <div className="flex-1 sm:w-32 bg-cream border border-black h-2.5 relative overflow-hidden">
                    <div 
                      className="bg-[#EC4899] h-full transition-all duration-100 ease-linear"
                      style={{ width: `${autoplayProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Back / Forward arrows */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs font-mono font-bold text-gray-500 mr-2">
                  SLIDE {currentSlide + 1} OF 9
                </span>
                
                <button
                  onClick={() => setCurrentSlide(prev => (prev - 1 + 9) % 9)}
                  className="p-2 border-medium bg-white hover:bg-cream text-black shadow-neo-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => setCurrentSlide(prev => (prev + 1) % 9)}
                  className="px-4 py-2 border-medium bg-black text-white hover:bg-[#1a1a1a] shadow-neo-sm hover:scale-105 active:scale-95 transition-all cursor-pointer font-mono font-black uppercase text-xs flex items-center gap-1"
                  title="Next Slide"
                >
                  Next <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ==========================================
          FOOTER SECTION
         ========================================== */}
      <footer className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-mono font-black uppercase tracking-[0.2em] border-t-2 border-black pt-4">
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <span>PRECISION ARCHITECTURE</span>
          <span>●</span>
          <span>REAL-TIME GRAPH INTELLIGENCE</span>
          <span>●</span>
          <span>ISRO P4 ROAD EVALUATOR</span>
        </div>
        <div className="bg-black text-white px-3 py-1 border border-black shadow-neo-sm select-all">
          FINAL PITCH SUBMISSION // TEAM TESSELLATE
        </div>
      </footer>
    </div>
  );
}
