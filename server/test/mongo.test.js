import { beforeAll, beforeEach, afterEach, afterAll, expect, test } from 'vitest';
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
//const mongoose = require('mongoose')

/**
 * Vitest test script for the Playlister app's Mongo Database Manager. Testing should verify that the Mongo Database Manager 
 * will perform all necessarily operations properly.
 *  
 * Scenarios we will test:
 *  1) Reading a User from the database
 *  2) Creating a User in the database
 *  3) ...
 * 
 * You should add at least one test for each database interaction. In the real world of course we would do many varied
 * tests for each interaction.
 */

/**
 * Executed once before all tests are performed.
 */
beforeAll(async () => {
    // SETUP THE CONNECTION VIA MONGOOSE JUST ONCE - IT IS IMPORTANT TO NOTE THAT INSTEAD
    // OF DOING THIS HERE, IT SHOULD BE DONE INSIDE YOUR Database Manager (WHICHEVER)
    await mongoose
        .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
        .catch(e => {
            console.error('Connection error', e.message)
        })
});

/**
 * Executed before each test is performed.
 */
beforeEach(() => {
});

/**
 * Executed after each test is performed.
 */
afterEach(() => {
});

/**
 * Executed once after all tests are performed.
 */
afterAll(() => {
});

/**
 * Vitest test to see if the Database Manager can get a User.
 */
test('Test #1) Reading a User from the Database', () => {
    // FILL IN A USER WITH THE DATA YOU EXPECT THEM TO HAVE
    const expectedUser = {
        // FILL IN EXPECTED DATA
    };

    // THIS WILL STORE THE DATA RETRUNED BY A READ USER
    const actualUser = {};

    // READ THE USER
    // actualUser = dbManager.somethingOrOtherToGetAUser(...)

    // COMPARE THE VALUES OF THE EXPECTED USER TO THE ACTUAL ONE
    expect(expectedUser.firstName, actualUser.firstName)
    expect(expectedUser.lastName, actualUser.lastName);
    // AND SO ON
});

/**
 * Vitest test to see if the Database Manager can create a User
 */
test('Test #2) Creating a User in the Database', () => {
    // MAKE A TEST USER TO CREATE IN THE DATABASE
    const testUser = {
        // FILL IN TEST DATA, INCLUDE AN ID SO YOU CAN GET IT LATER
    };

    // CREATE THE USER
    // dbManager.somethingOrOtherToCreateAUser(...)

    // NEXT TEST TO SEE IF IT WAS PROPERLY CREATED

    // FILL IN A USER WITH THE DATA YOU EXPECT THEM TO HAVE
    const expectedUser = {
        // FILL IN EXPECTED DATA
    };

    // THIS WILL STORE THE DATA RETRUNED BY A READ USER
    const actualUser = {};

    // READ THE USER
    // actualUser = dbManager.somethingOrOtherToGetAUser(...)

    // COMPARE THE VALUES OF THE EXPECTED USER TO THE ACTUAL ONE
    expect(expectedUser.firstName, actualUser.firstName)
    expect(expectedUser.lastName, actualUser.lastName);
    // AND SO ON

});

// THE REST OF YOUR TEST SHOULD BE PUT BELOW

import { beforeAll, afterAll, expect, test, describe } from 'vitest'

///////////////////// MONGO DATABASE TESTS /////////////////////

const mongoose = require('mongoose')
const MongoManager = require('../db/mongodb/index')

describe('MongoManager CRUD Operations', () => {
  let mongoDB
  let testUser
  let testPlaylist

  beforeAll(async () => {
    mongoDB = new MongoManager()
    await mongoDB.connect()
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  test('Mongo: saveUser and getUserByEmail', async () => {
    const userData = {
      firstName: 'Maxwell',
      lastName: 'To',
      email: 'maxwellTo@gmail.com',
      passwordHash: 'aaaaaaaa'
    }

    // Check if user already exists
    const existing = await mongoDB.getUserByEmail(userData.email)
    if (existing) {
      await existing.deleteOne()
    }

    testUser = await mongoDB.saveUser(userData)

    const fetched = await mongoDB.getUserByEmail(userData.email)

    // Compare values
    expect(fetched.email).toBe(userData.email)
    expect(fetched.firstName).toBe(userData.firstName)

    const keys = ['firstName', 'lastName', 'email', 'passwordHash']
    for (let i = 0; i < keys.length; i++) {
      expect(fetched[keys[i]]).toBe(userData[keys[i]])
    }
  })

  test('Mongo: createPlaylist and getPlaylistById', async () => {
    const playlistData = {
      name: 'Maxwell Playlist',
      ownerEmail: testUser.email,
      songs: [{ title: 'Song 1', artist: 'Artist 1', youTubeId: 'YT001' }]
    }

    testPlaylist = await mongoDB.createPlaylist(playlistData)

    const fetched = await mongoDB.getPlaylistById(testPlaylist._id)
    expect(fetched.name).toBe(playlistData.name)

    // Check for songs
    for (let i = 0; i < fetched.songs.length; i++) {
      expect(fetched.songs[i].title).toBe(playlistData.songs[i].title)
      expect(fetched.songs[i].artist).toBe(playlistData.songs[i].artist)
    }
  })
})

///////////////////// POSTGRES DATABASE TESTS /////////////////////

const { sequelize } = require('../models/playlist-model')
const PostgresManager = require('../db/postgresql/index')

describe('PostgresManager CRUD Operations', () => {
  let pgDB
  let testUser
  let testPlaylist

  beforeAll(async () => {
    pgDB = new PostgresManager()
    await pgDB.connect()
  })

  afterAll(async () => {
    await sequelize.close()
  })

  test('Postgres: saveUser and getUserByEmail', async () => {
    const userData = {
      firstName: 'Maxwell',
      lastName: 'To',
      email: 'maxwellTo@gmail.com',
      passwordHash: 'aaaaaaaa'
    }

    // Delete existing user if present
    const existing = await pgDB.getUserByEmail(userData.email)
    if (existing) {
      await existing.destroy()
    }

    testUser = await pgDB.saveUser(userData)

    const fetched = await pgDB.getUserByEmail(userData.email)
    expect(fetched.email).toBe(userData.email)
    expect(fetched.firstName).toBe(userData.firstName)

    const keys = ['firstName', 'lastName', 'email', 'passwordHash']
    for (let i = 0; i < keys.length; i++) {
      expect(fetched[keys[i]]).toBe(userData[keys[i]])
    }
  })

  test('Postgres: createPlaylist and getPlaylistById', async () => {
    const playlistData = {
      name: 'Maxwell Playlist',
      ownerEmail: testUser.email,
      songs: [{ title: 'Song 1', artist: 'Artist 1', youTubeId: 'YT001' }]
    }

    testPlaylist = await pgDB.createPlaylist(playlistData)

    const fetched = await pgDB.getPlaylistById(testPlaylist.id)
    expect(fetched.name).toBe(playlistData.name)

    for (let i = 0; i < fetched.songs.length; i++) {
      expect(fetched.songs[i].title).toBe(playlistData.songs[i].title)
      expect(fetched.songs[i].artist).toBe(playlistData.songs[i].artist)
    }
  })
})
