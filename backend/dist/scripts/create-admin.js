"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '..', '.env') });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/team_management';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
async function main() {
    await mongoose.connect(MONGODB_URI);
    const User = mongoose.connection.collection('users');
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
        console.log('Admin user already exists:', ADMIN_EMAIL);
        process.exit(0);
        return;
    }
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.insertOne({
        email: ADMIN_EMAIL,
        passwordHash,
        name: ADMIN_NAME,
        role: 'admin',
        position: 'web_developer_fullstack',
        seniority: 'lead',
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    console.log('Admin user created:', ADMIN_EMAIL);
    await mongoose.disconnect();
    process.exit(0);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=create-admin.js.map