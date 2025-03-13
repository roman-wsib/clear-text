import axios from 'axios';

export default axios.create({
	// For local development:
	baseURL: "http://127.0.0.1:5000",
	// baseURL: 'https://document-simplification-api.azurewebsites.net/',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	// For local development:
	// withCredentials: true,
});
