const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function run() {
    try {
        // 1. Register User
        const userEmail = `user_gen_${Date.now()}@test.com`;
        const userPassword = 'password123';
        console.log(`Registering user: ${userEmail}`);
        await axios.post(`${API_URL}/auth/register`, {
            email: userEmail,
            password: userPassword,
            name: 'Test Gen User',
            position: 'web_developer_frontend',
            seniority: 'mid',
        });

        // 2. Login User
        console.log('Logging in user...');
        const userLogin = await axios.post(`${API_URL}/auth/login`, {
            email: userEmail,
            password: userPassword,
        });
        const userToken = userLogin.data.accessToken;
        console.log('User logged in.');
        console.log('Token snippet:', userToken.substring(0, 20) + '...');

        // 3. Test /users/me (General Auth)
        console.log('Testing /users/me...');
        const meRes = await axios.get(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log('User Profile Fetched:', meRes.data.email);

        // 4. Test /leave/me (Leave Auth)
        console.log('Testing /leave/me...');
        await axios.get(`${API_URL}/leave/me`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log('Leave List Fetched (empty is ok).');

        console.log('ALL TESTS PASSED!');

    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            console.error('401 Unauthorized - Token rejected.');
        }
    }
}

run();
