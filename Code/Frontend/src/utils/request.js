import axios from 'axios';
import config from '../config';

/**
 *
 * @param {string} path
 * @param {*} params
 * @param {boolean} withCredential
 * @returns *
 */
const get = async (path, params = {}, withCredential = true) => {
  const response = await axios.get(
    config.apiBaseUrl + path,
    { params, withCredential, headers:{'Authorization':'Bearer ' + sessionStorage.getItem("token")} },

  );
  return response.data;
};

/**
 * 
 * @param {string} path 
 * @param {*} params 
 * @param {boolean} withCredential 
 * @returns *
 */
const post = async (path, params, withCredential = true, withAuthorization = true) => {
  const authHeaders = {headers:{'Authorization':'Bearer ' + sessionStorage.getItem("token")}}

  const response = await axios.post(
    config.apiBaseUrl + path,
    params,
    { withCredential, ...(withAuthorization ? authHeaders : {})},
  );

  return response.data;
}

export default { get, post };