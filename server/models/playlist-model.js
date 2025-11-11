
//const mongoose = require('mongoose')
//const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/

/*
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        songs: { type: [{
            title: String,
            artist: String,
            year: Number,
            youTubeId: String
        }], required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
*/


const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../.env' });

const sequelize = new Sequelize(process.env.PG_URI, {
    dialect: 'postgres',
    logging: false,
});

const Playlist = sequelize.define('playlist', {
    name: {type: DataTypes.STRING, allowNull: false},
    ownerEmail: {type: DataTypes.STRING, allowNull: false},
    songs: {type: DataTypes.JSONB, allowNull: false}
}, 
{timestamps: true, freezeTableName: true});

module.exports = {Playlist, sequelize};

