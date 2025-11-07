import { useEffect, useState } from 'react';

interface PawStep {
  id: number;
  x: number;
  y: number;
  rotation: number;
  delay: number;
}

interface Trail {
  id: number;
  steps: PawStep[];
  direction: number;
}

export function PawTrail() {
  const [trails, setTrails] = useState<Trail[]>([]);

  useEffect(() => {
    const createTrail = (preferTop = false) => {
      const trailId = Date.now() + Math.random(); // ensure unique IDs
      
      // Divide screen into 9 zones (3x3 grid), randomly pick a zone
      // Avoid center zone for most trails to prevent overlap with main content
      const zoneChoice = Math.random();
      let zoneX: number, zoneY: number;
      
      if (preferTop) {
        // Heavily bias towards top zones (top-left, top-center, top-right)
        const topZones = [
          { x: 0, y: 0 },      // top-left
          { x: 33, y: 0 },     // top-center
          { x: 66, y: 0 },     // top-right
        ];
        const zone = topZones[Math.floor(Math.random() * topZones.length)];
        zoneX = zone.x;
        zoneY = zone.y;
      } else if (zoneChoice < 0.7) {
        // 70% chance: Pick edge zones (top-left, top-center, top-right, middle-left, middle-right, bottom-left, bottom-center, bottom-right)
        const edgeZones = [
          { x: 0, y: 0 },      // top-left
          { x: 33, y: 0 },     // top-center
          { x: 66, y: 0 },     // top-right
          { x: 0, y: 33 },     // middle-left
          { x: 66, y: 33 },    // middle-right
          { x: 0, y: 66 },     // bottom-left
          { x: 33, y: 66 },    // bottom-center
          { x: 66, y: 66 },    // bottom-right
        ];
        const zone = edgeZones[Math.floor(Math.random() * edgeZones.length)];
        zoneX = zone.x;
        zoneY = zone.y;
      } else {
        // 30% chance: Allow center zone
        zoneX = 33;
        zoneY = 33;
      }
      
      // Random position within the zone (each zone is ~33% of screen)
      const startX = zoneX + Math.random() * 30;
      const startY = zoneY + Math.random() * 30;
      
      // Random direction (in degrees)
      const direction = Math.random() * 360;
      const radians = (direction * Math.PI) / 180;
      
      // Create 5 paw steps in a trail with alternating left/right pattern
      const steps: PawStep[] = Array.from({ length: 5 }, (_, i) => {
        const forwardDistance = i * 50; // Forward movement along direction
        const sideOffset = (i % 2 === 0 ? 1 : -1) * 15; // Alternate left/right
        
        // Calculate perpendicular direction for side offset
        const perpRadians = radians + Math.PI / 2;
        
        return {
          id: i,
          x: startX + (Math.cos(radians) * forwardDistance) / 10 + (Math.cos(perpRadians) * sideOffset) / 10,
          y: startY + (Math.sin(radians) * forwardDistance) / 10 + (Math.sin(perpRadians) * sideOffset) / 10,
          rotation: direction + (Math.random() * 40 - 20), // More variation
          delay: i * 0.1, // Slightly slower stagger
        };
      });

      const newTrail: Trail = {
        id: trailId,
        steps,
        direction,
      };

      setTrails(prev => [...prev, newTrail]);

      // Remove trail after animation completes
      setTimeout(() => {
        setTrails(prev => prev.filter(t => t.id !== trailId));
      }, 1700);
    };

    // Create initial trails shortly after load
    setTimeout(() => createTrail(), 500);
    setTimeout(() => createTrail(true), 1500); // prefer top
    setTimeout(() => createTrail(true), 2500); // prefer top

    // Create new trails at more frequent intervals (3-5 seconds)
    const interval = setInterval(() => {
      createTrail();
    }, 3000 + Math.random() * 2000);

    // Additional interval specifically for top area (runs every 4-6 seconds)
    const topInterval = setInterval(() => {
      createTrail(true);
    }, 4000 + Math.random() * 2000);

    return () => {
      clearInterval(interval);
      clearInterval(topInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {trails.map(trail => (
        <div key={trail.id}>
          {trail.steps.map(step => (
            <div
              key={step.id}
              className="absolute text-xl opacity-0 animate-paw-step"
              style={{
                left: `${step.x}%`,
                top: `${step.y}%`,
                transform: `rotate(${step.rotation}deg)`,
                animationDelay: `${step.delay}s`,
              }}
            >
              🐾
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
