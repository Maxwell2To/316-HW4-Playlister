require('dotenv').config({ path: __dirname + '/../../../.env' });

const hw3PlaylistsRaw = require('./mongo/115595059-playlists.json');
const hw3Playlists = Object.values(hw3PlaylistsRaw.playlists);

async function clearCollection(collection, collectionName) {
    try {
        await collection.destroy({ where: {} });
        console.log(collectionName + " cleared");
    } 
    catch (err) {
        console.error(err);
    }
}

async function fillCollection(collection, collectionName, data) {
    for (let i = 0; i < data.length; i++) {
        await collection.create(data[i]);
    }
    console.log(collectionName + " filled");
}

async function resetPostgre() {
    const Playlist = require('../../../db/postgresql/models').Playlist;
    const User = require('../../../db/postgresql/models').User;
    const testData = require('../example-db-data.json');

    console.log("Resetting the Postgre DB");
    await clearCollection(Playlist, "Playlist");
    await clearCollection(User, "User");
    await fillCollection(Playlist, "Playlist", testData.playlists);
    await fillCollection(User, "User", testData.users);

    const newUser = {
        email: "maxwellTo@gmail.com",
        username: "maxwellTo",
        passwordHash: "aaaaaaaa",
        firstName: "Maxwell",
        lastName: "To"
    };
    await User.create(newUser);

    const userPlaylists = [];
    for (let i = 0; i < hw3Playlists.length; i++) {
        const pl = hw3Playlists[i];
        pl.ownerEmail = newUser.email;
        pl.ownerName = newUser.username;
        userPlaylists.push(pl);
    }

    await fillCollection(Playlist, "Playlist", userPlaylists);

    console.log("HW3 playlists added", newUser.username);
}

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.PG_URI, {logging: false,});

sequelize.authenticate()
    .then(() => {
        console.log("Connected to PostgreSQL");
        return resetPostgre();
    })
    .catch(e => {
        console.error("Connection error", e.message);
    })
    .finally(() => {
        sequelize.close();
    });
