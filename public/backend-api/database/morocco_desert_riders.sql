-- ==============================================
-- Morocco Desert Riders - Complete Database Dump
-- ==============================================
-- Generated for cPanel MySQL Import
-- Compatible with MySQL 5.7+ / MariaDB 10.3+
-- ==============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';

-- ==============================================
-- Database Creation (optional - create via cPanel)
-- ==============================================
-- CREATE DATABASE IF NOT EXISTS `morocco_desert_riders` 
--   CHARACTER SET utf8mb4 
--   COLLATE utf8mb4_unicode_ci;
-- USE `morocco_desert_riders`;

-- ==============================================
-- Table: users
-- ==============================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `role` ENUM('admin', 'client') NOT NULL DEFAULT 'client',
  `avatar` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `last_login_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_index` (`role`),
  KEY `users_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================
-- Table: cities
-- ==============================================
DROP TABLE IF EXISTS `cities`;
CREATE TABLE `cities` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(11, 8) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cities_slug_unique` (`slug`),
  KEY `cities_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================
-- Table: categories
-- ==============================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================
-- Table: tours
-- ==============================================
DROP TABLE IF EXISTS `tours`;
CREATE TABLE `tours` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `short_description` VARCHAR(500) DEFAULT NULL,
  `duration_days` INT UNSIGNED NOT NULL DEFAULT 1,
  `duration_nights` INT UNSIGNED NOT NULL DEFAULT 0,
  `price` DECIMAL(10, 2) NOT NULL,
  `discount_price` DECIMAL(10, 2) DEFAULT NULL,
  `max_guests` INT UNSIGNED NOT NULL DEFAULT 10,
  `min_guests` INT UNSIGNED NOT NULL DEFAULT 1,
  `city_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `images` JSON DEFAULT NULL,
  `itinerary` JSON DEFAULT NULL,
  `included` JSON DEFAULT NULL,
  `excluded` JSON DEFAULT NULL,
  `highlights` JSON DEFAULT NULL,
  `meeting_point` VARCHAR(255) DEFAULT NULL,
  `start_time` TIME DEFAULT NULL,
  `end_time` TIME DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(11, 8) DEFAULT NULL,
  `difficulty_level` ENUM('easy', 'moderate', 'challenging', 'extreme') DEFAULT 'moderate',
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `total_bookings` INT UNSIGNED NOT NULL DEFAULT 0,
  `average_rating` DECIMAL(3, 2) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tours_slug_unique` (`slug`),
  KEY `tours_city_id_index` (`city_id`),
  KEY `tours_category_id_index` (`category_id`),
  KEY `tours_is_active_index` (`is_active`),
  KEY `tours_is_featured_index` (`is_featured`),
  KEY `tours_price_index` (`price`),
  CONSTRAINT `tours_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tours_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================
-- Table: bookings
-- ==============================================
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_reference` VARCHAR(20) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `tour_id` INT UNSIGNED NOT NULL,
  `booking_date` DATE NOT NULL,
  `guests_count` INT UNSIGNED NOT NULL DEFAULT 1,
  `total_price` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
  `special_requests` TEXT DEFAULT NULL,
  `guest_details` JSON DEFAULT NULL,
  `cancelled_at` TIMESTAMP NULL DEFAULT NULL,
  `cancelled_reason` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bookings_reference_unique` (`booking_reference`),
  KEY `bookings_user_id_index` (`user_id`),
  KEY `bookings_tour_id_index` (`tour_id`),
  KEY `bookings_status_index` (`status`),
  KEY `bookings_booking_date_index` (`booking_date`),
  CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_tour_id_foreign` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================
-- Table: payments
-- ==============================================
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'MAD',
  `payment_method` ENUM('credit_card', 'paypal', 'bank_transfer', 'cash') NOT NULL,
  `payment_status` ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `transaction_id` VARCHAR(100) DEFAULT NULL,
  `payment_gateway` VARCHAR(50) DEFAULT NULL,
  `gateway_response` JSON DEFAULT NULL,
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `payments_booking_id_index` (`booking_id`),
  KEY `payments_status_index` (`payment_status`),
  CONSTRAINT `payments_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================
