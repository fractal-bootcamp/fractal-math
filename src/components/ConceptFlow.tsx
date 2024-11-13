"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import ConceptCards from "./ConceptCards";

// Define the structure for node data
interface NodeData extends d3.SimulationNodeDatum {
    id: string;
    label: string;
    comfort: boolean | null;
}

// Define the structure for link data
interface LinkData {
    source: string;
    target: string;
}

// Add these interfaces for d3 types
// interface SimulationLink extends d3.SimulationLinkDatum<NodeData> {
//     source: NodeData;
//     target: NodeData;
// }

interface DragEvent extends d3.D3DragEvent<SVGGElement, NodeData, NodeData> {
    subject: NodeData;
}

export default function ConceptFlow() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

    // Move these inside useEffect to avoid the dependency warning
    // while maintaining the exact same functionality
    useEffect(() => {
        const fetchCurveData = async () => {
            try {
                const response = await fetch('/api/curves');
                const curves = await response.json();
                if (curves.length > 0) {
                    // Replace all nodes with API data (using first 5 curves)
                    const initialNodes: NodeData[] = curves.slice(0, 5).map(curve => ({
                        id: curve.id,
                        label: curve.name,
                        comfort: null
                    }));

                    const initialLinks: LinkData[] = [
                        { source: initialNodes[1].id, target: initialNodes[0].id },
                        { source: initialNodes[2].id, target: initialNodes[0].id },
                        { source: initialNodes[0].id, target: initialNodes[3].id },
                        { source: initialNodes[0].id, target: initialNodes[4].id },
                    ];

                    if (!containerRef.current) return;

                    d3.select(containerRef.current).selectAll("svg").remove();

                    const width = containerRef.current.offsetWidth || 800;
                    const height = containerRef.current.offsetHeight || 600;

                    const svg = d3
                        .select(containerRef.current)
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height);

                    const simulation = d3
                        .forceSimulation(initialNodes)
                        .force(
                            "link",
                            d3
                                .forceLink(initialLinks)
                                // Allow any: d3's force layout internal node structure doesn't align cleanly with our NodeData type
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                .id((d: any) => d.id)
                                .distance(150)
                        )
                        .force("charge", d3.forceManyBody().strength(-1000))
                        .force("center", d3.forceCenter(width / 2, height / 2))
                        .force("collision", d3.forceCollide().radius(80));

                    const links = svg
                        .append("g")
                        .selectAll("line")
                        .data(initialLinks)
                        .join("line")
                        .attr("stroke", (d) => (["2", "3"].includes(d.source as string) ? "#ff6b6b" : "#69db7c"))
                        .attr("stroke-width", 2);

                    const nodes = svg.append("g").selectAll("g").data(initialNodes).join("g");

                    nodes
                        .append("circle")
                        .attr("r", 30)
                        .attr("fill", "#4a6fa5")
                        .attr("data-id", d => d.id)
                        .on("click", (_event, d) => setSelectedConcept(d.id));

                    nodes
                        .append("text")
                        .text((d) => d.label)
                        .attr("text-anchor", "middle")
                        .attr("dy", ".35em")
                        .attr("fill", "white");

                    nodes.call(
                        d3
                            // Allow any: d3's drag behavior works with various element types, strict typing adds unnecessary complexity
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .drag<any, NodeData>()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended)
                    );

                    simulation.on("tick", () => {
                        links
                            .attr("x1", (d) => {
                                const source = d.source as unknown as NodeData;
                                return source.x!;
                            })
                            .attr("y1", (d) => {
                                const source = d.source as unknown as NodeData;
                                return source.y!;
                            })
                            .attr("x2", (d) => {
                                const target = d.target as unknown as NodeData;
                                return target.x!;
                            })
                            .attr("y2", (d) => {
                                const target = d.target as unknown as NodeData;
                                return target.y!;
                            });

                        nodes.attr("transform", (d: NodeData) => `translate(${d.x},${d.y})`);
                    });

                    function dragstarted(event: DragEvent) {
                        if (!event.active) simulation.alphaTarget(0.3).restart();
                        event.subject.fx = event.subject.x;
                        event.subject.fy = event.subject.y;
                    }

                    function dragged(event: DragEvent) {
                        event.subject.fx = event.x;
                        event.subject.fy = event.y;
                    }

                    function dragended(event: DragEvent) {
                        if (!event.active) simulation.alphaTarget(0);
                        event.subject.fx = null;
                        event.subject.fy = null;
                    }
                }
            } catch (error) {
                console.error('Error fetching curve:', error);
            }
        };

        fetchCurveData();
    }, []);

    const handleConceptComplete = (conceptId: string) => {
        setSelectedConcept(null);
        const node = d3.select(`circle[data-id="${conceptId}"]`);
        node.attr("stroke", "#4CAF50").attr("stroke-width", 4);
    };

    return (
        <div className="relative w-full h-full">
            <div ref={containerRef} className="w-full h-full" />
            {selectedConcept && (
                <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center p-4">
                    <ConceptCards conceptId={selectedConcept} onComplete={handleConceptComplete} />
                </div>
            )}
        </div>
    );
}