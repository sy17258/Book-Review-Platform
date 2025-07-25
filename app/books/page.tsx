
'use client';

import { useState, useEffect } from 'react';
import { booksAPI, Book } from '@/lib/api';
import BookCard from '@/components/BookCard';
import Pagination from '@/components/Pagination';

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    genre: '',
    author: '',
    sort: 'newest',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  
  const booksPerPage = 6;

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [genresData, authorsData] = await Promise.all([
          booksAPI.getGenres(),
          booksAPI.getAuthors()
        ]);
        setGenres(genresData);
        setAuthors(authorsData);
      } catch (error) {
        // Fallback to empty arrays if API fails
      }
    };

    loadInitialData();
  }, []);

  // Load books based on filters and pagination
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const response = await booksAPI.getBooks({
          page: currentPage,
          limit: booksPerPage,
          genre: filters.genre || undefined,
          author: filters.author || undefined,
          sort: filters.sort,
          search: searchQuery || undefined,
        });
        
        setBooks(response.data);
        setTotalPages(response.totalPages);
        setTotalCount(response.count);
      } catch (error) {
        setBooks([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [currentPage, filters, searchQuery]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      author: '',
      sort: 'newest',
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Books</h1>
        <p className="text-gray-600">
          Discover amazing books and read reviews from our community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Books
            </label>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <div className="relative">
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center pointer-events-none"></i>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <div className="relative">
              <select
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
              >
                <option value="">All Authors</option>
                {authors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
              <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center pointer-events-none"></i>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Title A-Z</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center pointer-events-none"></i>
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm whitespace-nowrap cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {books.length} of {totalCount} books
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : books.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-book-line text-gray-400 w-8 h-8 flex items-center justify-center"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or clearing filters
          </p>
          <button
            onClick={clearFilters}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
