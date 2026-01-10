/**
 * ==============================================
 * Database Seeder
 * ==============================================
 * 
 * Populates the database with sample data for testing.
 * Run with: npm run seed
 * 
 * WARNING: This will clear existing data in the tables!
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

/**
 * Sample data for seeding
 */
const seedData = {
  cities: [
    { name: 'Marrakech', description: 'The Red City - Gateway to the Sahara with vibrant souks and stunning palaces', image_url: '/images/marrakech.jpg' },
    { name: 'Agadir', description: 'Coastal paradise with pristine beaches and Atlas mountain adventures', image_url: '/images/agadir.jpg' },
    { name: 'Erfoud', description: 'Fossil capital of Morocco and the door to Merzouga desert dunes', image_url: '/images/erfoud.jpg' },
    { name: 'Dakhla', description: 'Ultimate kitesurfing destination with endless lagoons and wild Atlantic coast', image_url: '/images/dakhla.jpg' },
    { name: 'Fes', description: 'Ancient imperial city with the world\'s largest car-free urban area', image_url: '/images/fes.jpg' }
  ],

  categories: [
    { name: 'Desert Safari', icon: '🏜️' },
    { name: 'Camel Trekking', icon: '🐪' },
    { name: 'Quad & Buggy', icon: '🏎️' },
    { name: 'Camping', icon: '⛺' },
    { name: 'Cultural Tours', icon: '🕌' },
    { name: 'Adventure Sports', icon: '🪂' }
  ],

  users: [
    { name: 'Admin User', email: 'admin@moroccodesert.com', password: 'Admin123!', phone: '+212600000001', role: 'admin' },
    { name: 'Sarah Johnson', email: 'sarah@example.com', password: 'User123!', phone: '+1234567890', role: 'client' },
    { name: 'Mohammed Ali', email: 'mohammed@example.com', password: 'User123!', phone: '+212612345678', role: 'client' },
    { name: 'Emma Wilson', email: 'emma@example.com', password: 'User123!', phone: '+44789456123', role: 'client' },
    { name: 'Pierre Dubois', email: 'pierre@example.com', password: 'User123!', phone: '+33612345678', role: 'client' },
    { name: 'Hans Mueller', email: 'hans@example.com', password: 'User123!', phone: '+49123456789', role: 'client' },
    { name: 'Sofia Garcia', email: 'sofia@example.com', password: 'User123!', phone: '+34612345678', role: 'client' },
    { name: 'Yuki Tanaka', email: 'yuki@example.com', password: 'User123!', phone: '+81901234567', role: 'client' },
    { name: 'Ahmed Hassan', email: 'ahmed@example.com', password: 'User123!', phone: '+20123456789', role: 'client' },
    { name: 'Maria Rossi', email: 'maria@example.com', password: 'User123!', phone: '+39345678901', role: 'client' }
  ],

  tours: [
    // Marrakech Tours
    { name: 'Sahara Desert Adventure', city: 'Marrakech', category: 'Desert Safari', description: 'Experience the magic of the Sahara with a 3-day journey through golden dunes, Berber villages, and starlit camps.', duration_days: 3, price_standard: 2500, price_premium: 4500, max_guests: 12, images: ['/tours/sahara-1.jpg', '/tours/sahara-2.jpg'] },
    { name: 'Marrakech to Merzouga Express', city: 'Marrakech', category: 'Desert Safari', description: 'Fast-track desert experience with luxury 4x4 transport and overnight in a premium desert camp.', duration_days: 2, price_standard: 1800, price_premium: 3200, max_guests: 8, images: ['/tours/merzouga-1.jpg'] },
    { name: 'Atlas Mountains & Desert Combo', city: 'Marrakech', category: 'Adventure Sports', description: 'Trek the High Atlas and descend into the desert for a complete Moroccan adventure.', duration_days: 4, price_standard: 3500, price_premium: 5500, max_guests: 10, images: ['/tours/atlas-1.jpg'] },
    { name: 'Sunset Camel Trek', city: 'Marrakech', category: 'Camel Trekking', description: 'A magical sunset camel ride through palm groves ending with traditional Moroccan dinner.', duration_days: 1, price_standard: 450, price_premium: 750, max_guests: 15, images: ['/tours/camel-sunset.jpg'] },
    
    // Agadir Tours
    { name: 'Quad Adventure Agadir', city: 'Agadir', category: 'Quad & Buggy', description: 'Thrilling quad bike adventure through Agadir\'s coastal dunes and argan forests.', duration_days: 1, price_standard: 650, price_premium: 1100, max_guests: 8, images: ['/tours/quad-agadir.jpg'] },
    { name: 'Paradise Valley Expedition', city: 'Agadir', category: 'Adventure Sports', description: 'Discover hidden waterfalls and natural pools in the stunning Paradise Valley.', duration_days: 1, price_standard: 500, price_premium: 850, max_guests: 12, images: ['/tours/paradise-valley.jpg'] },
    { name: 'Sahara Gateway Tour', city: 'Agadir', category: 'Desert Safari', description: 'Journey from the Atlantic coast deep into the Sahara Desert.', duration_days: 5, price_standard: 4200, price_premium: 7000, max_guests: 10, images: ['/tours/agadir-sahara.jpg'] },
    
    // Erfoud Tours
    { name: 'Erg Chebbi Dunes Experience', city: 'Erfoud', category: 'Camel Trekking', description: 'Camel trek to the majestic Erg Chebbi dunes with overnight in a luxury desert camp.', duration_days: 2, price_standard: 1200, price_premium: 2200, max_guests: 14, images: ['/tours/erg-chebbi.jpg'] },
    { name: 'Fossil Discovery Tour', city: 'Erfoud', category: 'Cultural Tours', description: 'Explore ancient fossil sites and learn about Morocco\'s prehistoric past.', duration_days: 1, price_standard: 350, price_premium: 600, max_guests: 15, images: ['/tours/fossils.jpg'] },
    { name: 'Desert Camping Ultimate', city: 'Erfoud', category: 'Camping', description: 'Ultimate desert camping with traditional music, stargazing, and sandboarding.', duration_days: 3, price_standard: 1800, price_premium: 3000, max_guests: 12, images: ['/tours/desert-camp.jpg'] },
    
    // Dakhla Tours
    { name: 'Dakhla Kitesurfing Camp', city: 'Dakhla', category: 'Adventure Sports', description: 'World-class kitesurfing in the famous Dakhla lagoon with expert instruction.', duration_days: 5, price_standard: 5500, price_premium: 8500, max_guests: 8, images: ['/tours/kitesurf.jpg'] },
    { name: 'White Dune Expedition', city: 'Dakhla', category: 'Desert Safari', description: 'Explore the spectacular white dunes and remote Atlantic beaches.', duration_days: 2, price_standard: 1500, price_premium: 2500, max_guests: 10, images: ['/tours/white-dunes.jpg'] },
    { name: 'Lagoon Sunset Tour', city: 'Dakhla', category: 'Cultural Tours', description: 'Sunset boat tour of the magnificent Dakhla lagoon with flamingo spotting.', duration_days: 1, price_standard: 400, price_premium: 700, max_guests: 12, images: ['/tours/lagoon.jpg'] },
    
    // Fes Tours
    { name: 'Imperial Cities & Desert', city: 'Fes', category: 'Cultural Tours', description: 'Journey through Morocco\'s imperial cities ending with a desert adventure.', duration_days: 6, price_standard: 5000, price_premium: 8000, max_guests: 14, images: ['/tours/imperial.jpg'] },
    { name: 'Fes to Sahara Classic', city: 'Fes', category: 'Desert Safari', description: 'Classic route from Fes through the Middle Atlas to the Sahara Desert.', duration_days: 3, price_standard: 2200, price_premium: 3800, max_guests: 12, images: ['/tours/fes-sahara.jpg'] }
  ]
};

