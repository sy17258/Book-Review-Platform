
'use client';

import Link from 'next/link';
import { Book } from '@/lib/api';
import StarRating from './StarRating';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 mb-1">by {book.author}</p>
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
            {book.genre}
          </span>
        </div>
        <div className="ml-4 flex-shrink-0">
          <div className="w-20 h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md shadow-sm flex items-center justify-center">
            <i className="ri-book-line text-blue-600 text-2xl"></i>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <StarRating rating={book.average_rating} size="sm" />
          <span className="text-sm text-gray-600">
            {book.average_rating.toFixed(1)} ({book.review_count} reviews)
          </span>
        </div>
      </div>
      
      <Link href={`/books/${book.id}`}>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap cursor-pointer">
          View Details
        </button>
      </Link>
    </div>
  );
}
