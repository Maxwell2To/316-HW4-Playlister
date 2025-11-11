/*
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        playlists: [{type: ObjectId, ref: 'Playlist'}]
    },
    { timestamps: true },
)

module.exports = mongoose.model('User', UserSchema)
*/

const { DataTypes } = require('sequelize');
const { sequelize, Playlist } = require('./playlist-model'); // reuse same instance

const User = sequelize.define('user', {
    firstName: {type: DataTypes.STRING, allowNull: false},
    lastName: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    passwordHash: {type: DataTypes.STRING, allowNull: false}
}, 
{timestamps: true, freezeTableName: true});

User.hasMany(Playlist, {foreignKey: 'ownerEmail', sourceKey: 'email'});
Playlist.belongsTo(User, {foreignKey: 'ownerEmail', targetKey: 'email'});

module.exports = User;





