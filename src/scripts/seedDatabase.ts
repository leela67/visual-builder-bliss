import { db } from '../lib/database';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    await db.seedDatabase();
    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();