-- Table: reviews
-- ==============================================
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `tour_id` INT UNSIGNED NOT NULL,
  `booking_id` INT UNSIGNED DEFAULT NULL,
  `rating` TINYINT UNSIGNED NOT NULL,
  `title` VARCHAR(200) DEFAULT NULL,
  `comment` TEXT DEFAULT NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `is_approved` TINYINT(1) NOT NULL DEFAULT 1,
  `admin_response` TEXT DEFAULT NULL,
  `responded_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reviews_user_id_index` (`user_id`),
  KEY `reviews_tour_id_index` (`tour_id`),
  KEY `reviews_booking_id_index` (`booking_id`),
  KEY `reviews_rating_index` (`rating`),
  CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_tour_id_foreign` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `reviews_rating_check` CHECK (`rating` >= 1 AND `rating` <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================
-- Sample Data: Cities
-- ==============================================
INSERT INTO `cities` (`id`, `name`, `slug`, `description`, `image`, `latitude`, `longitude`, `is_active`) VALUES
(1, 'Marrakech', 'marrakech', 'The Red City - Gateway to the Sahara Desert with vibrant souks, stunning palaces, and rich history.', '/images/cities/marrakech.jpg', 31.62970000, -7.98150000, 1),
(2, 'Merzouga', 'merzouga', 'Home to the magnificent Erg Chebbi dunes - the tallest sand dunes in Morocco reaching up to 150 meters.', '/images/cities/merzouga.jpg', 31.08020000, -4.01330000, 1),
(3, 'Fes', 'fes', 'The cultural and spiritual heart of Morocco with the world\'s oldest university and incredible medieval medina.', '/images/cities/fes.jpg', 34.03330000, -5.00000000, 1),
(4, 'Ouarzazate', 'ouarzazate', 'The Gateway to the Desert - Hollywood of Africa with stunning kasbahs and film studios.', '/images/cities/ouarzazate.jpg', 30.91890000, -6.89360000, 1),
(5, 'Zagora', 'zagora', 'Starting point for Sahara camel treks - famous for the sign saying "Timbuktu 52 days".', '/images/cities/zagora.jpg', 30.33200000, -5.83800000, 1),
(6, 'Essaouira', 'essaouira', 'The Windy City of Morocco - perfect blend of beach, medina, and adventure activities.', '/images/cities/essaouira.jpg', 31.50850000, -9.75990000, 1);

-- ==============================================
-- Sample Data: Categories
-- ==============================================
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`, `is_active`) VALUES
(1, 'Desert Tours', 'desert-tours', 'Experience the magic of the Sahara Desert with camel treks and overnight camps.', 'sun', 1),
(2, 'Quad & ATV Adventures', 'quad-atv', 'Thrilling quad biking experiences across dunes and desert landscapes.', 'zap', 1),
(3, 'Cultural Experiences', 'cultural', 'Immerse yourself in Moroccan traditions, cuisine, and heritage.', 'heart', 1),
(4, 'Luxury Camps', 'luxury-camps', 'Premium desert camping with all amenities under the stars.', 'star', 1),
(5, 'Day Trips', 'day-trips', 'Perfect excursions for those with limited time.', 'clock', 1),
(6, 'Multi-Day Tours', 'multi-day', 'Comprehensive tours covering multiple destinations.', 'map', 1);

-- ==============================================
-- Sample Data: Users (passwords are hashed)
-- ==============================================
-- Admin password: Admin123!
-- User password: User123!
INSERT INTO `users` (`id`, `email`, `password`, `name`, `phone`, `role`, `is_active`, `email_verified_at`) VALUES
(1, 'admin@moroccodesert.com', '$2b$10$rKgEzR5UQxGw8VR0pFxP1.5w3KqJ8YMz4YX6B9pP0OyY7rV2LmQsO', 'Admin User', '+212 600-000000', 'admin', 1, NOW()),
(2, 'sarah@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye3q5qWd9Xe8q7Z5j8P9rN1qQ4xV2sWtC', 'Sarah Johnson', '+1 555-0101', 'client', 1, NOW()),
(3, 'jean@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye3q5qWd9Xe8q7Z5j8P9rN1qQ4xV2sWtC', 'Jean Dupont', '+33 6 00 00 00 00', 'client', 1, NOW()),
(4, 'maria@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye3q5qWd9Xe8q7Z5j8P9rN1qQ4xV2sWtC', 'Maria Garcia', '+34 600 000 000', 'client', 1, NOW()),
(5, 'ahmed@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye3q5qWd9Xe8q7Z5j8P9rN1qQ4xV2sWtC', 'Ahmed Hassan', '+212 661-000000', 'client', 1, NOW());

