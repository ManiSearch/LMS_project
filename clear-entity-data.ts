// Script to clear entity.json data from localStorage
// Run this in browser console to clear all entity data

console.log('Clearing entity.json data...');

// Clear the entity.json file (localStorage key)
localStorage.removeItem('entity.json');

console.log('Entity.json data cleared!');
console.log('Please refresh the page to see the changes.');

// Verify it's cleared
const entityData = localStorage.getItem('entity.json');
if (entityData) {
  console.log('Warning: Data still exists:', entityData);
} else {
  console.log('Success: entity.json is now empty');
}
