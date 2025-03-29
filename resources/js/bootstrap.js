import axios from 'axios';
import { auth } from './firebase';

// ✅ Base URL for Platform Requests
// axios.defaults.baseURL = '';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// ✅ Enable cross-origin credentials for cookies
axios.defaults.withCredentials = true;

// ✅ Set Platform Guard for platform_user requests
axios.defaults.headers.common['X-Auth-Guard'] = 'platform';

// ✅ Attach Firebase token to each Axios request
auth.onAuthStateChanged(async (user) => {
    if (user) {
        try {
            const idToken = await user.getIdToken();
            axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
            axios.defaults.headers.common['X-Auth-Guard'] = 'platform'; // ✅ Ensure Platform Guard
            console.log("✅ Firebase token added to Axios:", idToken);
        } catch (error) {
            console.error('❌ Error getting Firebase token:', error);
        }
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
});

// ✅ Optional: Log Axios requests for debugging
axios.interceptors.request.use(request => {
    console.log('📡 Axios Request:', request);
    return request;
}, error => {
    console.error('❌ Axios Request Error:', error);
    return Promise.reject(error);
});

// ✅ Optional: Log Axios responses for debugging
axios.interceptors.response.use(response => {
    console.log('📨 Axios Response:', response);
    return response;
}, error => {
    console.error('❌ Axios Response Error:', error);
    return Promise.reject(error);
});