-- ==============================================
-- Sample Data: Tours
-- ==============================================
INSERT INTO `tours` (`id`, `title`, `slug`, `description`, `short_description`, `duration_days`, `duration_nights`, `price`, `discount_price`, `max_guests`, `min_guests`, `city_id`, `category_id`, `images`, `itinerary`, `included`, `excluded`, `highlights`, `meeting_point`, `start_time`, `latitude`, `longitude`, `difficulty_level`, `is_featured`, `is_active`, `average_rating`) VALUES
(1, 'Sahara Desert Camel Trek & Luxury Camp', 'sahara-camel-trek-luxury', 
'Experience the magic of the Sahara Desert on this unforgettable camel trek to the stunning Erg Chebbi dunes. Watch the sunset paint the dunes in shades of gold and orange, then spend the night in a luxury desert camp under millions of stars. Wake up to a breathtaking sunrise before returning to civilization with memories that will last a lifetime.',
'A magical overnight adventure in the Sahara with camel trek and luxury camping.',
2, 1, 299.00, 249.00, 8, 2, 2, 1,
'["/images/tours/camel-trek-1.jpg", "/images/tours/camel-trek-2.jpg", "/images/tours/camp-1.jpg", "/images/tours/sunrise-1.jpg"]',
'[{"day": 1, "title": "Merzouga to Desert Camp", "description": "Meet at 3 PM in Merzouga. Begin your camel trek into the dunes as the sun starts to set. Arrive at the luxury camp for traditional dinner, music, and stargazing."}, {"day": 2, "title": "Sunrise & Return", "description": "Optional early wake-up for sunrise over the dunes. Enjoy breakfast at camp before the camel ride back to Merzouga by 10 AM."}]',
'["Camel trek (1.5 hours each way)", "Luxury tent accommodation", "Traditional Moroccan dinner", "Breakfast", "Berber music entertainment", "Sandboarding equipment", "English-speaking guide"]',
'["Transportation to/from Merzouga", "Travel insurance", "Personal expenses", "Tips for guides"]',
'["Watch sunset from the dunes", "Sleep under millions of stars", "Authentic Berber music experience", "Sunrise over Erg Chebbi"]',
'Hotel Kasbah Mohayut, Merzouga', '15:00:00', 31.0802, -4.0133, 'easy', 1, 1, 4.85),

(2, 'Quad Biking Desert Adventure', 'quad-biking-desert',
'Feel the adrenaline rush as you race across the Sahara Desert on a powerful quad bike. This thrilling 2-hour adventure takes you through golden dunes, rocky terrain, and traditional Berber villages. Perfect for adventure seekers looking for an unforgettable desert experience.',
'Thrilling 2-hour quad biking across Sahara dunes and desert terrain.',
1, 0, 85.00, NULL, 10, 1, 2, 2,
'["/images/tours/quad-1.jpg", "/images/tours/quad-2.jpg", "/images/tours/quad-3.jpg"]',
'[{"day": 1, "title": "Quad Adventure", "description": "Meet at the quad base, receive safety briefing and equipment. 2-hour guided ride through dunes, oasis, and Berber villages. Return to base with traditional mint tea."}]',
'["Quad bike rental", "Helmet and goggles", "Professional guide", "Safety briefing", "Mint tea after ride", "Photos during the ride"]',
'["Transportation to meeting point", "Travel insurance", "Personal expenses"]',
'["Race across golden Sahara dunes", "Visit traditional Berber village", "Professional photo opportunities", "Mint tea in desert oasis"]',
'Merzouga Quad Base', '09:00:00', 31.0750, -4.0100, 'moderate', 1, 1, 4.70),

