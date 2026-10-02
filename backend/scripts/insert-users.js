const pool = require('../src/config/db');

async function seed() {
  const query = `
    INSERT INTO users (
      id,
      firebase_uid,
      email,
      name,
      phone,
      role,
      department,
      avatar_url,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      'c7630164-657c-44ff-9b65-5bcf22c55fd5',
      'N9XHgpi52sQYc1xNtk6FbjoeUmQ2',
      'admin@gmail.com',
      'CampusIQ User',
      NULL,
      'admin',
      NULL,
      NULL,
      TRUE,
      '2026-09-06 09:20:11.166815+00',
      '2026-09-06 09:23:39.429575+00'
    ), (
      'dbd47f89-0339-4a3e-8eb7-745359f93d38',
      '49PqGh5FDpfNnrMHtnyXSMT2ksp2',
      'anilreddy5251@gmail.com',
      'Anil Reddy',
      NULL,
      'student',
      NULL,
      'https://lh3.googleusercontent.com/a/ACg8ocLouvgrZHHBxt_qTFTjtIdTQa9HpZhcDUEKL2reL29vTAv4Xw=s96-c',
      TRUE,
      '2026-10-02 08:24:16.66895+00',
      '2026-10-02 08:24:16.66895+00'
    )
    ON CONFLICT (id) DO UPDATE SET
      firebase_uid = EXCLUDED.firebase_uid,
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      role = EXCLUDED.role,
      department = EXCLUDED.department,
      avatar_url = EXCLUDED.avatar_url,
      is_active = EXCLUDED.is_active,
      updated_at = EXCLUDED.updated_at;
  `;

  try {
    const res = await pool.query(query);
    console.log('Successfully inserted/updated users count:', res.rowCount);
  } catch (error) {
    console.error('Error inserting users:', error);
  } finally {
    await pool.end();
  }
}

seed();
