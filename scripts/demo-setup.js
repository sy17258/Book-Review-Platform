#!/usr/bin/env node

/**
 * Demo Setup Script for Book Review Platform
 * Creates demo users and sample data for testing
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://usmsstwmfjyutidqfsei.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbXNzdHdtZmp5dXRpZHFmc2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4NDU1NzMsImV4cCI6MjA1MzQyMTU3M30.Yr0CTcOBF-Sh-l_wN7AkCtJjD-mxSsqpDi_NlEZi7Hw';

const supabase = createClient(supabaseUrl, supabaseKey);

// Demo user credentials
const demoUsers = [
  {
    email: 'demo@bookreview.com',
    password: 'demo123',
    name: 'Demo User'
  },
  {
    email: 'reader@bookreview.com',
    password: 'reader123',
    name: 'Avid Reader'
  },
  {
    email: 'bookworm@bookreview.com',
    password: 'bookworm123',
    name: 'Book Worm'
  }
];

// Sample reviews to add
const sampleReviews = [
  {
    bookTitle: 'The Great Gatsby',
    userEmail: 'demo@bookreview.com',
    rating: 5,
    review: 'A masterpiece of American literature. The symbolism and beautiful prose make this an unforgettable read.'
  },
  {
    bookTitle: 'To Kill a Mockingbird',
    userEmail: 'reader@bookreview.com',
    rating: 5,
    review: 'Harper Lee created something truly special here. The themes of justice and morality are as relevant today as ever.'
  },
  {
    bookTitle: 'The Hobbit',
    userEmail: 'bookworm@bookreview.com',
    rating: 4,
    review: 'A delightful adventure that started it all. Perfect introduction to Middle-earth for readers of all ages.'
  },
  {
    bookTitle: 'Dune',
    userEmail: 'demo@bookreview.com',
    rating: 4,
    review: 'Complex world-building and intricate politics. A sci-fi epic that rewards careful reading.'
  },
  {
    bookTitle: 'Pride and Prejudice',
    userEmail: 'reader@bookreview.com',
    rating: 5,
    review: 'Jane Austen\'s wit and social commentary shine through. Elizabeth Bennet is one of literature\'s greatest heroines.'
  }
];

async function createDemoUsers() {
  console.log('🔐 Creating demo user accounts...');
  
  for (const user of demoUsers) {
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name
          }
        }
      });
      
      if (error && !error.message.includes('User already registered')) {
        console.error(`❌ Error creating user ${user.email}:`, error.message);
        continue;
      }
      
      if (data.user) {
        // Also create user profile in our custom users table
        try {
          await supabase.from('users').upsert({
            id: data.user.id,
            email: user.email,
            name: user.name
          });
          console.log(`✅ Created demo user: ${user.email}`);
        } catch (profileError) {
          console.log(`ℹ️  User profile exists: ${user.email}`);
        }
      } else {
        console.log(`ℹ️  User already exists: ${user.email}`);
      }
    } catch (error) {
      console.error(`❌ Error with user ${user.email}:`, error.message);
    }
  }
}

async function addSampleReviews() {
  console.log('📝 Adding sample reviews...');
  
  // Get all books
  const { data: books } = await supabase.from('books').select('*');
  if (!books) {
    console.log('❌ No books found. Please run the main setup script first.');
    return;
  }
  
  // Get all users
  const { data: users } = await supabase.from('users').select('*');
  if (!users) {
    console.log('❌ No users found. Demo users creation may have failed.');
    return;
  }
  
  for (const review of sampleReviews) {
    try {
      const book = books.find(b => b.title === review.bookTitle);
      const user = users.find(u => u.email === review.userEmail);
      
      if (!book || !user) {
        console.log(`⚠️  Skipping review for ${review.bookTitle} by ${review.userEmail} - book or user not found`);
        continue;
      }
      
      const { error } = await supabase.from('reviews').upsert({
        book_id: book.id,
        user_id: user.id,
        rating: review.rating,
        review_text: review.review
      });
      
      if (error && !error.message.includes('duplicate')) {
        console.error(`❌ Error adding review:`, error.message);
      } else {
        console.log(`✅ Added review for "${review.bookTitle}" by ${user.name}`);
      }
    } catch (error) {
      console.error(`❌ Error processing review:`, error.message);
    }
  }
}

async function main() {
  console.log('🎯 Setting up demo data for Book Review Platform...\n');
  
  try {
    await createDemoUsers();
    console.log('');
    await addSampleReviews();
    
    console.log('\n✨ Demo setup complete!');
    console.log('\n📋 Demo Credentials:');
    console.log('┌─────────────────────────────────────────┐');
    demoUsers.forEach(user => {
      console.log(`│ 📧 ${user.email.padEnd(25)} │`);
      console.log(`│ 🔒 ${user.password.padEnd(25)} │`);
      console.log('├─────────────────────────────────────────┤');
    });
    console.log('└─────────────────────────────────────────┘');
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Visit: http://localhost:3000');
    console.log('2. Login with any demo account above');
    console.log('3. Explore books, read reviews, and add your own!');
    
  } catch (error) {
    console.error('❌ Demo setup failed:', error);
    console.log('\n💡 Make sure your Supabase database is set up first by running:');
    console.log('   npm run setup');
  }
}

// Manual instructions fallback
function showManualInstructions() {
  console.log('📋 Manual Demo Setup Instructions:');
  console.log('\n1. Go to your Supabase project dashboard');
  console.log('2. Navigate to Authentication > Users');
  console.log('3. Create these demo users manually:');
  
  demoUsers.forEach(user => {
    console.log(`   - Email: ${user.email}, Password: ${user.password}, Name: ${user.name}`);
  });
  
  console.log('\n4. The sample reviews will be added automatically when users login');
  console.log('5. Your demo environment will be ready!');
}

if (require.main === module) {
  main().catch(() => {
    showManualInstructions();
  });
}

module.exports = { createDemoUsers, addSampleReviews };