(3, 'Marrakech to Merzouga 3-Day Desert Tour', 'marrakech-merzouga-3-day',
'The ultimate Moroccan desert adventure! This 3-day journey takes you from the bustling streets of Marrakech, through the stunning Atlas Mountains, the dramatic Todra Gorge, and finally to the majestic Erg Chebbi dunes of Merzouga. Experience diverse landscapes, fascinating kasbahs, and authentic Moroccan hospitality.',
'Epic 3-day journey from Marrakech to Sahara with Atlas Mountains and gorges.',
3, 2, 349.00, 299.00, 15, 4, 1, 6,
'["/images/tours/3day-1.jpg", "/images/tours/atlas-1.jpg", "/images/tours/gorge-1.jpg", "/images/tours/camp-2.jpg"]',
'[{"day": 1, "title": "Marrakech to Dades Valley", "description": "Depart 8 AM. Cross High Atlas via Tizi n\'Tichka pass (2260m). Visit Ait Benhaddou Kasbah (UNESCO). Lunch in Ouarzazate. Continue to Dades Gorge. Overnight in traditional riad."}, {"day": 2, "title": "Dades to Merzouga", "description": "Morning in Dades Valley. Drive through Todra Gorge with 300m canyon walls. Continue to Erfoud and Merzouga. Afternoon camel trek to desert camp. Dinner and stargazing."}, {"day": 3, "title": "Merzouga to Marrakech", "description": "Sunrise over dunes. Camel ride back. Breakfast and return journey via different route. Arrive Marrakech evening."}]',
'["Private air-conditioned 4x4", "2 nights accommodation", "All breakfasts", "1 dinner at camp", "Camel trek", "English-speaking driver/guide", "Hotel pickup/drop-off"]',
'["Lunches", "Drinks", "Entry fees", "Travel insurance", "Tips"]',
'["Cross High Atlas Mountains", "UNESCO Ait Benhaddou Kasbah", "Todra Gorge canyon", "Camel trek and desert camp", "Sunrise and sunset in Sahara"]',
'Your hotel in Marrakech', '08:00:00', 31.6297, -7.9815, 'easy', 1, 1, 4.92),

(4, 'Fes to Marrakech 4-Day Desert Adventure', 'fes-marrakech-4-day',
'Journey through Morocco\'s most spectacular landscapes on this comprehensive 4-day tour from Fes to Marrakech via the Sahara Desert. Explore ancient cedar forests, dramatic gorges, UNESCO sites, and spend an unforgettable night camping in the Erg Chebbi dunes.',
'Complete 4-day Morocco experience from Fes to Marrakech via Sahara.',
4, 3, 449.00, 399.00, 12, 4, 3, 6,
'["/images/tours/4day-1.jpg", "/images/tours/fes-1.jpg", "/images/tours/cedar-1.jpg", "/images/tours/sahara-1.jpg"]',
'[{"day": 1, "title": "Fes to Merzouga", "description": "Depart Fes through Middle Atlas. Visit Ifrane (Swiss of Morocco) and Azrou cedar forest with Barbary apes. Cross Ziz Valley to Merzouga. Overnight in hotel."}, {"day": 2, "title": "Merzouga Desert Day", "description": "Morning 4x4 desert tour visiting nomads and fossils. Afternoon camel trek into Erg Chebbi. Night in luxury desert camp with dinner and music."}, {"day": 3, "title": "Merzouga to Dades", "description": "Sunrise camel ride. Drive via Todra Gorge with optional walk. Continue to Dades Valley. Overnight in kasbah hotel."}, {"day": 4, "title": "Dades to Marrakech", "description": "Visit Roses Valley and Skoura oasis. Stop at Ait Benhaddou. Cross Atlas Mountains. Arrive Marrakech evening."}]',
'["Private 4x4 transport", "3 nights accommodation", "All breakfasts", "1 camp dinner", "Camel trek", "Driver/guide", "Desert camp", "Hotel pickups"]',
'["Lunches", "Drinks", "Entry fees", "Insurance", "Tips"]',
'["Ifrane and cedar forest", "Barbary apes", "Erg Chebbi dunes", "Todra Gorge", "Ait Benhaddou", "Atlas Mountains"]',
'Your hotel in Fes', '08:00:00', 34.0333, -5.0000, 'easy', 1, 1, 4.88),

