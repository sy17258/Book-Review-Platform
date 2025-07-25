
import { supabase } from './supabase';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  book_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  updated_at?: string;
  reviewer?: {
    id: string;
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at?: string;
}

// Books API
export const booksAPI = {
  // Get all books with pagination and filters
  async getBooks(params?: { 
    page?: number; 
    limit?: number;
    genre?: string; 
    author?: string; 
    sort?: string;
    search?: string;
  }) {
    try {
      let query = supabase
        .from('books_with_stats')
        .select('*');

      // Apply filters
      if (params?.genre) {
        query = query.eq('genre', params.genre);
      }
      
      if (params?.author) {
        query = query.eq('author', params.author);
      }

      if (params?.search) {
        query = query.or(`title.ilike.%${params.search}%,author.ilike.%${params.search}%`);
      }

      // Apply sorting
      switch (params?.sort) {
        case 'rating':
          query = query.order('average_rating', { ascending: false });
          break;
        case 'title':
          query = query.order('title', { ascending: true });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        // If the view doesn't exist, try the regular books table
        if (error.message?.includes('relation "books_with_stats" does not exist')) {
          return await this.getBooksFromTable(params);
        }
        throw error;
      }

      return {
        data: data || [],
        count: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      // Fallback to mock data if database is not set up
      return this.getMockBooks(params);
    }
  },

  // Fallback method to use regular books table
  async getBooksFromTable(params?: any) {
    try {
      let query = supabase
        .from('books')
        .select('*');

      // Apply filters
      if (params?.genre) {
        query = query.eq('genre', params.genre);
      }
      
      if (params?.author) {
        query = query.eq('author', params.author);
      }

      if (params?.search) {
        query = query.or(`title.ilike.%${params.search}%,author.ilike.%${params.search}%`);
      }

      // Apply sorting
      switch (params?.sort) {
        case 'title':
          query = query.order('title', { ascending: true });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) throw error;

      // Add default rating and review count for books from regular table
      const booksWithStats = (data || []).map(book => ({
        ...book,
        average_rating: 0,
        review_count: 0
      }));

      return {
        data: booksWithStats,
        count: booksWithStats.length,
        page: 1,
        limit: 10,
        totalPages: 1
      };
    } catch (error) {
      throw error;
    }
  },

  // Mock data fallback
  getMockBooks(params?: any) {
    let filtered = [...mockBooks];
    
    // Apply search filter
    if (params?.search) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(params.search.toLowerCase()) ||
        book.author.toLowerCase().includes(params.search.toLowerCase())
      );
    }
    
    // Apply genre filter
    if (params?.genre) {
      filtered = filtered.filter(book => book.genre === params.genre);
    }
    
    // Apply author filter
    if (params?.author) {
      filtered = filtered.filter(book => book.author === params.author);
    }
    
    // Apply sorting
    switch (params?.sort) {
      case 'rating':
        filtered.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: filtered.slice(startIndex, endIndex),
      count: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    };
  },

  // Get single book with reviews
  async getBook(id: string) {
    try {
      // Try to get from books_with_stats view first
      let { data: book, error: bookError } = await supabase
        .from('books_with_stats')
        .select('*')
        .eq('id', id)
        .single();

      // If view doesn't exist, try regular books table
      if (bookError && bookError.message?.includes('relation "books_with_stats" does not exist')) {
        const { data: bookData, error: fallbackError } = await supabase
          .from('books')
          .select('*')
          .eq('id', id)
          .single();

        if (fallbackError) throw fallbackError;
        
        book = {
          ...bookData,
          average_rating: 0,
          review_count: 0
        };
      } else if (bookError) {
        throw bookError;
      }

      if (!book) {
        // Fallback to mock data
        const mockBook = mockBooks.find(b => b.id === id);
        if (!mockBook) throw new Error('Book not found');
        book = mockBook;
      }

      // Try to get reviews
      let reviews = [];
      try {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            users:user_id (
              id,
              name
            )
          `)
          .eq('book_id', id)
          .order('created_at', { ascending: false });

        if (reviewsError && !reviewsError.message?.includes('relation "reviews" does not exist')) {
          throw reviewsError;
        }

        // Format reviews data
        reviews = reviewsData?.map(review => ({
          ...review,
          reviewer: {
            id: review.users?.id || review.user_id,
            name: review.users?.name || 'Anonymous'
          }
        })) || [];
      } catch (reviewError) {
        reviews = mockReviews[id] || [];
      }

      return {
        ...book,
        reviews
      };
    } catch (error) {
      // Complete fallback to mock data
      const mockBook = mockBooks.find(b => b.id === id);
      if (!mockBook) throw new Error('Book not found');
      
      return {
        ...mockBook,
        reviews: mockReviews[id] || []
      };
    }
  },

  // Create new book
  async createBook(data: { title: string; author: string; genre: string }) {
    try {
      const { data: book, error } = await supabase
        .from('books')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return book;
    } catch (error) {
      throw error;
    }
  },

  // Get unique genres for filter dropdown
  async getGenres() {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('genre')
        .order('genre');

      if (error) {
        const uniqueGenres = [...new Set(mockBooks.map(book => book.genre))];
        return uniqueGenres;
      }

      const uniqueGenres = [...new Set(data?.map(item => item.genre) || [])];
      return uniqueGenres.length > 0 ? uniqueGenres : [...new Set(mockBooks.map(book => book.genre))];
    } catch (error) {
      return [...new Set(mockBooks.map(book => book.genre))];
    }
  },

  // Get unique authors for filter dropdown
  async getAuthors() {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('author')
        .order('author');

      if (error) {
        const uniqueAuthors = [...new Set(mockBooks.map(book => book.author))];
        return uniqueAuthors;
      }

      const uniqueAuthors = [...new Set(data?.map(item => item.author) || [])];
      return uniqueAuthors.length > 0 ? uniqueAuthors : [...new Set(mockBooks.map(book => book.author))];
    } catch (error) {
      return [...new Set(mockBooks.map(book => book.author))];
    }
  }
};

// Reviews API
export const reviewsAPI = {
  // Add review to a book
  async addReview(bookId: string, data: { rating: number; review_text: string; user_id: string }) {
    try {
      const { data: review, error } = await supabase
        .from('reviews')
        .insert([{
          book_id: bookId,
          user_id: data.user_id,
          rating: data.rating,
          review_text: data.review_text
        }])
        .select(`
          *,
          users:user_id (
            id,
            name
          )
        `)
        .single();

      if (error) throw error;

      return {
        ...review,
        reviewer: {
          id: review.users?.id || review.user_id,
          name: review.users?.name || 'Anonymous'
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Get reviews for a book
  async getBookReviews(bookId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users:user_id (
            id,
            name
          )
        `)
        .eq('book_id', bookId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(review => ({
        ...review,
        reviewer: {
          id: review.users?.id || review.user_id,
          name: review.users?.name || 'Anonymous'
        }
      })) || [];
    } catch (error) {
      throw error;
    }
  }
};

