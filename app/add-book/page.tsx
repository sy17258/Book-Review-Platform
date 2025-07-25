
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { booksAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AddBook() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const genres = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'Thriller',
    'Horror',
    'Biography',
    'History',
    'Self-Help',
    'Business',
    'Technology',
    'Health',
    'Travel',
    'Classic Literature',
    'Young Adult',
    'Children',
    'Poetry',
    'Drama',
  ];

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.title && formData.author && formData.genre) {
        await booksAPI.createBook({
          title: formData.title,
          author: formData.author,
          genre: formData.genre,
        });
        
        toast.success('Book added successfully!');
        router.push('/books');
      } else {
        toast.error('Please fill in all fields');
      }
    } catch (error) {
      toast.error('Failed to add book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to add a book</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Add New Book</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Share a great book with the community by adding it to our library
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Book Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Enter the book title"
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Enter the author's name"
              />
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                Genre *
              </label>
              <div className="relative">
                <select
                  id="genre"
                  name="genre"
                  required
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8 text-sm sm:text-base appearance-none"
                >
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center pointer-events-none"></i>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto order-2 sm:order-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto order-1 sm:order-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer text-sm sm:text-base"
              >
                {isLoading ? 'Adding Book...' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2 flex items-center">
            <i className="ri-information-line mr-2 w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center flex-shrink-0"></i>
            Guidelines for Adding Books
          </h3>
          <ul className="text-blue-800 space-y-1 text-xs sm:text-sm">
            <li>• Make sure the book doesn't already exist in our library</li>
            <li>• Use the full, official title of the book</li>
            <li>• Include the author's full name as published</li>
            <li>• Select the most appropriate genre category</li>
            <li>• Double-check all information before submitting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
