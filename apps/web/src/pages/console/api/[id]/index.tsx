import { useEffect, useRef, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
  Panel,
} from "reactflow";

import { nodes as initialNodes, edges as initialEdges } from "./nodes";

import "reactflow/dist/style.css";
import "./style.css";

const panelStyle = {
  fontSize: 12,
  color: "#777",
};

function ApiDetail() {
  const { getIntersectingNodes } = useReactFlow();

  // this ref stores the current dragged node
  const dragRef = useRef(null);

  // target is the node that the node is dragged over
  const [target, setTarget] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeDragStart = (evt, node) => {
    dragRef.current = node;
  };

  const onNodeDrag = (evt, node) => {
    // calculate the center point of the node from position and dimensions
    const centerX = node.position.x + node.width / 2;
    const centerY = node.position.y + node.height / 2;

    // find overlapping nodes
    const intersectingNodes = getIntersectingNodes(node);

    setTarget(intersectingNodes ? intersectingNodes[0] : null);
  };

  const onNodeDragStop = (evt, node) => {
    setTarget(null);
    dragRef.current = null;
  };

  useEffect(() => {
    // whenever the target changes, we swap the colors
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === dragRef.current?.id && target) {
          return {
            ...node,
            style: {
              ...node.style,
              background: target.style.background,
            },
            data: {
              label: target.style.background,
            },
          };
        }
        return node;
      })
    );
  }, [target]);

  return (
    <div className="container w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
      >
        <Panel position="top-left" style={panelStyle}>
          Drop any node on top of another node to swap their colors
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default () => {
  return (
    <ReactFlowProvider>
      <ApiDetail />
    </ReactFlowProvider>
  );
};
