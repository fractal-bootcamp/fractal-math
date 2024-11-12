"use client";
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import ConceptCards from './ConceptCards.tsx';

interface NodeData extends d3.SimulationNodeDatum {
    id: string
    label: string
    comfort: boolean | null
}

interface LinkData {
    source: string
    target: string
}

export default function ConceptFlow() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

    const initialNodes: NodeData[] = [
        { id: '1', label: 'Pythagorean Theorem', comfort: null },
        { id: '2', label: 'Right Triangles', comfort: null },
        { id: '3', label: 'Square Numbers', comfort: null },
        { id: '4', label: 'Distance Formula', comfort: null },
        { id: '5', label: 'Trigonometry', comfort: null },
    ]

    const initialLinks: LinkData[] = [
        { source: '2', target: '1' },
        { source: '3', target: '1' },
        { source: '1', target: '4' },
        { source: '1', target: '5' },
    ]

    useEffect(() => {
        if (!containerRef.current) return

        // Clear any existing SVG
        d3.select(containerRef.current).selectAll('svg').remove()

        const width = containerRef.current.offsetWidth || 800
        const height = containerRef.current.offsetHeight || 600

        // Create SVG
        const svg = d3.select(containerRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)

        // Create force simulation with adjusted parameters
        const simulation = d3.forceSimulation(initialNodes)
            .force('link', d3.forceLink(initialLinks).id((d: any) => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-1000))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(80))

        // Draw links
        const links = svg.append('g')
            .selectAll('line')
            .data(initialLinks)
            .join('line')
            .attr('stroke', (d) => {
                const isPrerequisite = ['2', '3'].includes(d.source)
                return isPrerequisite ? '#ff6b6b' : '#69db7c'
            })
            .attr('stroke-width', 2)

        // Draw nodes
        const nodes = svg.append('g')
            .selectAll('g')
            .data(initialNodes)
            .join('g')

        // Add circles to nodes
        nodes.append('circle')
            .attr('r', 30)
            .attr('fill', '#4a6fa5')
            .on('click', function (event, d) {
                setSelectedConcept(d.id);
            })

        // Add labels
        nodes.append('text')
            .text(d => d.label)
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .attr('fill', 'white')

        // Add drag behavior
        nodes.call(d3.drag<any, NodeData>()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))

        // Update positions on simulation tick
        simulation.on('tick', () => {
            links
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y)

            nodes.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
        })

        function dragstarted(event: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            event.subject.fx = event.subject.x
            event.subject.fy = event.subject.y
        }

        function dragged(event: any) {
            event.subject.fx = event.x
            event.subject.fy = event.y
        }

        function dragended(event: any) {
            if (!event.active) simulation.alphaTarget(0)
            event.subject.fx = null
            event.subject.fy = null
        }

    }, [])

    const handleConceptComplete = (conceptId: string) => {
        setSelectedConcept(null);
        // Update the node's comfort level
        const node = d3.select(`circle[data-id="${conceptId}"]`);
        node.attr('stroke', '#4CAF50').attr('stroke-width', 4);
    };

    return (
        <div className="relative w-full h-full">
            <div ref={containerRef} className="w-full h-full" />
            {selectedConcept && (
                <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center p-4">
                    <ConceptCards
                        conceptId={selectedConcept}
                        onComplete={handleConceptComplete}
                    />
                </div>
            )}
        </div>
    );
} 