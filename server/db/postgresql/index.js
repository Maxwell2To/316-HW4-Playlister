const { sequelize, Playlist } = require('../../models/playlist-model')
const User = require('../../models/user-model')
const { DatabaseManager } = require('../index')

class PostgresManager extends DatabaseManager {
  async connect() {
    try {
      await sequelize.sync()
      console.log('connected to postgres')
    } catch (err) {
      console.log('postgres connect error', err)
    }
  }

  async createPlaylist(data) {
    // introduce variable instead of returning directly
    const p = await Playlist.create(data)
    return p
  }

  async getPlaylistById(id) {
    const p = await Playlist.findByPk(id)
    return p
  }

  async updatePlaylist(id, data) {
    const p = await Playlist.findByPk(id)
    if (!p) return null
    const updated = await p.update(data)
    return updated
  }

  async deletePlaylist(id) {
    const p = await Playlist.findByPk(id)
    if (!p) return null
    await p.destroy()
    // return the deleted playlist
    return p
  }

  async getPlaylistPairs(userId) {
    const user = await User.findByPk(userId)
    if (!user) return []

    const lists = await Playlist.findAll({ where: { ownerEmail: user.email } })
    const pairs = []

    for (let i = 0; i < lists.length; i++) {
      const l = lists[i]
      pairs.push({ id: l.id, name: l.name })
    }
    return pairs
  }

  async getAllPlaylists() {
    const allLists = await Playlist.findAll()
    return allLists
  }

  async getUserById(id) {
    const u = await User.findByPk(id)
    return u
  }

  async getUserByEmail(email) {
    const u = await User.findOne({ where: { email: email } })
    return u
  }

  async saveUser(data) {
    const u = await User.create(data)
    return u
  }
}

module.exports = PostgresManager