(5, 'Sunset Camel Ride Experience', 'sunset-camel-ride',
'Perfect for those short on time! This 2-hour sunset camel ride takes you into the golden dunes of Erg Chebbi as the sun paints the desert in magical colors. Includes traditional mint tea and snacks at a Berber camp before returning under the stars.',
'Magical 2-hour sunset camel trek with tea at desert camp.',
1, 0, 45.00, NULL, 12, 1, 2, 5,
'["/images/tours/sunset-1.jpg", "/images/tours/sunset-2.jpg", "/images/tours/tea-1.jpg"]',
'[{"day": 1, "title": "Sunset Ride", "description": "Meet at 5 PM (summer) or 4 PM (winter). Camel ride into dunes (45 min). Watch sunset. Mint tea and snacks at small camp. Return by camel under stars (45 min)."}]',
'["Camel ride", "Experienced guide", "Mint tea and snacks", "Sunset photo opportunities"]',
'["Transportation to Merzouga", "Meals", "Tips"]',
'["Golden hour photography", "Tea in the dunes", "Stargazing on return", "Traditional camel experience"]',
'Merzouga Village Center', '17:00:00', 31.0802, -4.0133, 'easy', 0, 1, 4.75),

(6, 'Ouarzazate Film Studios & Kasbahs Day Trip', 'ouarzazate-film-studios',
'Discover why Ouarzazate is called the Hollywood of Africa! Visit the famous Atlas Film Studios where Gladiator, Game of Thrones, and many more were filmed. Explore the stunning Taourirt Kasbah and enjoy lunch overlooking the desert landscape.',
'Explore Morocco\'s Hollywood with film studios and ancient kasbahs.',
1, 0, 75.00, NULL, 20, 2, 4, 3,
'["/images/tours/studio-1.jpg", "/images/tours/kasbah-1.jpg", "/images/tours/ouarzazate-1.jpg"]',
'[{"day": 1, "title": "Film & Culture Day", "description": "9 AM pickup. Visit Atlas Film Studios (2 hours). Explore Taourirt Kasbah. Lunch at panoramic restaurant. Optional visit to Fint Oasis. Return 5 PM."}]',
'["Transportation", "English guide", "Studio entrance", "Kasbah entrance", "Lunch"]',
'["Drinks", "Tips", "Personal expenses"]',
'["Walk through movie sets", "Explore 17th century kasbah", "Panoramic desert views", "Learn about Moroccan cinema"]',
'Hotel in Ouarzazate', '09:00:00', 30.9189, -6.8936, 'easy', 0, 1, 4.60),

(7, 'Luxury Sahara Glamping Experience', 'luxury-sahara-glamping',
'The ultimate desert luxury! Spend two nights in our exclusive glamping camp featuring king-size beds, private bathrooms, gourmet dining, and personalized service. Includes private camel treks, 4x4 adventures, and spa treatments under the stars.',
'Two nights of ultimate luxury in the heart of the Sahara Desert.',
3, 2, 599.00, 549.00, 6, 2, 2, 4,
'["/images/tours/glamping-1.jpg", "/images/tours/glamping-2.jpg", "/images/tours/spa-1.jpg", "/images/tours/gourmet-1.jpg"]',
'[{"day": 1, "title": "Arrival & Sunset", "description": "Private transfer from Merzouga. Welcome drinks. Settle into luxury tent. Evening camel ride for sunset. Gourmet dinner under stars."}, {"day": 2, "title": "Desert Discovery", "description": "Sunrise yoga (optional). Gourmet breakfast. 4x4 tour of dunes and nomad visits. Lunch at camp. Afternoon spa or sandboarding. Private stargazing dinner."}, {"day": 3, "title": "Departure", "description": "Sunrise meditation. Champagne breakfast. Late checkout available. Private transfer back."}]',
'["Private transfers", "Luxury tent (king bed, bathroom)", "All gourmet meals", "Private camel rides", "4x4 desert tour", "Spa treatment", "Premium drinks", "Private guide"]',
'["Travel insurance", "Personal items", "Additional spa treatments"]',
'["King-size bed in desert", "Gourmet dining experience", "Private spa treatment", "Exclusive stargazing", "Champagne breakfast"]',
'Any hotel in Merzouga region', '14:00:00', 31.0802, -4.0133, 'easy', 1, 1, 4.98),

