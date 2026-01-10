-- =====================================================
-- Morocco Desert Riders - MySQL Database Schema
-- Premium Adventure Tours Application
-- =====================================================

-- Drop tables if they exist (for clean import)
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS tours;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS users;

-- =====================================================
-- USERS TABLE
-- Stores both clients and admin users
-- =====================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Store hashed passwords only (bcrypt)',
    phone VARCHAR(20),
    role ENUM('client', 'admin') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CITIES TABLE
-- Moroccan cities where tours operate
-- =====================================================
CREATE TABLE cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CATEGORIES TABLE
-- Tour categories (Adventure, Premium, Action, etc.)
-- =====================================================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TOURS TABLE
-- All available desert tours and adventures
-- =====================================================
CREATE TABLE tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city_id INT NOT NULL,
    category_id INT NOT NULL,
    description TEXT,
    duration_days INT NOT NULL DEFAULT 1,
    price_standard DECIMAL(10, 2) NOT NULL,
    price_premium DECIMAL(10, 2) NOT NULL,
    max_guests INT DEFAULT 12,
    images JSON COMMENT 'Array of image URLs',
    highlights JSON COMMENT 'Array of tour highlights',
    inclusions TEXT,
    exclusions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_city (city_id),
    INDEX idx_category (category_id),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BOOKINGS TABLE
