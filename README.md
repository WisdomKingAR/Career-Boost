# CareerBoost 🚀

**AI-Powered Career Development Assistant for B.Tech AI & Data Science Students**

CareerBoost helps students discover certificates, internships, hackathons, news, AI tools, and project ideas to accelerate their careers.

---

## 🌟 Features

- **📜 Certificate Discovery**: Find free and paid certifications from Coursera, AWS, Google, Microsoft, and more
- **💼 Internship Opportunities**: Search internships from top companies with filters for location, stipend, and remote work
- **🏆 Hackathon Calendar**: Discover upcoming hackathons with prize pools and registration links
- **📰 Tech News Feed**: Stay updated on AI, Cybersecurity, and Data Science trends
- **🛠️ AI Tools Recommendations**: Explore tools for ML, data science, and AI projects
- **💡 Project Ideas**: Get inspired with curated project ideas for your portfolio

---

## 🏗️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern design system with dark/light mode
- **JavaScript (ES6+)** - Vanilla JS for simplicity
- **Google Fonts** - Inter & Poppins typography

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - ORM for database management
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### DevOps
- **Native Node.js** - Running servers locally

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Option 1: Local Setup

#### 1. Clone the repository
```bash
cd d:/AARYAN/CODES
cd careerboost
```

#### 2. Backend Setup
```bash
cd careerboost-backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Update DATABASE_URL in .env (defaults to SQLite):
# DATABASE_URL="file:./prisma/dev.db"

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd ../careerboost-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will open on `http://localhost:3000`



---

## 📁 Project Structure

```
careerboost/
├── careerboost-backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── routes/                     # API routes
│   │   ├── auth.js
│   │   ├── certificates.js
│   │   ├── internships.js
│   │   ├── hackathons.js
│   │   ├── news.js
│   │   ├── tools.js
│   │   └── projects.js
│   ├── controllers/                # Business logic
│   │   ├── certificateController.js
│   │   ├── internshipController.js
│   │   └── ...
│   ├── middleware/                 # Auth, error handling
│   ├── services/                   # External API integrations
│   └── server.js                   # Main server file
│
├── careerboost-frontend/
│   ├── assets/
│   │   ├── styles.css             # Main styles
│   │   ├── responsive.css         # Mobile-first responsive
│   │   └── animations.css         # Smooth animations
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js          # API client
│   │   └── app.js                 # Main application logic
│   ├── index.html                 # Entry point
│
└── start.ps1                      # Rapid startup script
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### Certificates
- `GET /api/certificates` - List all certificates
- `GET /api/certificates/search?q=python` - Search certificates
- `POST /api/certificates/:id/save` - Save certificate (auth required)

### Internships
- `GET /api/internships` - List internships
- `GET /api/internships/search?q=ai` - Search internships
- `POST /api/internships/:id/apply` - Apply for internship (auth required)

### Hackathons
- `GET /api/hackathons` - List hackathons
- `GET /api/hackathons/upcoming` - Upcoming hackathons
- `POST /api/hackathons/:id/save` - Save hackathon (auth required)

### News
- `GET /api/news` - Latest news
- `GET /api/news/category/AI` - News by category
- `GET /api/news/search?q=cybersecurity` - Search news

### Tools
- `GET /api/tools` - All AI tools
- `GET /api/tools/recommendations?level=beginner` - Get recommendations

### Projects
- `GET /api/projects` - Project ideas
- `POST /api/projects/generate` - Generate custom ideas

### Users (Protected)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/skills` - Add skill
- `GET /api/users/saved` - Get saved items

---

## 🎨 Design Features

- **🌙 Dark & Light Mode**: Toggle between themes
- **✨ Glassmorphism**: Modern glass-like UI elements
- **🎭 Smooth Animations**: Micro-interactions for better UX
- **📱 Fully Responsive**: Mobile-first design
- **🎨 Gradient Accents**: Vibrant color schemes
- **⚡ Fast Performance**: Optimized loading and rendering

---

## 🗄️ Database Schema

Key models:
- **User** - Authentication and profile
- **Certificate** - Course certifications
- **Internship** - Job opportunities
- **Hackathon** - Competition events
- **News** - Tech articles
- **Tool** - AI/ML platforms
- **Project** - Project ideas
- **SavedItem** - User bookmarks

---

## 🔐 Environment Variables

Create `.env` in backend directory:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your_super_secret_key
JWT_EXPIRY=7d
NEWSAPI_KEY=your_newsapi_key
FRONTEND_URL=http://localhost:3000
```

---

## 🛠️ Development

### Backend Development
```bash
cd careerboost-backend

# Run with auto-reload
npm run dev

# View database in Prisma Studio
npx prisma studio

# Run migrations
npx prisma migrate dev
```

### Frontend Development
```bash
cd careerboost-frontend

# Run development server
npm run dev
```

---

## 📦 Deployment

### Backend Deployment (Railway/Render)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy!

### Frontend Deployment (Vercel)

1. Push frontend to GitHub
2. Import project in Vercel
3. Deploy automatically

---

## 🤝 Contributing

This is a student project. Feel free to fork and enhance!

---

## 📝 To-Do / Future Enhancements

- [ ] Add real NewsAPI integration
- [ ] Implement web scraping for internships
- [x] User authentication UI (login/signup modals)
- [ ] Save/bookmark functionality in UI
- [ ] User dashboard with saved items
- [ ] Email notifications for deadlines
- [ ] AI-powered recommendation engine
- [ ] Resume builder integration
- [ ] Interview preparation resources
- [ ] Peer networking features

---

## 📧 Contact

Built for B.Tech AI & Data Science students in Mumbai, India 🇮🇳

**Target Users**: Beginners looking to accelerate their careers in AI/ML

---

## 📄 License

MIT License - Free to use for educational purposes

---

## 🙏 Acknowledgments

- Mock data for certificates, internships, hackathons
- Design inspired by modern web trends
- Built with love for students pursuing AI careers

---

**Last Updated**: December 2025

🚀 **Start your career acceleration journey with CareerBoost!**
