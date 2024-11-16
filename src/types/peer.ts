export interface Peer {
  id: string;
  name: string;
  status: "online" | "offline" | "away";
  role: "student" | "teacher" | "ta";
  lastActive?: string;
  currentConcept?: string;
}

export const MOCK_PEERS: Peer[] = [
  { 
    id: "1", 
    name: "Alice Chen", 
    status: "online", 
    role: "teacher",
    currentConcept: "Quadratic Functions"
  },
  { 
    id: "2", 
    name: "Bob Smith", 
    status: "online", 
    role: "student",
    currentConcept: "Linear Functions"
  },
  { 
    id: "3", 
    name: "Carol Davis", 
    status: "away", 
    role: "ta",
    lastActive: "5m ago",
    currentConcept: "Exponential Growth"
  },
  { 
    id: "4", 
    name: "David Wilson", 
    status: "offline", 
    role: "student",
    lastActive: "2h ago"
  },
];