-- Customer tour bookings
-- =====================================================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tour_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    guests INT NOT NULL DEFAULT 1,
    tier ENUM('standard', 'premium') DEFAULT 'standard',
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE RESTRICT,
    INDEX idx_user (user_id),
    INDEX idx_tour (tour_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PAYMENTS TABLE
-- Payment records for bookings
-- =====================================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    method ENUM('stripe', 'paypal', 'bank_transfer', 'cash') NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    payment_details JSON COMMENT 'Gateway response data',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking (booking_id),
    INDEX idx_status (status),
    INDEX idx_transaction (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- REVIEWS TABLE
-- Customer reviews for tours
-- =====================================================
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tour_id INT NOT NULL,
    booking_id INT,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE COMMENT 'Verified purchase review',
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    INDEX idx_tour (tour_id),
    INDEX idx_user (user_id),
    INDEX idx_rating (rating),
    UNIQUE KEY unique_user_tour (user_id, tour_id) COMMENT 'One review per user per tour'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAMPLE DATA - CITIES
-- =====================================================
INSERT INTO cities (name, description, image_url) VALUES
('Agadir', 'Coastal city known for beautiful beaches and as a gateway to Atlas mountain adventures', 'agadir.jpg'),
('Dakhla', 'Remote paradise for kitesurfing and untouched desert experiences', 'dakhla.jpg'),
('Erfoud', 'Gateway to the majestic Erg Chebbi dunes and fossil country', 'erfoud.jpg'),
('Marrakech', 'The iconic Red City - starting point for Sahara expeditions', 'marrakech.jpg');

-- =====================================================
-- SAMPLE DATA - CATEGORIES
-- =====================================================
INSERT INTO categories (name, description, icon) VALUES
('Adventure', 'Thrilling desert expeditions and exploration', 'compass'),
('Premium', 'Luxury experiences with premium accommodations', 'crown'),
('Action', 'Adrenaline-pumping activities like quad biking', 'zap'),
('Cultural', 'Immersive local experiences and heritage tours', 'landmark'),
('Watersport', 'Kitesurfing, surfing, and water activities', 'waves'),
('Photography', 'Scenic tours designed for photographers', 'camera');

-- =====================================================
-- SAMPLE DATA - USERS (10 users)
-- Note: Passwords are hashed versions of simple passwords for demo
-- In production, use proper bcrypt hashing
-- =====================================================
INSERT INTO users (name, email, password, phone, role) VALUES
('Ahmed Bennani', 'ahmed@moroccodesert.com', '$2b$10$xN8vULbXhxvxQRQ7YqLo8.dummy_hash_admin', '+212661234567', 'admin'),
('Fatima El Amrani', 'fatima@moroccodesert.com', '$2b$10$xN8vULbXhxvxQRQ7YqLo8.dummy_hash_admin', '+212662345678', 'admin'),
('John Smith', 'john.smith@email.com', '$2b$10$xN8vULbXhxvxQRQ7YqLo8.dummy_hash_client', '+14155551234', 'client'),
('Emma Wilson', 'emma.wilson@email.com', '$2b$10$xN8vULbXhxvxQRQ7YqLo8.dummy_hash_client', '+447911123456', 'client'),
('Pierre Dubois', 'pierre.dubois@email.fr', '$2b$10$xN8vULbXhxvxQRQ7YqLo8.dummy_hash_client', '+33612345678', 'client'),
('Maria Garcia', 'maria.garcia@email.es', '$2b$10$xN8vULbXhxvxQRQ7YqLo8.dummy_hash_client', '+34612345678', 'client'),
('Hans Mueller', 'hans.mueller@email.de', '$2b$10$xN8vULbXhxvxQRQ7YqLo8.dummy_hash_client', '+491512345678', 'client'),
('Yuki Tanaka', 'yuki.tanaka@email.jp', '$2b$10$xN8vULbXhxvxQRQ7YqLo8.dummy_hash_client', '+819012345678', 'client'),
('Sarah Johnson', 'sarah.johnson@email.com', '$2b$10$xN8vULbXhxvxQRQ7YqLo8.dummy_hash_client', '+12125551234', 'client'),
('Mohammed Al-Said', 'mohammed.alsaid@email.com', '$2b$10$xN8vULbXhxvxQRQ7YqLo8.dummy_hash_client', '+971501234567', 'client');

-- =====================================================
-- SAMPLE DATA - TOURS (35 tours across 4 cities)
-- =====================================================

-- AGADIR TOURS (10)
INSERT INTO tours (name, city_id, category_id, description, duration_days, price_standard, price_premium, images) VALUES
('Agadir Quad Biking Desert Adventure', 1, 3, 'Thrilling quad bike experience through golden dunes and desert landscapes near Agadir.', 1, 89.00, 129.00, '["agadir-quad-1.jpg", "agadir-quad-2.jpg"]'),
('Sunset Camel Ride & Beach BBQ', 1, 1, 'Romantic camel ride along Agadir beach with traditional Moroccan BBQ dinner.', 1, 75.00, 120.00, '["agadir-camel-beach.jpg"]'),
('Paradise Valley Day Trip', 1, 1, 'Explore the stunning Paradise Valley with natural pools and palm groves.', 1, 65.00, 95.00, '["paradise-valley.jpg"]'),
('Agadir to Sahara 3-Day Express', 1, 2, 'Quick but complete Sahara experience from Agadir with luxury camping.', 3, 399.00, 599.00, '["agadir-sahara-express.jpg"]'),
('Crocodile Park & Souk Adventure', 1, 4, 'Visit Crocoparc and explore the vibrant local souks of Agadir.', 1, 45.00, 75.00, '["agadir-croco.jpg"]'),
('Atlas Mountain & Berber Village Tour', 1, 4, 'Journey into the Anti-Atlas mountains and visit authentic Berber villages.', 1, 85.00, 135.00, '["agadir-atlas.jpg"]'),
('Agadir Surfing Experience', 1, 5, 'Learn to surf or improve your skills on Agadirs famous waves.', 1, 70.00, 110.00, '["agadir-surf.jpg"]'),
('Taghazout Surf & Yoga Retreat', 1, 5, 'Combine surfing with yoga in the laid-back village of Taghazout.', 3, 350.00, 550.00, '["taghazout-retreat.jpg"]'),
('Agadir Food & Culture Walking Tour', 1, 4, 'Taste authentic Moroccan cuisine while exploring Agadir highlights.', 1, 55.00, 85.00, '["agadir-food-tour.jpg"]'),
('Souss-Massa National Park Safari', 1, 1, 'Wildlife spotting in Moroccos premier coastal national park.', 1, 95.00, 145.00, '["souss-massa.jpg"]');

-- DAKHLA TOURS (6)
INSERT INTO tours (name, city_id, category_id, description, duration_days, price_standard, price_premium, images) VALUES
('Dakhla Kitesurfing & Desert Safari', 2, 5, 'World-class kitesurfing combined with desert exploration.', 5, 599.00, 849.00, '["dakhla-kite.jpg"]'),
('White Dune Experience', 2, 1, 'Explore the unique white sand dunes of Dakhla peninsula.', 1, 120.00, 180.00, '["dakhla-white-dune.jpg"]'),
('Dakhla Lagoon SUP Adventure', 2, 5, 'Stand-up paddleboarding in the crystal-clear Dakhla lagoon.', 1, 65.00, 95.00, '["dakhla-sup.jpg"]'),
('Desert Overnight Under Stars', 2, 2, 'Premium camping experience in the untouched Dakhla desert.', 2, 299.00, 449.00, '["dakhla-camp.jpg"]'),
('Fishing & Seafood Experience', 2, 4, 'Traditional fishing with locals and fresh seafood lunch.', 1, 85.00, 125.00, '["dakhla-fishing.jpg"]'),
('Dakhla Photography Expedition', 2, 6, 'Capture stunning desert and ocean landscapes with a pro guide.', 2, 250.00, 380.00, '["dakhla-photo.jpg"]');

-- ERFOUD TOURS (10)
INSERT INTO tours (name, city_id, category_id, description, duration_days, price_standard, price_premium, images) VALUES
('Erg Chebbi Sunrise Camel Trek', 3, 1, 'Witness the magical sunrise over the iconic Erg Chebbi dunes.', 2, 199.00, 299.00, '["erfoud-sunrise.jpg"]'),
('Sahara Sunset Camel Trek & Desert Camp', 3, 1, 'Classic 3-day desert experience with luxury camp stay.', 3, 299.00, 449.00, '["erfoud-sunset-camp.jpg"]'),
('Merzouga 4x4 Dune Bashing', 3, 3, 'Adrenaline-pumping 4x4 adventure across massive sand dunes.', 1, 110.00, 160.00, '["erfoud-4x4.jpg"]'),
('Fossil Discovery Tour', 3, 4, 'Explore ancient fossil beds and visit local workshops.', 1, 75.00, 115.00, '["erfoud-fossil.jpg"]'),
('Gnawa Music & Desert Night', 3, 4, 'Traditional Gnawa music performance under desert stars.', 1, 130.00, 190.00, '["erfoud-gnawa.jpg"]'),
('Sandboarding Adventure', 3, 3, 'Surf the dunes! Learn sandboarding on Erg Chebbi slopes.', 1, 65.00, 95.00, '["erfoud-sandboard.jpg"]'),
('Luxury Desert Glamping Experience', 3, 2, 'Ultimate luxury in the heart of the Sahara with gourmet dining.', 2, 450.00, 699.00, '["erfoud-glamping.jpg"]'),
('Berber Culture Immersion', 3, 4, 'Live with a Berber family and learn traditional crafts.', 2, 180.00, 280.00, '["erfoud-berber.jpg"]'),
('Stargazing Astronomy Night', 3, 6, 'Expert-guided stargazing in one of worlds clearest skies.', 1, 95.00, 145.00, '["erfoud-stars.jpg"]'),
('5-Day Ultimate Sahara Expedition', 3, 2, 'Comprehensive desert journey with multiple experiences.', 5, 699.00, 999.00, '["erfoud-expedition.jpg"]');

-- MARRAKECH TOURS (9)
INSERT INTO tours (name, city_id, category_id, description, duration_days, price_standard, price_premium, images) VALUES
('Marrakech to Merzouga Desert Tour', 4, 1, 'Classic 3-day journey from Marrakech to Sahara and back.', 3, 299.00, 449.00, '["marrakech-merzouga.jpg"]'),
('Luxury Desert Camp Under the Stars', 4, 2, 'Premium 2-day escape to a luxury desert camp.', 2, 399.00, 599.00, '["marrakech-luxury-camp.jpg"]'),
('Atlas Mountains & Ait Benhaddou', 4, 4, 'Visit the famous kasbah and explore High Atlas valleys.', 1, 85.00, 135.00, '["marrakech-ait-ben.jpg"]'),
('Ourika Valley Day Trip', 4, 1, 'Escape to the beautiful Ourika Valley with waterfalls.', 1, 55.00, 85.00, '["marrakech-ourika.jpg"]'),
('Hot Air Balloon Sunrise Experience', 4, 2, 'Float above the desert landscape at sunrise.', 1, 180.00, 280.00, '["marrakech-balloon.jpg"]'),
('Agafay Desert Dinner Experience', 4, 4, 'Sunset dinner in the rocky Agafay desert near Marrakech.', 1, 95.00, 145.00, '["marrakech-agafay.jpg"]'),
('Quad Biking in Palmeraie', 4, 3, 'Thrilling quad adventure through the famous palm grove.', 1, 65.00, 95.00, '["marrakech-quad-palm.jpg"]'),
('7-Day Grand Morocco Tour', 4, 2, 'Complete Morocco experience: cities, mountains, and desert.', 7, 899.00, 1299.00, '["marrakech-grand-tour.jpg"]'),
('Essaouira Day Trip from Marrakech', 4, 4, 'Visit the charming coastal town of Essaouira.', 1, 65.00, 95.00, '["marrakech-essaouira.jpg"]');

-- =====================================================
-- SAMPLE DATA - BOOKINGS (20 bookings)
-- =====================================================
INSERT INTO bookings (user_id, tour_id, start_date, end_date, guests, tier, total_price, status, special_requests) VALUES
(3, 2, '2025-01-15', '2025-01-17', 2, 'premium', 898.00, 'completed', 'Anniversary celebration - can we have champagne?'),
(4, 14, '2025-01-20', '2025-01-22', 1, 'standard', 199.00, 'completed', 'Vegetarian meals please'),
(5, 8, '2025-02-01', '2025-02-03', 2, 'premium', 1100.00, 'completed', NULL),
(6, 1, '2025-02-10', '2025-02-10', 4, 'standard', 356.00, 'completed', 'First time on quads'),
(7, 22, '2025-02-15', '2025-02-17', 2, 'premium', 898.00, 'completed', 'Photography equipment'),
(8, 27, '2025-02-20', '2025-02-20', 3, 'standard', 255.00, 'completed', NULL),
(9, 11, '2025-03-01', '2025-03-05', 2, 'premium', 1698.00, 'confirmed', 'Experienced kitesurfer'),
(10, 15, '2025-03-10', '2025-03-12', 2, 'standard', 598.00, 'confirmed', NULL),
(3, 24, '2025-03-15', '2025-03-16', 2, 'premium', 1398.00, 'confirmed', 'Gluten-free diet'),
(4, 30, '2025-03-20', '2025-03-26', 2, 'premium', 2598.00, 'confirmed', 'Would like local guide'),
(5, 3, '2025-04-01', '2025-04-01', 6, 'standard', 390.00, 'pending', 'Children ages 8 and 12'),
(6, 17, '2025-04-05', '2025-04-05', 2, 'premium', 320.00, 'pending', NULL),
(7, 9, '2025-04-10', '2025-04-10', 4, 'standard', 220.00, 'pending', 'Food allergies: nuts'),
(8, 26, '2025-04-15', '2025-04-19', 2, 'premium', 1998.00, 'pending', NULL),
(9, 6, '2025-04-20', '2025-04-20', 2, 'standard', 170.00, 'pending', 'Interest in local crafts'),
(10, 19, '2025-05-01', '2025-05-02', 2, 'premium', 380.00, 'pending', NULL),
(3, 28, '2025-05-10', '2025-05-11', 2, 'standard', 360.00, 'cancelled', 'Had to reschedule trip'),
(4, 12, '2025-05-15', '2025-05-15', 1, 'premium', 180.00, 'cancelled', NULL),
(5, 31, '2025-05-20', '2025-05-21', 2, 'standard', 170.00, 'pending', NULL),
(6, 20, '2025-06-01', '2025-06-02', 2, 'premium', 560.00, 'pending', 'Honeymoon trip');

-- =====================================================
-- SAMPLE DATA - PAYMENTS
-- =====================================================
INSERT INTO payments (booking_id, amount, currency, method, status, transaction_id) VALUES
(1, 898.00, 'USD', 'stripe', 'completed', 'pi_3O1234567890abcdef'),
(2, 199.00, 'USD', 'paypal', 'completed', 'PAY-1234567890'),
(3, 1100.00, 'USD', 'stripe', 'completed', 'pi_3O2345678901bcdefg'),
(4, 356.00, 'USD', 'stripe', 'completed', 'pi_3O3456789012cdefgh'),
(5, 898.00, 'USD', 'paypal', 'completed', 'PAY-2345678901'),
(6, 255.00, 'USD', 'stripe', 'completed', 'pi_3O4567890123defghi'),
(7, 1698.00, 'USD', 'stripe', 'completed', 'pi_3O5678901234efghij'),
(8, 598.00, 'USD', 'stripe', 'completed', 'pi_3O6789012345fghijk'),
(9, 1398.00, 'USD', 'paypal', 'completed', 'PAY-3456789012'),
(10, 2598.00, 'USD', 'stripe', 'completed', 'pi_3O7890123456ghijkl'),
(11, 390.00, 'USD', 'stripe', 'pending', NULL),
(12, 320.00, 'USD', 'paypal', 'pending', NULL),
(13, 220.00, 'USD', 'stripe', 'pending', NULL),
(14, 1998.00, 'USD', 'stripe', 'pending', NULL),
(17, 360.00, 'USD', 'stripe', 'refunded', 'pi_3O8901234567hijklm'),
(18, 180.00, 'USD', 'paypal', 'refunded', 'PAY-4567890123');

-- =====================================================
-- SAMPLE DATA - REVIEWS
-- =====================================================
INSERT INTO reviews (user_id, tour_id, booking_id, rating, title, comment, is_verified) VALUES
(3, 2, 1, 5, 'Unforgettable anniversary experience!', 'The luxury camp was beyond expectations. The staff made our anniversary so special with champagne and decorations. The sunset camel ride was magical!', TRUE),
(4, 14, 2, 5, 'Best sunrise of my life', 'Waking up early was worth every second. The colors of the dunes at sunrise were incredible. Our guide Mohammed was knowledgeable and fun.', TRUE),
(5, 8, 3, 4, 'Great surfing, great vibes', 'Taghazout is a hidden gem. The instructors were patient and the yoga sessions were the perfect complement. Lost one star for basic accommodation.', TRUE),
(6, 1, 4, 5, 'Quad biking adventure!', 'My kids (and me!) had the time of our lives. Safety was top priority but still thrilling. Guide spoke perfect English and was very helpful.', TRUE),
(7, 22, 5, 5, 'Luxury in the desert', 'This is how you do glamping! Every detail was perfect - from the food to the star gazing. Worth every penny for the premium option.', TRUE),
(8, 27, 6, 4, 'Beautiful but hot', 'Ourika Valley is stunning with the waterfalls. Just be prepared for the heat in summer. Bring lots of water!', TRUE),
(3, 27, NULL, 5, 'Amazing day trip', 'We did this on our second visit to Marrakech. The waterfalls are refreshing and the Berber lunch was delicious!', FALSE),
(4, 1, NULL, 4, 'Fun quad experience', 'Great way to spend a morning. The desert landscape was beautiful. Would recommend booking the premium for the longer route.', FALSE),
(5, 22, NULL, 5, 'Desert dreams come true', 'From the camel ride to the traditional dinner, everything was perfect. The camp was incredibly comfortable.', FALSE),
(9, 11, 7, 5, 'Paradise for kitesurfers', 'Dakhla is seriously underrated. Perfect wind conditions, flat water, and the desert backdrop is unreal. Already planning my return!', TRUE);

-- =====================================================
-- USEFUL VIEWS
-- =====================================================

-- View: Tour details with city and category names
CREATE VIEW tour_details AS
SELECT 
    t.id,
    t.name,
    t.description,
    t.duration_days,
    t.price_standard,
    t.price_premium,
    t.max_guests,
    t.images,
    t.is_active,
    c.name AS city_name,
    cat.name AS category_name,
    COALESCE(AVG(r.rating), 0) AS avg_rating,
    COUNT(DISTINCT r.id) AS review_count,
    COUNT(DISTINCT b.id) AS booking_count
FROM tours t
JOIN cities c ON t.city_id = c.id
JOIN categories cat ON t.category_id = cat.id
LEFT JOIN reviews r ON t.id = r.tour_id AND r.is_published = TRUE
LEFT JOIN bookings b ON t.id = b.tour_id AND b.status IN ('confirmed', 'completed')
GROUP BY t.id;

-- View: Booking summary with user and tour info
CREATE VIEW booking_summary AS
SELECT 
    b.id AS booking_id,
    b.start_date,
    b.end_date,
    b.guests,
    b.tier,
    b.total_price,
    b.status AS booking_status,
    u.name AS customer_name,
    u.email AS customer_email,
    t.name AS tour_name,
    c.name AS city_name,
    p.status AS payment_status,
    p.method AS payment_method
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN tours t ON b.tour_id = t.id
JOIN cities c ON t.city_id = c.id
LEFT JOIN payments p ON b.id = p.booking_id;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_tours_price ON tours(price_standard, price_premium);
CREATE INDEX idx_bookings_created ON bookings(created_at);
CREATE INDEX idx_reviews_created ON reviews(created_at);

-- =====================================================
-- END OF SCHEMA
-- =====================================================
