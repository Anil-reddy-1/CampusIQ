# CampusIQ Frontend - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Running

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# IMPORTANT: Verify PostCSS config exists
# If CSS is not loading, ensure postcss.config.js exists in frontend/
# See CSS_FIX_APPLIED.md for troubleshooting

# Start development server
npm run dev
# Opens at http://localhost:5173 (or 5174 if 5173 is in use)

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Application Routes

### Public Routes (No Auth Required)
- `/login` - User login page
- `/signup` - New user registration  
- `/forgot-password` - Password reset

### Student Routes (Requires Authentication)
- `/` - Student dashboard (home)
- `/extraction` - Document extraction tool
- `/chat` - AI academic chat
- `/documents` - Document library
- `/planner` - Study planner & calendar
- `/quizzes` - Quiz center
- `/flashcards` - Flashcard decks
- `/settings` - User settings

### Admin Routes (Requires Admin Role)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/extractions` - Extraction metrics
- `/admin/health` - System health monitoring

## 🔐 Testing with Mock Data

All pages work with **mock data** by default. You can:

1. **Test Authentication Flow:**
   - Go to `/login`
   - Enter any email/password (will use Firebase in prod)
   - Mock data will populate the dashboard

2. **Test All Features:**
   - Navigate through sidebar menu
   - Upload files (UI shows upload states)
   - Interact with forms and modals
   - Search, filter, and sort data
   - All interactions work with mock responses

3. **Test Admin Features:**
   - Access admin routes (requires role check in production)
   - View system metrics
   - Manage users
   - Monitor extraction performance

## 🎨 Development Tips

### Hot Module Replacement (HMR)
Vite provides instant HMR - just save your file and see changes immediately.

### TypeScript Support
- All components are strongly typed
- Check `src/types/index.ts` for type definitions
- IDE will provide autocomplete and type checking

### Component Library
Reusable components in `src/components/ui/`:
```tsx
import { Button, Card, Badge, Modal, Input, Spinner } from '@/components/ui';

<Button variant="primary" size="md">Click Me</Button>
<Badge variant="success">Active</Badge>
<Card className="p-6">Content</Card>
```

### API Services
All API calls are in `src/services/api/`:
```tsx
import { authApi, extractionApi, chatApi } from '@/services/api';

// Automatic error handling and mock data fallback
const profile = await authApi.getProfile();
const jobs = await extractionApi.getJobs();
```

## 🔧 Environment Variables

Create `.env` file in frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 📂 Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main routing configuration |
| `src/types/index.ts` | TypeScript type definitions |
| `src/services/api/client.ts` | Axios configuration & interceptors |
| `src/context/AuthContext.tsx` | Authentication state management |
| `tailwind.config.js` | Design system colors & typography |
| `src/index.css` | Global styles & utilities |
| `docs/API_REFERENCE.md` | Complete API documentation |

## 🐛 Troubleshooting

### CSS Not Loading (Showing Unstyled HTML)
**See `CSS_FIX_APPLIED.md` for complete guide**

Quick fix:
```bash
# Ensure postcss.config.js exists with correct Tailwind v4 config
# Create it with:
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
EOF

# Install required packages (Tailwind v4)
npm install -D @tailwindcss/postcss autoprefixer

# Restart dev server
npm run dev
```

### Port Already in Use
```bash
# Vite will automatically try the next available port
# Or kill the process using the port:
npx kill-port 5173
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Run type check
npm run build

# Fix common issues:
# - Check imports match exported names
# - Ensure types are up to date in src/types/index.ts
```

### Build Warnings
The following warnings are **expected** and **non-critical**:
- Lightningcss `@tailwind` and `@apply` warnings - Tailwind uses non-standard CSS
- Chunk size warnings - Can optimize later with code splitting

## 📖 Further Reading

- **API Reference**: See `docs/API_REFERENCE.md` for all endpoints
- **Implementation Details**: See `IMPLEMENTATION_COMPLETE.md` for full feature list
- **Material Design 3**: https://m3.material.io/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Router**: https://reactrouter.com/

## 🎯 Next Steps

1. **Start the dev server**: `npm run dev`
2. **Open in browser**: http://localhost:5173
3. **Explore the interface**: Navigate through all pages
4. **Check the code**: Review components and structure
5. **Connect backend**: Update API_BASE_URL when backend is ready

---

**Happy coding! 🚀**

