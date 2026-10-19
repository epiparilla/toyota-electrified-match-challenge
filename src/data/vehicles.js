export const VEHICLES = [
  {
    id: 'bz4x',
    name: 'bZ4X',
    fullName: 'Toyota bZ4X BEV',
    type: 'Battery EV (BEV)',
    badge: '570* km range | New Kind of Power',
    image: '/vehicles/BZ4X.png',
    color: '#00F0FF',
    accentText: 'Beyond Zero'
  },
  {
    id: 'hilux',
    name: 'Hilux BEV',
    fullName: 'Toyota Hilux BEV',
    type: 'Battery EV (BEV)',
    badge: '315* km range',
    image: '/vehicles/Hilux BEV.png',
    color: '#00F0FF',
    accentText: 'Beyond Zero'
  },
  {
    id: 'zenix',
    name: 'Zenix HEV',
    fullName: 'Toyota Innova Zenix HEV',
    type: 'Hybrid EV (HEV)',
    badge: '21.3 km/Lge | Electrified Family Vehicle',
    image: '/vehicles/Zenix HEV.png',
    color: '#00F0FF',
    accentText: 'Beyond Zero'
  },
  {
    id: 'corolla_cross',
    name: 'Corolla Cross HEV',
    fullName: 'Toyota Corolla Cross HEV',
    type: 'Hybrid EV (HEV)',
    badge: '24.1 km/Lge | Cross Power with Style',
    image: '/vehicles/Corolla Cross.png',
    color: '#00F0FF',
    accentText: 'Beyond Zero'
  },
  {
    id: 'alphard',
    name: 'Alphard HEV',
    fullName: 'Toyota Alphard HEV',
    type: 'Hybrid EV (HEV)',
    badge: 'Uncompromised Luxury. Electrified',
    image: '/vehicles/Alphard.png',
    color: '#00F0FF',
    accentText: 'Beyond Zero'
  },
  {
    id: 'ativ',
    name: 'ATIV HEV',
    fullName: 'Toyota ATIV HEV',
    type: 'Hybrid EV (HEV)',
    badge: '26.3 km/Lge | For the Elevative You',
    image: '/vehicles/ATV HEV.png',
    color: '#00F0FF',
    accentText: 'Beyond Zero'
  },
  {
    id: 'land_cruiser',
    name: 'Land Cruiser HEV',
    fullName: 'Toyota Land Cruiser HEV',
    type: 'Hybrid EV (HEV)',
    badge: 'Legendary Breed of Hybrid',
    image: '/vehicles/LC300.png',
    color: '#00F0FF',
    accentText: 'Beyond Zero'
  },
  {
    id: 'yaris_cross',
    name: 'Yaris Cross HEV',
    fullName: 'Toyota Yaris Cross HEV',
    type: 'Hybrid EV (HEV)',
    badge: '27.8 km/Lge | Electrify Your Passions',
    image: '/vehicles/Yaris Cross.png',
    color: '#00F0FF',
    accentText: 'Beyond Zero'
  }
];

// Helper to generate the 16 grid cards (8 pairs of identical vehicle photos)
export function generateGameGrid(vehicleList = VEHICLES) {
  const cards = [];

  // Randomly select eight distinct vehicles for the 4x4 (16-tile) grid.
  // This keeps the game ready for a larger client-provided vehicle catalogue.
  const shuffledVehicles = [...vehicleList];
  for (let i = shuffledVehicles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledVehicles[i], shuffledVehicles[j]] = [shuffledVehicles[j], shuffledVehicles[i]];
  }
  const selectedVehicles = shuffledVehicles.slice(0, 8);

  selectedVehicles.forEach((vehicle, index) => {
    // Card A: Photo Card
    cards.push({
      cardId: `${vehicle.id}-photo`,
      vehicleId: vehicle.id,
      cardType: 'photo',
      title: vehicle.name,
      subtitle: vehicle.type,
      image: vehicle.image,
      badge: vehicle.badge,
      color: vehicle.color
    });

    // Card B: Matching photo card
    cards.push({
      cardId: `${vehicle.id}-photo-pair`,
      vehicleId: vehicle.id,
      cardType: 'photo',
      title: vehicle.name,
      subtitle: vehicle.type,
      image: vehicle.image,
      badge: vehicle.badge,
      color: vehicle.color
    });
  });

  const countAdjacentPairs = (cardLayout) => {
    const firstCardIndexByVehicle = new Map();
    let adjacentPairs = 0;

    cardLayout.forEach((card, index) => {
      const firstIndex = firstCardIndexByVehicle.get(card.vehicleId);
      if (firstIndex === undefined) {
        firstCardIndexByVehicle.set(card.vehicleId, index);
        return;
      }

      const rowDistance = Math.abs(Math.floor(firstIndex / 4) - Math.floor(index / 4));
      const columnDistance = Math.abs((firstIndex % 4) - (index % 4));
      if (rowDistance + columnDistance === 1) adjacentPairs += 1;
    });

    return adjacentPairs;
  };

  // Try several random arrangements and retain the one with the fewest
  // side-by-side pairs. A zero-adjacent arrangement is normally found quickly.
  let bestLayout = cards;
  let fewestAdjacentPairs = Infinity;

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const candidate = [...cards];
    for (let i = candidate.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidate[i], candidate[j]] = [candidate[j], candidate[i]];
    }

    const adjacentPairs = countAdjacentPairs(candidate);
    if (adjacentPairs < fewestAdjacentPairs) {
      bestLayout = candidate;
      fewestAdjacentPairs = adjacentPairs;
    }
    if (adjacentPairs === 0) break;
  }

  return bestLayout;
}