(8, 'Zagora 2-Day Desert Expedition', 'zagora-2-day-desert',
'Explore the dramatic Draa Valley and its endless palm groves before continuing to Zagora for an authentic desert experience. Less touristy than Merzouga, Zagora offers a more intimate connection with the Sahara and traditional Berber culture.',
'Authentic 2-day desert journey through Draa Valley to Zagora.',
2, 1, 199.00, 179.00, 10, 2, 5, 1,
'["/images/tours/zagora-1.jpg", "/images/tours/draa-1.jpg", "/images/tours/berber-1.jpg"]',
'[{"day": 1, "title": "To the Desert", "description": "Depart Ouarzazate 9 AM. Drive through stunning Draa Valley with million palm trees. Lunch in Agdz. Continue to Zagora. Camel ride to camp. Traditional dinner."}, {"day": 2, "title": "Return Journey", "description": "Sunrise over desert. Breakfast at camp. Camel ride back. Visit Zagora town. Return via Draa Valley arriving evening."}]',
'["4x4 transportation", "1 night camping", "Camel ride", "All meals at camp", "Guide"]',
'["Drinks", "Lunch day 1", "Tips", "Insurance"]',
'["Draa Valley palmeraie", "Authentic Berber camp", "Less crowded than Merzouga", "Traditional music night"]',
'Ouarzazate city center', '09:00:00', 30.3320, -5.8380, 'easy', 0, 1, 4.65);

-- ==============================================
-- Sample Data: Bookings
-- ==============================================
INSERT INTO `bookings` (`id`, `booking_reference`, `user_id`, `tour_id`, `booking_date`, `guests_count`, `total_price`, `status`, `special_requests`, `created_at`) VALUES
(1, 'MDR-2024-00001', 2, 1, '2024-02-15', 2, 498.00, 'completed', 'Vegetarian meals please', '2024-01-20 10:30:00'),
(2, 'MDR-2024-00002', 3, 3, '2024-02-20', 4, 1196.00, 'completed', 'Need car seats for children', '2024-01-25 14:15:00'),
(3, 'MDR-2024-00003', 4, 2, '2024-03-01', 3, 255.00, 'completed', NULL, '2024-02-15 09:00:00'),
(4, 'MDR-2024-00004', 5, 7, '2024-03-10', 2, 1098.00, 'completed', 'Anniversary celebration - champagne', '2024-02-20 16:45:00'),
(5, 'MDR-2024-00005', 2, 4, '2024-03-15', 2, 798.00, 'confirmed', 'Early morning pickup preferred', '2024-03-01 11:20:00'),
(6, 'MDR-2024-00006', 3, 5, '2024-03-20', 6, 270.00, 'confirmed', NULL, '2024-03-05 08:30:00'),
(7, 'MDR-2024-00007', 4, 1, '2024-04-01', 2, 498.00, 'pending', 'Allergy to nuts', '2024-03-15 13:00:00'),
(8, 'MDR-2024-00008', 5, 8, '2024-04-10', 4, 716.00, 'pending', NULL, '2024-03-20 10:00:00');

