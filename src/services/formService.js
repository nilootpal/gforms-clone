import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL_FORM;

export const getForms = async (userId) => {
    console.log("Get Forms initiated")
    return axios.get(API_URL+'getuserforms/'+userId)
                .then(response => response.data)
}

export const createForm = async (data) => {
    return axios.post(API_URL+'create', data)
                .then(response => response.data)
}

export const getForm = async (formId) => {
    return axios.get(API_URL+'form/'+formId)
                .then(response => response.data)
}

export const autoSave = async (data) => {
    return axios.put(API_URL+'editform', data)
                .then(response => response.data)
}

export const submitResponse = async (data) => {
    return axios.post(API_URL+'addResponse', data)
                .then(response => response.data)
}

export const getResponse = async (formId) => {
    return axios.get(process.env.API_URL_FORM+'getresponse/'+formId)
                .then(response => response.data)
}

export const deleteForm = async (formId, userId) => {
    return axios.delete(API_URL+'deleteform/'+formId+'/'+userId)
                .then(response => response.data)
}