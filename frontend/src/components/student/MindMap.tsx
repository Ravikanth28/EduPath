"use client";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";

interface MindMapProps {
  title: string;
  topics: string[];
}

export function MindMap({ title, topics }: MindMapProps) {
  const centerX = 400;
  const centerY = 250;
  const radius = 180;

  const nodes: Node[] = [
    {
      id: "center",
      position: { x: centerX - 60, y: centerY - 25 },
      data: { label: title },
      style: {
        background: "linear-gradient(135deg,#2F45D8,#2336B8)",
        color: "#111322",
        border: "none",
        borderRadius: "12px",
        fontWeight: "bold",
        fontSize: "13px",
        padding: "10px 18px",
        minWidth: "120px",
        textAlign: "center" as const,
      },
    },
    ...topics.map((topic, i) => {
      const angle = (2 * Math.PI * i) / topics.length - Math.PI / 2;
      return {
        id: `topic-${i}`,
        position: {
          x: centerX + radius * Math.cos(angle) - 50,
          y: centerY + radius * Math.sin(angle) - 20,
        },
        data: { label: topic },
        style: {
          background: "rgba(17,19,34,0.05)",
          color: "#2F45D8",
          border: "1px solid rgba(47,69,216,0.3)",
          borderRadius: "10px",
          fontSize: "12px",
          padding: "8px 14px",
          minWidth: "100px",
          textAlign: "center" as const,
        },
      };
    }),
  ];

  const edges: Edge[] = topics.map((_, i) => ({
    id: `e-center-${i}`,
    source: "center",
    target: `topic-${i}`,
    style: { stroke: "rgba(47,69,216,0.4)", strokeWidth: 1.5 },
    animated: false,
  }));

  return (
    <div className="glass-card overflow-hidden" style={{ height: "500px" }}>
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{title} - Mind Map</span>
      </div>
      <div style={{ height: "calc(100% - 49px)" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          proOptions={{ hideAttribution: true }}
          style={{ background: "transparent" }}
        >
          <Background color="rgba(47,69,216,0.1)" gap={24} size={1} />
          <Controls style={{ background: "rgba(17,19,34,0.04)", border: "1px solid rgba(17,19,34,0.08)", borderRadius: "8px" }} />
          <MiniMap style={{ background: "rgba(17,19,34,0.8)", border: "1px solid rgba(17,19,34,0.06)" }} />
        </ReactFlow>
      </div>
    </div>
  );
}
