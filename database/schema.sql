-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_book_id ON reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);

-- Create view for books with review statistics
CREATE OR REPLACE VIEW books_with_stats AS
SELECT 
    b.*,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.id) as review_count
FROM books b
LEFT JOIN reviews r ON b.id = r.book_id
GROUP BY b.id, b.title, b.author, b.genre, b.created_at, b.updated_at;

-- Insert sample data

-- Insert demo users (these will be created through Supabase Auth)
-- Demo user credentials for testing:
-- Email: demo@bookreview.com, Password: demo123
-- Email: reader@bookreview.com, Password: reader123  
-- Email: bookworm@bookreview.com, Password: bookworm123

INSERT INTO books (title, author, genre) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic Literature'),
('To Kill a Mockingbird', 'Harper Lee', 'Classic Literature'),
('The Catcher in the Rye', 'J.D. Salinger', 'Classic Literature'),
('Dune', 'Frank Herbert', 'Science Fiction'),
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy'),
('Pride and Prejudice', 'Jane Austen', 'Romance')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Create policies for books table (public read, authenticated write)
CREATE POLICY "Anyone can view books" ON books
    FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Authenticated users can create books" ON books
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update books" ON books
    FOR UPDATE TO authenticated USING (true);

-- Create policies for reviews table
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Authenticated users can create reviews" ON reviews
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE TO authenticated USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE TO authenticated USING (auth.uid()::text = user_id::text);
