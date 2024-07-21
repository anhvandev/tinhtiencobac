import Dexie from 'dexie';

export const db = new Dexie('tinhtien');
db.version(1).stores({
  vangame: '++id, result, time',
});