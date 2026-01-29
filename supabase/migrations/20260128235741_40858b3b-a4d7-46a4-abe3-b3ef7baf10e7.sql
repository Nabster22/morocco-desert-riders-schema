-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'client');

-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create enum for booking tier
CREATE TYPE public.booking_tier AS ENUM ('standard', 'premium');

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'client',
    UNIQUE (user_id, role)
);

-- Create cities table
CREATE TABLE public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create tours table
CREATE TABLE public.tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    duration_days INTEGER NOT NULL DEFAULT 1,
    price_standard DECIMAL(10,2) NOT NULL,
    price_premium DECIMAL(10,2) NOT NULL,
    max_guests INTEGER NOT NULL DEFAULT 10,
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    avg_rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    tier booking_tier NOT NULL DEFAULT 'standard',
    total_price DECIMAL(10,2) NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (user_id, name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email
    );
    
    -- Assign default client role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'client');
    
    RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tours_updated_at
    BEFORE UPDATE ON public.tours
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
    ON public.user_roles FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for cities (public read)
CREATE POLICY "Anyone can view cities"
    ON public.cities FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage cities"
    ON public.cities FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories"
    ON public.categories FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for tours (public read for active tours)
CREATE POLICY "Anyone can view active tours"
    ON public.tours FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "Admins can manage all tours"
    ON public.tours FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
    ON public.bookings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
    ON public.bookings FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all bookings"
    ON public.bookings FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews"
    ON public.reviews FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Users can create reviews"
    ON public.reviews FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.reviews FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews"
    ON public.reviews FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Insert seed data for cities
INSERT INTO public.cities (name, description, image_url) VALUES
('Marrakech', 'The Red City - Gateway to the Sahara', '/placeholder.svg'),
('Merzouga', 'Home of the famous Erg Chebbi dunes', '/placeholder.svg'),
('Ouarzazate', 'Hollywood of Morocco - Gateway to the desert', '/placeholder.svg'),
('Fes', 'The cultural capital with ancient medina', '/placeholder.svg'),
('Agadir', 'Beach resort city on the Atlantic coast', '/placeholder.svg');

-- Insert seed data for categories
INSERT INTO public.categories (name, description, icon) VALUES
('Desert Safari', 'Experience the Sahara desert adventures', 'compass'),
('Camel Trekking', 'Traditional desert travel by camel', 'tent'),
('Quad Biking', 'Thrilling ATV adventures in the dunes', 'bike'),
('Camping', 'Overnight stays under the stars', 'moon'),
('Cultural Tours', 'Explore Berber culture and traditions', 'users');

-- Insert seed data for tours
INSERT INTO public.tours (name, city_id, category_id, description, duration_days, price_standard, price_premium, max_guests, images, is_active, avg_rating, review_count)
SELECT 
    '3-Day Sahara Desert Tour from Marrakech',
    c.id,
    cat.id,
    'Experience the magic of the Sahara with camel trekking, desert camping, and stunning sunsets over the Erg Chebbi dunes.',
    3,
    299.00,
    499.00,
    12,
    ARRAY['/placeholder.svg'],
    true,
    4.8,
    124
FROM public.cities c, public.categories cat
WHERE c.name = 'Marrakech' AND cat.name = 'Desert Safari'
LIMIT 1;

INSERT INTO public.tours (name, city_id, category_id, description, duration_days, price_standard, price_premium, max_guests, images, is_active, avg_rating, review_count)
SELECT 
    'Merzouga Camel Trek & Camp Experience',
    c.id,
    cat.id,
    'Ride camels through golden dunes to a traditional Berber camp. Enjoy authentic cuisine, music, and sleep under millions of stars.',
    2,
    199.00,
    349.00,
    8,
    ARRAY['/placeholder.svg'],
    true,
    4.9,
    89
FROM public.cities c, public.categories cat
WHERE c.name = 'Merzouga' AND cat.name = 'Camel Trekking'
LIMIT 1;

INSERT INTO public.tours (name, city_id, category_id, description, duration_days, price_standard, price_premium, max_guests, images, is_active, avg_rating, review_count)
SELECT 
    'Quad Adventure in Agadir',
    c.id,
    cat.id,
    'Thrilling quad biking adventure through diverse terrains including beaches, forests, and desert landscapes.',
    1,
    89.00,
    149.00,
    6,
    ARRAY['/placeholder.svg'],
    true,
    4.7,
    56
FROM public.cities c, public.categories cat
WHERE c.name = 'Agadir' AND cat.name = 'Quad Biking'
LIMIT 1;