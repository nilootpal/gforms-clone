import axios from 'axios';
import jwtDecode from 'jwt-decode';
// import jwt from 'jsonwebtoken';

const API_URL = process.env.REACT_APP_API_URL_USER;

export const isAuthenticated = () => {
    const token = localStorage.getItem('userToken');
    if(token){
        return true;
    } else {
        return false;
    }
};

export const loginWithCredentials = async (req) => {
    let data = {
        name: req.name,
        email: req.email,
    }

    return axios.post(API_URL+'login', data)
                .then((response) => {

                    if(response.data.accessToken){
                        localStorage.setItem('userToken', JSON.stringify(response.data.accessToken));
                    }
                    return response.data;
                });
}

export const guestCredentials = () => {
    console.log("Guest login initiated")
    // let userData = {
    //     id: '64f4dffbf168aa843508c757',
    //     name: "Anonymous", 
    //     email: "anonymous@gmail.com"
    // }

    let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjRkZmZiZjE2OGFhODQzNTA4Yzc1NyIsIm5hbWUiOiJBbm9ueW1vdXMiLCJlbWFpbCI6ImFub255bW91c0BnbWFpbC5jb20iLCJpYXQiOjE2OTM4NTM3MDgsImV4cCI6MTY5Mzk0MDEwOH0.Kqqc_t2QmVxdnfikmBcepnoc4Xu9_iYgPRZDFpQh5-Y'

    // const accessToken = jwt.sign(userData, 'jroikseir', {expiresIn: '24h'});
    localStorage.setItem("userToken", JSON.stringify(accessToken));   
    return accessToken;   
}

export const logout = () => {
    localStorage.removeItem('userToken');
}

export const getCurrentUser = () => {
    return jwtDecode(localStorage.getItem('userToken'));
}