/**
 * Main seeding function
 */
async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Test database connection
    await db.testConnection();

    // Disable foreign key checks temporarily
    await db.query('SET FOREIGN_KEY_CHECKS = 0');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.query('TRUNCATE TABLE reviews');
    await db.query('TRUNCATE TABLE payments');
    await db.query('TRUNCATE TABLE bookings');
    await db.query('TRUNCATE TABLE tours');
    await db.query('TRUNCATE TABLE categories');
    await db.query('TRUNCATE TABLE cities');
    await db.query('TRUNCATE TABLE users');

    // Re-enable foreign key checks
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    // Seed Cities
    console.log('🏙️  Seeding cities...');
    for (const city of seedData.cities) {
      await db.query(
        'INSERT INTO cities (name, description, image_url, created_at) VALUES (?, ?, ?, NOW())',
        [city.name, city.description, city.image_url]
      );
    }
    console.log(`   ✅ Created ${seedData.cities.length} cities`);

    // Seed Categories
    console.log('📂 Seeding categories...');
    for (const category of seedData.categories) {
      await db.query(
        'INSERT INTO categories (name, icon, created_at) VALUES (?, ?, NOW())',
        [category.name, category.icon]
      );
    }
    console.log(`   ✅ Created ${seedData.categories.length} categories`);

    // Seed Users
    console.log('👥 Seeding users...');
    for (const user of seedData.users) {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      await db.query(
        'INSERT INTO users (name, email, password, phone, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [user.name, user.email, hashedPassword, user.phone, user.role]
      );
    }
    console.log(`   ✅ Created ${seedData.users.length} users`);

    // Get city and category IDs for tours
    const cities = await db.query('SELECT id, name FROM cities');
    const categories = await db.query('SELECT id, name FROM categories');
    const cityMap = Object.fromEntries(cities.map(c => [c.name, c.id]));
    const categoryMap = Object.fromEntries(categories.map(c => [c.name, c.id]));

    // Seed Tours
    console.log('🏜️  Seeding tours...');
    for (const tour of seedData.tours) {
      await db.query(
        `INSERT INTO tours 
         (name, city_id, category_id, description, duration_days, 
          price_standard, price_premium, max_guests, images, is_active, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())`,
        [
          tour.name,
          cityMap[tour.city],
          categoryMap[tour.category],
          tour.description,
          tour.duration_days,
          tour.price_standard,
          tour.price_premium,
          tour.max_guests,
          JSON.stringify(tour.images)
        ]
      );
    }
    console.log(`   ✅ Created ${seedData.tours.length} tours`);

    // Get user and tour IDs for bookings
    const users = await db.query('SELECT id FROM users WHERE role = "client"');
    const tours = await db.query('SELECT id, price_standard, duration_days FROM tours');

    // Seed Bookings
    console.log('📅 Seeding bookings...');
    const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    const bookingsToCreate = 20;
    
    for (let i = 0; i < bookingsToCreate; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const tour = tours[Math.floor(Math.random() * tours.length)];
      const guests = Math.floor(Math.random() * 4) + 1;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60) - 30);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + tour.duration_days);

      const result = await db.query(
        `INSERT INTO bookings 
         (user_id, tour_id, start_date, end_date, guests, tier, total_price, status, created_at)
         VALUES (?, ?, ?, ?, ?, 'standard', ?, ?, NOW())`,
        [
          user.id,
          tour.id,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0],
          guests,
          tour.price_standard * guests,
          status
        ]
      );

      // Create payment for confirmed/completed bookings
      if (status === 'confirmed' || status === 'completed') {
        const paymentResult = await db.query(
          `INSERT INTO payments 
           (booking_id, amount, method, status, currency, created_at)
           VALUES (?, ?, 'stripe', 'completed', 'MAD', NOW())`,
          [result.insertId, tour.price_standard * guests]
        );
        
        await db.query(
          'UPDATE bookings SET payment_id = ? WHERE id = ?',
          [paymentResult.insertId, result.insertId]
        );
      }
    }
    console.log(`   ✅ Created ${bookingsToCreate} bookings with payments`);

    // Seed Reviews (only for completed bookings)
    console.log('⭐ Seeding reviews...');
    const completedBookings = await db.query(
      'SELECT b.id, b.user_id, b.tour_id FROM bookings b WHERE b.status = "completed"'
    );

    const comments = [
      'Amazing experience! Would definitely recommend.',
      'The guides were very professional and friendly.',
      'Unforgettable sunset views over the dunes.',
      'Great value for money. Exceeded expectations.',
      'A must-do experience when visiting Morocco!',
      'The desert camp was luxurious and comfortable.',
      'Perfect organization from start to finish.',
      'An adventure of a lifetime!'
    ];

    for (const booking of completedBookings) {
      const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
      const comment = comments[Math.floor(Math.random() * comments.length)];
      
      await db.query(
        `INSERT INTO reviews 
         (user_id, tour_id, rating, comment, is_verified, is_published, created_at)
         VALUES (?, ?, ?, ?, 1, 1, NOW())`,
        [booking.user_id, booking.tour_id, rating, comment]
      );
    }
    console.log(`   ✅ Created ${completedBookings.length} reviews`);

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('📝 Test Credentials:');
    console.log('   Admin: admin@moroccodesert.com / Admin123!');
    console.log('   Client: sarah@example.com / User123!');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
