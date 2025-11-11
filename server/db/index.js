/*
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();

mongoose
    .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db
*/

const dotenv = require('dotenv')
dotenv.config()

class DatabaseManager {

  async connect() { throw new Error('connect error'); }

  async createPlaylist(data) { throw new Error('createPlaylist error'); }
  async getPlaylistById(id) { throw new Error('getPlaylistById error'); }
  async updatePlaylist(id, data) { throw new Error('updatePlaylist error'); }
  async deletePlaylist(id) { throw new Error('deletePlaylist error'); }
  async getPlaylistPairs(userId) { throw new Error('getPlaylistPairs error'); }
  async getAllPlaylists() { throw new Error('getAllPlaylists error'); }
  
  async getUserById(id) { throw new Error('getUserById error'); }
  async getUserByEmail(email) { throw new Error('getUserByEmail error'); }
  async saveUser(userData) { throw new Error('saveUser error'); }
}

function getDatabaseManager() {
  let dbType = process.env.DATABASE_TYPE || 'mongodb';
  dbType = dbType.toLowerCase();
  console.log('db type ->', dbType);

  let manager;
  try {
    if (dbType.includes('postgres')) {
      const PgManager = require('./postgresql');
      manager = new PgManager();
    } 
    else {
      const MongoManager = require('./mongodb');
      manager = new MongoManager();
    }
  } 
  catch (err) {
    console.log('error loading db manager:', err);
    throw err;
  }

  return manager;
}

module.exports = { DatabaseManager, getDatabaseManager };
