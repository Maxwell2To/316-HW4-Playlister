/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

/*
import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/store',
})
*/

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

const baseURL = "http://localhost:4000";

const responseHandler = async (response) =>  {
    let data = null;
    try {data = await response.json();} 
    catch(err) {
        console.warn("JSON error", err)
        data = {};
    }

    if (!data.playlist) data.playlist = { name: "Untitled", songs: [] };
    if (!Array.isArray(data.playlist.songs)) data.playlist.songs = [];
    if (data.songs && !Array.isArray(data.songs)) data.songs = [];
    
    return { status: response.status, ok: response.ok, data };
}

export const createPlaylist = async (newListName, newSongs, userEmail) => {
    const playlistInfo = {
        name: newListName,
        songs: newSongs,
        ownerEmail: userEmail
    };

    const response = await fetch(`${baseURL}/store/playlist/`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(playlistInfo)
    })
    return responseHandler(response);
}

export const deletePlaylistById = async (id) => {
    const response = await fetch(`${baseURL}/store/playlist/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    return responseHandler(response);
}

export const getPlaylistById = async (id) => {
    const response = await fetch(`${baseURL}/store/playlist/${id}`, {
        method: 'GET',
        credentials: 'include'
    })
    const validateID = await responseHandler(response);

    if (!validateID.data || !validateID.data.playlist) {
        validateID.data = { playlist: { name: "Untitled", songs: [] } };
    } 
    else if (!validateID.data.playlist.songs) {
        validateID.data.playlist.songs = [];
    }

    return validateID;
}

export const getPlaylistPairs = async () => {
    const response = await fetch(`${baseURL}/store/playlistpairs/`, {
        method: 'GET',
        credentials: 'include'
    })
    return responseHandler(response);
}

export const updatePlaylistById = async (id, playlist) => {
    const playlistInfo = {
        playlist
    };
    
    const response = await fetch(`${baseURL}/store/playlist/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(playlistInfo)
    })
    return responseHandler(response);
}

const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistPairs,
    updatePlaylistById
}

export default apis
