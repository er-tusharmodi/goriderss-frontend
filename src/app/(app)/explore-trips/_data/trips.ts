import type { Trip } from "../types";

// Base dataset (from your HTML)
const baseTrips: Trip[] = [
  { id:"t1", title:"Jaipur → Udaipur Weekend Sprint", city:"Udaipur", state:"Rajasthan", start:"2025-09-14", end:"2025-09-16", days:2, km:420, members:12, max:18, budget:3500, diff:"Moderate", type:"ADV", host:"Anushka", saved:false },
  { id:"t2", title:"Jaisalmer Desert Loop", city:"Jaisalmer", state:"Rajasthan", start:"2025-09-22", end:"2025-09-22", days:1, km:280, members:18, max:25, budget:2400, diff:"Easy", type:"Roadster", host:"Karan", saved:true },
  { id:"t3", title:"Mount Abu Night Ride", city:"Mount Abu", state:"Rajasthan", start:"2025-09-28", end:"2025-09-29", days:1, km:190, members:8, max:12, budget:1800, diff:"Easy", type:"Cruiser", host:"Neha", saved:false },
  { id:"t4", title:"Pushkar Cafe Run", city:"Pushkar", state:"Rajasthan", start:"2025-09-18", end:"2025-09-18", days:1, km:145, members:21, max:30, budget:1200, diff:"Easy", type:"Roadster", host:"Tushar", saved:true },
  { id:"t5", title:"Kumbhalgarh Fort Ride", city:"Kumbhalgarh", state:"Rajasthan", start:"2025-10-02", end:"2025-10-03", days:2, km:360, members:9, max:14, budget:2800, diff:"Moderate", type:"ADV", host:"Ravi", saved:false },
  { id:"t6", title:"Sambhar Lake Sunrise", city:"Sambhar", state:"Rajasthan", start:"2025-09-20", end:"2025-09-20", days:1, km:120, members:16, max:20, budget:900, diff:"Easy", type:"ADV", host:"Aditi", saved:false },
  { id:"t7", title:"Chittorgarh Heritage Run", city:"Chittorgarh", state:"Rajasthan", start:"2025-10-06", end:"2025-10-06", days:1, km:310, members:7, max:15, budget:2100, diff:"Hard", type:"ADV", host:"Raghav", saved:false },
  { id:"t8", title:"Ajmer Dargah Day Trip", city:"Ajmer", state:"Rajasthan", start:"2025-09-25", end:"2025-09-25", days:1, km:270, members:19, max:24, budget:1600, diff:"Moderate", type:"Cruiser", host:"Ishika", saved:false },
  { id:"t9", title:"Bikaner North Trail", city:"Bikaner", state:"Rajasthan", start:"2025-09-19", end:"2025-09-20", days:1, km:480, members:10, max:16, budget:3900, diff:"Hard", type:"ADV", host:"Aarav", saved:false },
];

const diffs = ["Easy", "Moderate", "Hard"] as const;
const types = ["ADV", "Roadster", "Cruiser"] as const;

// Expand to 60 trips deterministically
export const allTrips: Trip[] = Array.from({ length: 60 }).map((_, i) => {
  const b = baseTrips[i % baseTrips.length];
  const shift = i % 15;
  const start = new Date(b.start); start.setDate(start.getDate() + shift);
  const end = new Date(b.end); end.setDate(end.getDate() + shift);
  return {
    ...b,
    id: "T" + (i + 1),
    title: `${b.title} #${Math.floor(i / 9) + 1}`,
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    km: b.km + (i % 7) * 10,
    members: Math.min(b.max, Math.max(5, b.members + (i % 6) - 2)),
    diff: diffs[i % diffs.length],
    type: types[i % types.length],
    saved: i % 5 === 0,
  };
});
