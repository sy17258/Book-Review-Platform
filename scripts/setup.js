#!/usr/bin/env node

/**
 * Setup script for Book Review Platform with Supabase
 * This script helps you set up the database tables and initial data
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://usmsstwmfjyutidqfsei.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbXNzdHdtZmp5dXRpZHFmc2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjgyMjksImV4cCI6MjA2OTAwNDIyOX0.6af6kea37yVgyyqUlw36RjoR83Bi_QzsUZbOTQviqcc';

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up Book Review Platform database...');

  try {
    // Create sample books
    console.log('📚 Adding sample books...');
    
    const sampleBooks = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Classic Literature'
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Classic Literature'
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        genre: 'Classic Literature'
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Science Fiction'
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy'
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance'
      },
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian Fiction'
      },
      {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy'
      }
    ];

    const { data: books, error: booksError } = await supabase
      .from('books')
      .upsert(sampleBooks, { onConflict: 'title,author' })
      .select();

    if (booksError) {
      console.error('Error adding books:', booksError);
    } else {
      console.log(`✅ Added ${books?.length || 0} books`);
    }

    console.log('✨ Database setup complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Visit: http://localhost:3000');
    console.log('3. Create an account and start reviewing books!');
    console.log('\n🎯 Want demo accounts? Run: npm run demo');
    console.log('💡 Note: You can run this script multiple times safely.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Instructions for manual setup
function printManualInstructions() {
  console.log('📋 Manual Database Setup Instructions:');
  console.log('\n1. Go to your Supabase project dashboard');
  console.log('2. Navigate to the SQL Editor');
  console.log('3. Copy and paste the contents of database/schema.sql');
  console.log('4. Execute the SQL script');
  console.log('5. Your database will be ready!');
  console.log('\nSQL file location: ./database/schema.sql');
}

// Main execution
if (require.main === module) {
  if (process.argv.includes('--manual')) {
    printManualInstructions();
  } else {
    setupDatabase();
  }
}

module.exports = { setupDatabase };