// Users API
export const usersAPI = {
  // Create user
  async createUser(data: { id: string; email: string; name: string }) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  async getUser(id: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update user
  async updateUser(id: string, data: Partial<{ email: string; name: string }>) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return user;
    } catch (error) {
      throw error;
    }
  }
};

// Legacy mock data for fallback (can be removed once DB is set up)
export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic Literature',
    average_rating: 4.2,
    review_count: 156,
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic Literature',
    average_rating: 4.8,
    review_count: 234,
    created_at: '2024-01-10T14:20:00Z',
  },
  {
    id: '3',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Classic Literature',
    average_rating: 3.9,
    review_count: 189,
    created_at: '2024-01-08T09:15:00Z',
  },
  {
    id: '4',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    average_rating: 4.5,
    review_count: 312,
    created_at: '2024-01-05T16:45:00Z',
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    average_rating: 4.7,
    review_count: 445,
    created_at: '2024-01-03T11:30:00Z',
  },
  {
    id: '6',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    average_rating: 4.4,
    review_count: 278,
    created_at: '2024-01-01T08:00:00Z',
  },
];

export const mockReviews: { [key: string]: Review[] } = {
  '1': [
    {
      id: '1',
      book_id: '1',
      user_id: '1',
      review_text: 'A masterpiece of American literature. Fitzgerald\'s prose is absolutely beautiful.',
      rating: 5,
      reviewer: { id: '1', name: 'Emily Johnson' },
      created_at: '2024-01-20T14:30:00Z',
    },
    {
      id: '2',
      book_id: '1',
      user_id: '2',
      review_text: 'Great story but the ending felt rushed. Still worth reading.',
      rating: 4,
      reviewer: { id: '2', name: 'Michael Chen' },
      created_at: '2024-01-18T10:15:00Z',
    },
  ],
  '2': [
    {
      id: '3',
      book_id: '2',
      user_id: '3',
      review_text: 'An incredibly powerful story about justice and morality. A must-read.',
      rating: 5,
      reviewer: { id: '3', name: 'Sarah Williams' },
      created_at: '2024-01-22T16:45:00Z',
    },
  ],
};