-- ==============================================
-- Sample Data: Payments
-- ==============================================
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `currency`, `payment_method`, `payment_status`, `transaction_id`, `payment_gateway`, `paid_at`, `created_at`) VALUES
(1, 1, 498.00, 'EUR', 'credit_card', 'completed', 'TXN_STRIPE_001', 'stripe', '2024-01-20 10:35:00', '2024-01-20 10:30:00'),
(2, 2, 1196.00, 'EUR', 'paypal', 'completed', 'TXN_PAYPAL_002', 'paypal', '2024-01-25 14:20:00', '2024-01-25 14:15:00'),
(3, 3, 255.00, 'EUR', 'credit_card', 'completed', 'TXN_STRIPE_003', 'stripe', '2024-02-15 09:05:00', '2024-02-15 09:00:00'),
(4, 4, 1098.00, 'EUR', 'credit_card', 'completed', 'TXN_STRIPE_004', 'stripe', '2024-02-20 16:50:00', '2024-02-20 16:45:00'),
(5, 5, 798.00, 'EUR', 'paypal', 'completed', 'TXN_PAYPAL_005', 'paypal', '2024-03-01 11:25:00', '2024-03-01 11:20:00'),
(6, 6, 270.00, 'EUR', 'bank_transfer', 'completed', 'TXN_BANK_006', 'bank', '2024-03-06 09:00:00', '2024-03-05 08:30:00');

-- ==============================================
-- Sample Data: Reviews
-- ==============================================
INSERT INTO `reviews` (`id`, `user_id`, `tour_id`, `booking_id`, `rating`, `title`, `comment`, `is_verified`, `is_approved`, `created_at`) VALUES
(1, 2, 1, 1, 5, 'Absolutely Magical Experience!', 'The sunset over the dunes was breathtaking. Our guide Hassan was incredible - so knowledgeable about Berber culture. The luxury camp exceeded expectations. The stargazing was unforgettable. Highly recommend!', 1, 1, '2024-02-17 18:00:00'),
(2, 3, 3, 2, 5, 'Trip of a Lifetime', 'Three perfect days exploring Morocco. The Atlas Mountains views were stunning, Ait Benhaddou was incredible, and the desert camp was magical. Our driver Mohammed was wonderful with our kids. Worth every penny!', 1, 1, '2024-02-23 10:30:00'),
(3, 4, 2, 3, 4, 'Great Fun but Very Sandy!', 'Quad biking was exhilarating! Really well organized with good safety briefing. Bring goggles and cover your face - lots of sand! The mint tea after was a nice touch. Only 4 stars because I wished it was longer.', 1, 1, '2024-03-02 15:45:00'),
(4, 5, 7, 4, 5, 'Pure Luxury in the Desert', 'For our anniversary, this was perfection. The glamping tent was gorgeous with a real bathroom! Gourmet meals under the stars, private camel rides, the spa treatment in the desert... Unforgettable. Worth the splurge!', 1, 1, '2024-03-12 20:00:00'),
(5, 2, 5, NULL, 5, 'Perfect Short Trip', 'Only had a few hours but this sunset ride was amazing. Simple but beautiful. Tea in the dunes as the sun set was peaceful. Great for those short on time!', 0, 1, '2024-03-18 19:30:00');

-- ==============================================
-- Update tour statistics
-- ==============================================
UPDATE `tours` SET `total_bookings` = 3, `average_rating` = 5.00 WHERE `id` = 1;
UPDATE `tours` SET `total_bookings` = 1, `average_rating` = 4.00 WHERE `id` = 2;
UPDATE `tours` SET `total_bookings` = 1, `average_rating` = 5.00 WHERE `id` = 3;
UPDATE `tours` SET `total_bookings` = 1 WHERE `id` = 4;
UPDATE `tours` SET `total_bookings` = 2, `average_rating` = 5.00 WHERE `id` = 5;
UPDATE `tours` SET `total_bookings` = 1, `average_rating` = 5.00 WHERE `id` = 7;
UPDATE `tours` SET `total_bookings` = 1 WHERE `id` = 8;

-- ==============================================
-- Reset auto increment counters
-- ==============================================
ALTER TABLE `users` AUTO_INCREMENT = 100;
ALTER TABLE `cities` AUTO_INCREMENT = 100;
ALTER TABLE `categories` AUTO_INCREMENT = 100;
ALTER TABLE `tours` AUTO_INCREMENT = 100;
ALTER TABLE `bookings` AUTO_INCREMENT = 100;
ALTER TABLE `payments` AUTO_INCREMENT = 100;
ALTER TABLE `reviews` AUTO_INCREMENT = 100;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================
-- End of Morocco Desert Riders Database Dump
-- ==============================================
