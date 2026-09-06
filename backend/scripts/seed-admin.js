#!/usr/bin/env node

/**
 * Admin Seed Script
 * 
 * This is the ONLY way to create or promote a user to admin role.
 * Admin accounts cannot be created through signup, login, or any API endpoint.
 * 
 * Usage:
 *   node scripts/seed-admin.js <firebase_uid> <email> <name>
 * 
 * Examples:
 *   # Create a new admin user:
 *   node scripts/seed-admin.js abc123FirebaseUid admin@campusiq.com "Platform Admin"
 * 
 *   # Promote an existing user to admin (by Firebase UID):
 *   node scripts/seed-admin.js abc123FirebaseUid
 * 
 * The script will:
 *   1. Check if a user with that Firebase UID already exists
 *   2. If yes → promote them to admin role
 *   3. If no → create a new user with admin role (requires email + name args)
 */

const pool = require('../src/config/db');

async function seedAdmin() {
  const [,, firebaseUid, email, name] = process.argv;

  if (!firebaseUid) {
    console.error('\n❌ Error: Firebase UID is required.\n');
    console.log('Usage:');
    console.log('  node scripts/seed-admin.js <firebase_uid> [email] [name]\n');
    console.log('Examples:');
    console.log('  node scripts/seed-admin.js abc123 admin@campusiq.com "Admin User"');
    console.log('  node scripts/seed-admin.js abc123   (promote existing user)\n');
    process.exit(1);
  }

  const client = await pool.connect();

  try {
    // Check if user already exists
    const existing = await client.query(
      'SELECT id, email, name, role FROM users WHERE firebase_uid = $1',
      [firebaseUid]
    );

    if (existing.rows.length > 0) {
      const user = existing.rows[0];

      if (user.role === 'admin') {
        console.log(`\n✅ User "${user.name}" (${user.email}) is already an admin.\n`);
        process.exit(0);
      }

      // Promote existing user to admin
      await client.query(
        'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE firebase_uid = $2',
        ['admin', firebaseUid]
      );

      console.log(`\n✅ User promoted to admin successfully!`);
      console.log(`   Name:  ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role:  student → admin\n`);
      process.exit(0);
    }

    // Creating new admin — email and name are required
    if (!email || !name) {
      console.error('\n❌ Error: No existing user found with that Firebase UID.');
      console.error('   To create a new admin, provide all 3 arguments:\n');
      console.log('   node scripts/seed-admin.js <firebase_uid> <email> <name>\n');
      process.exit(1);
    }

    // Check for email conflict
    const emailConflict = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (emailConflict.rows.length > 0) {
      console.error(`\n❌ Error: A user with email "${email}" already exists.\n`);
      process.exit(1);
    }

    // Insert new admin user
    const result = await client.query(
      `INSERT INTO users (firebase_uid, email, name, role, is_active)
       VALUES ($1, $2, $3, 'admin', TRUE)
       RETURNING id, email, name, role`,
      [firebaseUid, email, name]
    );

    const newAdmin = result.rows[0];
    console.log(`\n✅ Admin user created successfully!`);
    console.log(`   ID:    ${newAdmin.id}`);
    console.log(`   Name:  ${newAdmin.name}`);
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Role:  admin\n`);
  } catch (error) {
    console.error('\n❌ Failed to seed admin user:', error.message, '\n');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedAdmin();
