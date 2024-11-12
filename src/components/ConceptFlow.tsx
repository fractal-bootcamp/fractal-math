"use client";
import { useCallback } from 'react';
import ReactFlow, {
    Node,
    Edge,
    addEdge,
    Connection,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Add type for node data
interface NodeData {
    label: string;
    comfort: boolean | null;
}

const initialNodes: Node<NodeData>[] = [
    {
        id: '1',
        type: 'default',
        data: {
            label: 'Geometry',
            comfort: null
        },
        position: { x: 250, y: 0 },
        className: 'bg-blue-500 rounded-lg'
    },
    {
        id: '2',
        type: 'default',
        data: {
            label: 'Triangles',
            comfort: null
        },
        position: { x: 100, y: 100 },
        className: 'bg-purple-500 rounded-lg'
    },
    {
        id: '3',
        type: 'default',
        data: {
            label: 'Circles',
            comfort: null
        },
        position: { x: 400, y: 100 },
        className: 'bg-green-500 rounded-lg'
    },
    {
        id: '4',
        type: 'default',
        data: {
            label: 'Pythagorean Theorem',
            comfort: null
        },
        position: { x: 100, y: 200 },
        className: 'bg-yellow-500 rounded-lg'
    },
    {
        id: '5',
        type: 'default',
        data: {
            label: 'Circle Properties',
            comfort: null
        },
        position: { x: 400, y: 200 },
        className: 'bg-red-500 rounded-lg'
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e3-5', source: '3', target: '5' },
];

export default function ConceptFlow() {
    const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node<NodeData>) => {
        setNodes((nds) =>
            nds.map((n) => {
                if (n.id === node.id) {
                    const comfort = n.data.comfort === null ? true :
                        n.data.comfort === true ? false : null;
                    const baseClass = n.className?.split(' ')[0] || '';
                    return {
                        ...n,
                        className: `${baseClass} rounded-lg ${comfort === true ? 'border-4 border-green-300' :
                            comfort === false ? 'border-4 border-red-300' :
                                ''
                            }`,
                        data: { ...n.data, comfort }
                    };
                }
                return n;
            })
        );
    }, [setNodes]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
        >
            <Controls />
            <Background />
        </ReactFlow>
    );
} 