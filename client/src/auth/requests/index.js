/*
    This is our http api for all things auth, which we use to 
    send authorization requests to our back-end API. Note we`re 
    using the Axios library for doing this, which is an easy to 
    use AJAX-based library. We could (and maybe should) use Fetch, 
    which is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

/*
import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/auth',
})
*/

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /register). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

const baseURL = "http://localhost:4000";

const responseHandler = async (response) => {
    let data = {};
    try {
        const text = await response.text();
        if (text) {data = JSON.parse(text);}
    } 
    catch(err) {
        console.warn("JSON error", err)
        data = {};
    }
    return { status: response.status, ok: response.ok, data };
}

export const getLoggedIn = () => {
    return fetch(`${baseURL}/auth/loggedIn/`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(responseHandler);
}

export const loginUser = (email, password) => {
    const loginInfo = {email: email, password: password};
    
    return fetch(`${baseURL}/auth/login/`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(loginInfo)
    })
    .then(responseHandler);
}

export const logoutUser = () => {
    return fetch(`${baseURL}/auth/logout/`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(responseHandler);
}

export const registerUser = (firstName, lastName, email, password, passwordVerify) => {
    const loginInfo = {
        firstName : firstName,
        lastName : lastName,
        email : email,
        password : password,
        passwordVerify : passwordVerify
    };

    return fetch(`${baseURL}/auth/register/`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(loginInfo)
    })
    .then(responseHandler);
}

const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis
