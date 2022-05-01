import axios from 'axios';

// allows you to set the base url for the whole application so you don't have to continue to retype the url else where
export default axios.create({
  baseURL: 'http://localhost:8000',
});

// at localhost:8000 we run the backend api with anther instance of vscode
