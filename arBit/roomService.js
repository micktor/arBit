import { db } from './db';

export const addRoom =  (room) => {
    db.ref('/rooms').push({
        name: room,
    });
}