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
    { params },
    { withCredential }
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
const post = async (path, params, withCredential = true) => {
  const response = await axios.post(
    config.apiBaseUrl + path,
    params,
    { withCredential }
  );
  return response.data;
}

export default { get, post };