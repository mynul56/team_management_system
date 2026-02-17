const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function run() {
    try {
        // 1. Register User
        const email = `test_daily_${Date.now()}@example.com`;
        console.log(`Registering user: ${email}`);
        await axios.post(`${BASE_URL}/auth/register`, {
            email,
            password: 'password123',
            name: 'Daily Test',
            position: 'web_developer_frontend',
            seniority: 'junior'
        });

        // 2. Login User
        console.log('Logging in...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password: 'password123'
        });
        const token = loginRes.data.accessToken;
        console.log('Got User Token');

        // 3. Register Admin (to create project)
        const adminEmail = `admin_${Date.now()}@example.com`;
        console.log(`Registering admin: ${adminEmail}`);
        // Hack: Register as user then maybe we can't promote easily without DB access.
        // Assuming there is an existing admin or we can just try to create a project as user (which should fail or succeed depending on roles).
        // Actually, let's try to fetch projects first.

        console.log('Fetching projects...');
        const projectsRes = await axios.get(`${BASE_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        let projects = projectsRes.data;

        let projectId;
        if (projects.length === 0) {
            console.log('No projects found. Trying to create one (this might fail if not admin)...');
            // Try to create project (this endpoint usually requires Admin)
            try {
                const createRes = await axios.post(`${BASE_URL}/projects`, {
                    name: 'Test Project',
                    status: 'active',
                    projectType: 'web',
                    deadline: new Date(Date.now() + 86400000)
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                projectId = createRes.data._id;
                console.log('Project created:', projectId);
            } catch (e) {
                if (e.response) {
                    console.log('Failed to create project:', e.response.status, JSON.stringify(e.response.data));
                } else {
                    console.log('Failed to create project:', e.message);
                }
                console.log('Cannot proceed with daily update test without a project.');
                return;
            }
        } else {
            projectId = projects[0]._id;
            console.log('Using existing project:', projectId);
        }

        if (!projectId) return;

        // 4. Submit Daily Update
        console.log('Submitting Daily Update...');
        const date = new Date().toISOString().split('T')[0];
        const submitRes = await axios.post(`${BASE_URL}/daily-updates?date=${date}`, {
            projectId,
            completedToday: 'Fixing bugs',
            inProgress: 'Testing',
            blockers: 'None'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Submit Success:', submitRes.data);

        // 5. Check Admin View (requires admin token, so skipping for now unless we need it)

    } catch (error) {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

run();
