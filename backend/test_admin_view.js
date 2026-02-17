const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = `admin_view_${Date.now()}@example.com`;
const PASSWORD = 'password123';

async function run() {
    try {
        console.log(`Registering Admin: ${ADMIN_EMAIL}...`);
        await axios.post(`${BASE_URL}/auth/register`, {
            email: ADMIN_EMAIL,
            password: PASSWORD,
            name: 'Admin View Test',
            position: 'web_developer_frontend',
            seniority: 'senior'
        });

        console.log(`Logging in as Admin: ${ADMIN_EMAIL}...`);
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: PASSWORD
        });
        const token = loginRes.data.accessToken;
        console.log('Got Admin Token');

        const date = new Date().toISOString().split('T')[0];
        const headers = { Authorization: `Bearer ${token}` };

        console.log(`Fetching Admin Updates for ${date}...`);
        const updatesRes = await axios.get(`${BASE_URL}/daily-updates/admin`, {
            params: { date },
            headers
        });
        console.log('Updates:', updatesRes.data.length, 'records');
        if (updatesRes.data.length > 0) {
            console.log('Sample Update:', JSON.stringify(updatesRes.data[0], null, 2));
        }

        console.log('Fetching Submission Status...');
        const statusRes = await axios.get(`${BASE_URL}/daily-updates/admin/submission-status`, {
            params: { date },
            headers
        });
        console.log('Status:', statusRes.data);

        console.log('Fetching Blockers...');
        const blockersRes = await axios.get(`${BASE_URL}/daily-updates/admin/blockers`, {
            params: { from: date, to: date },
            headers
        });
        console.log('Blockers:', blockersRes.data.length, 'records');

    } catch (error) {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

run();
