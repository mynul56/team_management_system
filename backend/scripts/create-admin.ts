/**
 * One-time script to create the first admin user.
 * Run from backend/: ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME=... npx ts-node scripts/create-admin.ts
 * Loads .env from backend/ so MONGODB_URI is used.
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '..', '.env') });

import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

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
