import axios from "axios";
import 'dotenv/config';

export const uploadImage = async (data) => {
    return axios.post(process.env.REACT_APP_API_URL_UPLOAD, data)
                .then(response => response.data)
}