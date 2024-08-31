// FetchTheMovieDB.js

import { getResponseContent, RequestError } from './Response'; // Assuming this file is in the same directory as services folder

async function makeRequest(endpoint, method, data, token,form) {
    const headers = {};
    if (!form) {
         headers['Content-Type'] = 'application/json';
    }
    if (token) {
        headers.authtoken = token;
        // headers.Authorization = `Bearer ${token?localStorage.getItem("TOKEN"):""}`;
    }
    const response = await fetch(endpoint, {
        method,
        headers,
        body: data // Send JSON data directly in the body
    });
    const content = await getResponseContent(response);
    if (response.ok) return content;

    let errorMessage = '';
    if (content && content.message) {
        errorMessage = content.message;
    } else {
        errorMessage = response.statusText;
    }
    console.error('errorMessage:',errorMessage);
    throw new RequestError(errorMessage, response.status, content);
}

const FetchData = async (endpoint, method, data, token,form) => {
    try {
        return await makeRequest(endpoint, method, data, token,form);
    } catch (error) {
        console.log("error",error)
        throw error;
    }
};

export default FetchData;
