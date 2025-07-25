
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { booksAPI, reviewsAPI, Book, Review } from '@/lib/api';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';
import StarRating from '@/components/StarRating';
import toast from 'react-hot-toast';

interface BookDetailProps {
  bookId: string;
}

export default function BookDetail({ bookId }: BookDetailProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 0,
    review_text: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const router = useRouter();

  const currentUser = getCurrentUser();
  const isAuth = isAuthenticated();

  // Load book and reviews
  useEffect(() => {
    const loadBookData = async () => {
      try {
        setLoading(true);
        const bookData = await booksAPI.getBook(bookId);
        setBook(bookData);
        setReviews(bookData.reviews || []);
      } catch (error) {
        setBook(null);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      loadBookData();
    }
  }, [bookId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Book not found</h1>
          <button
            onClick={() => router.push('/books')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuth) {
      toast.error('Please login to submit a review');
      router.push('/login');
      return;
    }

    if (!currentUser) {
      toast.error('User information not found');
      return;
    }

    if (newReview.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (newReview.review_text.trim().length < 10) {
      toast.error('Review must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReviewData = await reviewsAPI.addReview(bookId, {
        rating: newReview.rating,
        review_text: newReview.review_text,
        user_id: currentUser.id,
      });

      // Add the new review to the list
      setReviews(prev => [newReviewData, ...prev]);
      
      // Update book's review count and average rating
      if (book) {
        const updatedReviews = [newReviewData, ...reviews];
        const averageRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviews.length;
        
        setBook(prev => prev ? {
          ...prev,
          average_rating: averageRating,
          review_count: updatedReviews.length,
        } : null);
      }

      setNewReview({ rating: 0, review_text: '' });
      setShowReviewForm(false);
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Book Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="w-full max-w-sm mx-auto h-80 bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <i className="ri-book-line text-blue-600 text-6xl mb-4 block"></i>
                  <p className="text-blue-800 font-medium text-sm">{book.title}</p>
                  <p className="text-blue-600 text-xs mt-1">by {book.author}</p>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <StarRating rating={book.average_rating} size="lg" />
                <span className="text-lg font-semibold text-gray-900">
                  {book.average_rating.toFixed(1)}
                </span>
                <span className="text-gray-600">
                  ({book.review_count} reviews)
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-gray-700">Genre: </span>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {book.genre}
                  </span>
                </div>
                
                <div>
                  <span className="font-semibold text-gray-700">Added: </span>
                  <span className="text-gray-600">{formatDate(book.created_at)}</span>
                </div>
              </div>
              
              {isAuth && (
                <div className="mt-8">
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-add-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && isAuth && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Write Your Review</h2>
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <StarRating
                  rating={newReview.rating}
                  size="lg"
                  interactive={true}
                  onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={newReview.review_text}
                  onChange={(e) => setNewReview(prev => ({ ...prev, review_text: e.target.value }))}
                  placeholder="Share your thoughts about this book..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {newReview.review_text.length}/500 characters
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">
            Reviews ({reviews.length})
          </h2>
          
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="ri-user-line text-blue-600 w-5 h-5 flex items-center justify-center"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.reviewer?.name || 'Anonymous'}</h4>
                        <p className="text-sm text-gray-600">{formatDate(review.created_at)}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-chat-3-line text-gray-400 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to share your thoughts about this book!
              </p>
              {isAuth ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Write First Review
                </button>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Login to Write Review
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
