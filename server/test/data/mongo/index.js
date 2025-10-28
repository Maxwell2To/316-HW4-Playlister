const dotenv = require('dotenv').config({ path: __dirname + '/../../../.env' });

const hw3PlaylistsRaw = require("./115595059-playlists.json");
const hw3Playlists = hw3PlaylistsRaw.playlists;
//Supposed to load the HW3 playlist

async function clearCollection(collection, collectionName) {
    try {
        await collection.deleteMany({});
        console.log(collectionName + " cleared");
    }
    catch (err) {
        console.log(err);
    }
}

async function fillCollection(collection, collectionName, data) {
    for (let i = 0; i < data.length; i++) {
        let doc = new collection(data[i]);
        await doc.save();
    }
    console.log(collectionName + " filled");
}

async function resetMongo() {
    const Playlist = require('../../../models/playlist-model')
    const User = require("../../../models/user-model")
    const testData = require("../example-db-data.json")

    console.log("Resetting the Mongo DB")
    await clearCollection(Playlist, "Playlist");
    await clearCollection(User, "User");
    await fillCollection(Playlist, "Playlist", testData.playlists);
    await fillCollection(User, "User", testData.users);

    /////////////New User Code/////////////
    const newUser = new User({
        email: "maxwellTo@gmail.com",
        username: "maxwellTo",
        passwordHash: "aaaaaaaa",
        firstName: "Maxwell",
        lastName: "To"
    });
    await newUser.save();

    const userPlaylists = [];
    for (let i = 0; i < hw3Playlists.length; i++) {
        const pl = hw3Playlists[i];
        pl.ownerEmail = newUser.email;
        pl.ownerName = newUser.username;
        userPlaylists.push(pl);
    }

    await fillCollection(Playlist, "Playlist", userPlaylists);

    console.log("HW3 playlists added", newUser.username);
    /////////////New User Code/////////////
}

const mongoose = require('mongoose')
mongoose
    .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
    .then(() => { resetMongo() })
    .catch(e => {
        console.error('Connection error', e.message)
    })
