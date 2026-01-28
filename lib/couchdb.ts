// lib/couchdb.ts
import nano from 'nano';

if (!process.env.COUCH_URL) {
  throw new Error('COUCH_URL is missing from environment');
}

if (!process.env.COUCH_DB_NAME) {
  throw new Error('COUCH_DB_NAME is missing from environment');
}

const DB_NAME = process.env.COUCH_DB_NAME;

export const couch = nano(process.env.COUCH_URL);
export const kanbansDB = couch.db.use(DB_NAME);

async function checkDatabaseConnection(retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await couch.db.get(DB_NAME);
      console.log(`✅ CouchDB database "${DB_NAME}" is online.`);
      return;
    } catch (error) {
      console.error(
        `❌ Attempt ${i + 1} - CouchDB database "${DB_NAME}" is offline. Retrying in ${delay}ms...`,
      );
      console.error(error);

      if (i === retries - 1) {
        console.error('❌ CouchDB is still offline. Exiting.');
        process.exit(1);
      }

      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

checkDatabaseConnection();

// Create a .env.local and add  COUCH_URL=http://admin:secret123@127.0.0.1:5984
//                              COUCH_DB_NAME=app_db
