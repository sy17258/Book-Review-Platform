# 📚 Book Review Platform

A modern, full-stack book review platform built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)

## 🎥 Demo Video

<div align="center">
  
### 📹 **Full Platform Walkthrough**

<a href="https://drive.google.com/file/d/1zUY-ZandkWNWGga2VbmzdRrKt-YBl57W/view?usp=sharing" target="_blank">
  <img src="https://via.placeholder.com/720x405/1a1a1a/ffffff?text=📚+Book+Review+Platform+Demo+▶️+CLICK+TO+WATCH" alt="Demo Video Thumbnail" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"/>
</a>

<br/><br/>

[![Watch Demo](https://img.shields.io/badge/▶️%20Watch%20Full%20Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white&labelColor=000000)](https://drive.google.com/file/d/1zUY-ZandkWNWGga2VbmzdRrKt-YBl57W/view)

</div>

### 🎯 **What's in the Demo:**
| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Complete login/signup flow |
| 📚 **Book Catalog** | Browse and search books |
| ⭐ **Review System** | Rate and review books |
| ➕ **Add Books** | Add new books to platform |
| 📱 **Responsive UI** | Mobile-first design showcase |
| 🎨 **Modern Design** | Tailwind CSS styling |

---

## ✨ Features

- 📖 **Book Management** - Browse, search, and filter books
- ⭐ **Review System** - Write reviews and rate books (1-5 stars)
- 🔐 **Authentication** - Secure user registration and login
- 📱 **Responsive Design** - Mobile-first design
- 🎨 **Modern UI** - Clean interface with Tailwind CSS
- 🔍 **Advanced Search** - Filter by genre, author, or title

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Book Review Platform"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database** (Optional for demo)
   - The app will work with mock data if database isn't set up
   - For full functionality:
     - Go to your Supabase dashboard
     - Navigate to SQL Editor
     - Copy and paste contents of `database/schema.sql`
     - Execute the SQL script

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Demo Credentials

```
📧 Email: shivamydv.work@gmail.com
🔒 Password: 123456789
```

### What's Included
- ✅ Pre-populated books across multiple genres
- ✅ Sample reviews and ratings
- ✅ Working authentication system
- ✅ All features available for testing

### Quick Demo Steps
1. Visit the platform at [http://localhost:3000](http://localhost:3000)
2. Login with any demo account above
3. Browse books and read reviews
4. Add your own reviews and ratings
5. Try adding a new book to the collection

*Note: Demo accounts are reset periodically to maintain clean test data.*

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── books/             # Book pages
│   ├── login/             # Authentication
│   ├── signup/            # User registration
│   └── add-book/          # Add new books
├── components/            # Reusable UI components
│   ├── BookCard.tsx       # Book display component
│   ├── Header.tsx         # Navigation header
│   ├── Pagination.tsx     # Page navigation
│   └── StarRating.tsx     # Rating component
├── lib/                   # Utilities and API
│   ├── api.ts            # Supabase API functions
│   ├── auth.ts           # Authentication
│   └── supabase.ts       # Database config
└── database/             # Database schema
    └── schema.sql        # Database structure
```

## 🗄️ Database Schema

### Main Tables
- **Books**: `id`, `title`, `author`, `genre`, `created_at`
- **Users**: `id`, `email`, `name`, `created_at`
- **Reviews**: `id`, `book_id`, `user_id`, `rating`, `review_text`, `created_at`

## 🎯 Usage

### For Users
1. **Sign up** with your email
2. **Browse books** in the catalog
3. **Search and filter** to find books
4. **Write reviews** and rate books
5. **Add new books** to the platform

### For Developers
- **API Layer**: Complete CRUD operations with Supabase
- **Authentication**: Built-in user management
- **Real-time**: Live updates for new content
- **Type Safety**: Full TypeScript support

## ⚙️ Configuration

The project is pre-configured with:
- **Supabase URL**: `https://usmsstwmfjyutidqfsei.supabase.co`
- **Authentication**: Email/password login
- **Security**: Row Level Security (RLS) enabled
- **Deployment**: Ready for Vercel
- **Fallback System**: Uses mock data if database isn't set up

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Manual Build
```bash
npm run build
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework |
| TypeScript | Type safety |
| Supabase | Database & Auth |
| Tailwind CSS | Styling |
| React Hot Toast | Notifications |

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

Having issues? Check:
- Database setup in `database/schema.sql`
- Supabase configuration
- Browser console for errors

---

**Built with ❤️ for book lovers everywhere**