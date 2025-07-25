#!/usr/bin/env node

console.log('🔍 Checking Book Review Platform setup...');

// Check if all required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'lib/supabase.ts',
  'lib/api.ts',
  'lib/auth.ts',
  'database/schema.sql',
  'app/page.tsx',
  'components/BookCard.tsx'
];

console.log('\n📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check package.json dependencies
console.log('\n📦 Checking dependencies:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = ['@supabase/supabase-js', 'next', 'react', 'react-hot-toast'];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
  }
});

console.log('\n🎉 Setup check complete!');
console.log('\n🚀 To run the application:');
console.log('1. npm run dev');
console.log('2. Visit http://localhost:3000');
console.log('\n📊 To setup the database:');
console.log('1. Go to your Supabase project dashboard');
console.log('2. SQL Editor → Copy/paste database/schema.sql');
console.log('3. Execute the script');
