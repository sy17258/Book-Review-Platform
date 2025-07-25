
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { booksAPI, Book } from '@/lib/api';
import BookCard from '@/components/BookCard';
import StarRating from '@/components/StarRating';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedBooks = async () => {
      try {
        const response = await booksAPI.getBooks({ 
          limit: 3, 
          sort: 'rating' 
        });
        setFeaturedBooks(response.data);
      } catch (error) {
        // Fallback to empty array if API fails
        setFeaturedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedBooks();
  }, []);

  return (
    <div className="min-h-screen">
      <section 
        className="relative bg-cover bg-center py-20 px-4 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900"
      >
        <div className="container mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-6">
            Discover Your Next Great Read
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of book lovers sharing reviews, ratings, and recommendations. 
            Find your perfect book match today.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/books">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                Browse Books
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg hover:bg-white hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer">
                Join Community
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Books</h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          ) : featuredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No featured books available at the moment.</p>
              <Link href="/add-book">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                  Add the First Book
                </button>
              </Link>
            </div>
          )}
          <div className="text-center mt-12">
            <Link href="/books">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                View All Books
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-book-open-line text-blue-600 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Books</h3>
              <p className="text-gray-600">
                Browse through thousands of books across various genres and find your next favorite read.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-star-line text-green-600 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rate & Review</h3>
              <p className="text-gray-600">
                Share your thoughts and help others discover great books through honest reviews and ratings.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-group-line text-purple-600 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Join Community</h3>
              <p className="text-gray-600">
                Connect with fellow book lovers and get personalized recommendations based on your taste.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">🎯 Try Demo Accounts</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-8">
              Jump right in and explore the platform with our pre-configured demo accounts!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-200">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">📚 Demo User</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> demo@bookreview.com</p>
                  <p><strong>Password:</strong> demo123</p>
                </div>
                <p className="text-gray-600 mt-3 text-sm">General user with sample reviews</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-200">
                <h3 className="text-xl font-semibold mb-3 text-green-600">📖 Avid Reader</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> reader@bookreview.com</p>
                  <p><strong>Password:</strong> reader123</p>
                </div>
                <p className="text-gray-600 mt-3 text-sm">Active reviewer with detailed feedback</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-2 border-purple-200">
                <h3 className="text-xl font-semibold mb-3 text-purple-600">🐛 Book Worm</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> bookworm@bookreview.com</p>
                  <p><strong>Password:</strong> bookworm123</p>
                </div>
                <p className="text-gray-600 mt-3 text-sm">Enthusiastic contributor and book lover</p>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/login">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer mr-4">
                  Login with Demo Account
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-transparent border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap cursor-pointer">
                  Create Your Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose BookReview?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">10K+</h3>
              <p className="text-gray-600">Books Available</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-4xl font-bold text-green-600 mb-2">50K+</h3>
              <p className="text-gray-600">Reviews Written</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-4xl font-bold text-purple-600 mb-2">5K+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-4xl font-bold text-red-600 mb-2">25+</h3>
              <p className="text-gray-600">Book Genres</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
