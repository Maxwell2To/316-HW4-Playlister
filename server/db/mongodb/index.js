const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const { DatabaseManager } = require('../index')

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  songs: [
    {
      title: String,
      artist: String,
      year: Number,
      youTubeId: String,
    },
  ],
}, { timestamps: true })

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  passwordHash: String,
}, { timestamps: true })

const Playlist = mongoose.model('Playlist', playlistSchema)
const User = mongoose.model('User', userSchema)

class MongoManager extends DatabaseManager {
  async connect() {
    try {
      await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
      console.log('connected to mongodb')
    } catch (err) {
      console.log('mongo connect error', err)
    }
  }

  async createPlaylist(data) {
    const p = new Playlist(data)
    const saved = await p.save()
    return saved
  }

  async getPlaylistById(id) {
    const result = await Playlist.findById(id)
    return result
  }

  async updatePlaylist(id, data) {
    const existing = await Playlist.findById(id)
    if (!existing) return null
    const updated = await Playlist.findByIdAndUpdate(id, data, { new: true })
    return updated
  }

  async deletePlaylist(id) {
    const existing = await Playlist.findById(id)
    if (!existing) return null
    const deleted = await Playlist.findByIdAndDelete(id)
    return deleted
  }

  async getPlaylistPairs(userId) {
    const user = await User.findById(userId)
    if (!user) return []

    const lists = await Playlist.find({ ownerEmail: user.email })
    const pairs = []
    for (let i = 0; i < lists.length; i++) {
      const l = lists[i]
      pairs.push({ _id: l._id, name: l.name })
    }
    return pairs
  }

  async getAllPlaylists() {
    const allLists = await Playlist.find({})
    return allLists
  }

  async getUserById(id) {
    const user = await User.findById(id)
    return user
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email: email })
    return user
  }

  async saveUser(data) {
    const u = new User(data)
    const saved = await u.save()
    return saved
  }
}

module.exports = MongoManager
