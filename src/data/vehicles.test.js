import assert from 'node:assert/strict';
import test from 'node:test';
import { VEHICLES, generateGameGrid } from './vehicles.js';

test('generateGameGrid creates eight identical-photo pairs for the 4x4 grid', () => {
  const grid = generateGameGrid(VEHICLES);
  const cardsByVehicle = new Map();

  grid.forEach((card) => {
    const cards = cardsByVehicle.get(card.vehicleId) || [];
    cards.push(card);
    cardsByVehicle.set(card.vehicleId, cards);
  });

  assert.equal(grid.length, 16);
  assert.equal(cardsByVehicle.size, 8);
  cardsByVehicle.forEach((cards) => {
    assert.equal(cards.length, 2);
    assert.equal(cards[0].image, cards[1].image);
  });
});
