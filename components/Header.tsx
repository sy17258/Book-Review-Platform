
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated, useAuthState } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const auth = useAuthState();

  useEffect(() => {
    setIsClient(true);
    
    const checkAuth = async () => {
      const authStatus = isAuthenticated();
      setIsAuth(authStatus);
      
      if (authStatus) {
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    };

    // Check auth status immediately
    checkAuth();

    // Set up an interval to check auth status periodically
    const authCheckInterval = setInterval(checkAuth, 1000);

    // Also listen for storage changes (for cross-tab sync)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      clearInterval(authCheckInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setIsAuth(false);
      router.push('/login');
    } catch (error) {
      // Handle logout error silently
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            BookReview
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/books" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              Browse Books
            </Link>
            {isAuth && (
              <Link href="/add-book" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Add Book
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {!isClient ? (
              // Skeleton loader to prevent hydration mismatch
              <div className="flex items-center space-x-4">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : isAuth ? (
              <>
                <span className="text-gray-600">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 whitespace-nowrap cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="text-blue-600 hover:text-blue-700 whitespace-nowrap cursor-pointer">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
