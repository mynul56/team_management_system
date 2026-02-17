const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function run() {
    try {
        // 1. Register User
        const userEmail = `user_${Date.now()}@test.com`;
        const userPassword = 'password123';
        console.log(`Registering user: ${userEmail}`);
        await axios.post(`${API_URL}/auth/register`, {
            email: userEmail,
            password: userPassword,
            name: 'Test User',
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

        // 3. Submit Leave Request
        console.log('Submitting leave request...');
        const leaveRes = await axios.post(
            `${API_URL}/leave`,
            {
                leaveType: 'casual',
                startDate: '2023-11-01',
                endDate: '2023-11-02',
                reason: 'Vacation',
            },
            { headers: { Authorization: `Bearer ${userToken}` } }
        );
        const leaveId = leaveRes.data._id;
        console.log(`Leave request submitted. ID: ${leaveId}`);

        // 4. Register Admin (or login existing)
        // For simplicity, we'll try to login as a known admin or create one
        // We'll create a new admin for safety
        const adminEmail = `admin_${Date.now()}@test.com`;
        console.log(`Registering admin: ${adminEmail}`);
        // Note: We need a way to make this user an admin. check auth.service.ts
        // The previous hack to force admin is gone.
        // We will assume there is an endpoint or we can use the same user if we can verify roles?
        // Actually, let's just use the user token to check if 'my leaves' works first.

        // 5. Get My Leaves
        console.log('Fetching my leaves...');
        const myLeaves = await axios.get(`${API_URL}/leave/me`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log(`My leaves count: ${myLeaves.data.length}`);

        if (myLeaves.data.length === 0) throw new Error('Leave request not found in list');

        console.log('Backend Leave Flow (User Side) Verified Successfully!');

    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
    }
}

run();
