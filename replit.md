# Trynex Bengali E-commerce Platform

## Project Overview
A comprehensive Bengali e-commerce platform specializing in personalized ceramic mugs and custom merchandise, offering a robust full-stack solution with advanced product management and localization features.

## Architecture Overview
- **Frontend**: React, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Drizzle ORM  
- **Database**: PostgreSQL with comprehensive schema
- **Deployment**: Ready for Netlify, AWS, and GitHub
- **Features**: Full bilingual support (English/Bengali), real-time product management, advanced cart system, order tracking, admin panel

## Recent Changes
- ✅ **2025-07-26**: Fixed all database storage errors and type mismatches
- ✅ **2025-07-26**: Set up complete PostgreSQL database with all tables and indexes
- ✅ **2025-07-26**: Migrated from memory storage to database storage successfully
- ✅ **2025-07-26**: Created complete SQL database setup script
- ✅ **2025-07-26**: Fixed admin login functionality and verified all API endpoints
- ✅ **2025-07-26**: **FIXED PROMO OFFER UPDATE FUNCTIONALITY** - Edit buttons now work perfectly
- ✅ **2025-07-26**: Resolved date conversion issues in database storage layer
- ✅ **2025-07-26**: **DEPLOYMENT READY** - Created comprehensive AWS EC2 deployment guide only
- ✅ **2025-07-26**: Added ProductForm and PromoOfferForm components for admin panel

## Database Setup
The application now uses PostgreSQL with complete schema including:
- Products with Bengali localization
- Orders with tracking system
- Custom designs for personalization
- Order timeline for status tracking
- Promotional offers system
- Wishlist functionality
- Admin user management

## Admin Panel
- **Access**: `/admin`
- **Credentials**: username: `admin`, password: `admin123`
- **Features**: Product management, order tracking, promotional offers, real-time updates

## User Preferences
- Language: Professional, technical communication when needed
- Code Style: Modern TypeScript with proper type safety
- Architecture: Full-stack with clear separation of concerns
- Database: PostgreSQL with proper indexing and relationships
- Deployment: AWS EC2 instances only (all other deployment guides removed)

## Key Features
1. **Bilingual Support**: Complete English/Bengali localization
2. **Product Management**: Advanced admin panel with CRUD operations
3. **Order System**: Comprehensive order tracking with timeline
4. **Custom Designs**: File upload and custom design management
5. **Real-time Updates**: Live order status updates
6. **Responsive Design**: Mobile-first approach with TailwindCSS

## Environment Variables
```env
DATABASE_URL=postgresql://postgres:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=5000
NODE_ENV=production
```

## Development Workflow
1. Use `npm run dev` to start development server
2. Database migrations handled via Drizzle ORM
3. Admin panel accessible at `/admin`
4. All APIs prefixed with `/api/`

## Deployment Status
- ✅ Database: Fully configured PostgreSQL
- ✅ Backend: Express server with all routes
- ✅ Frontend: React application with complete UI
- ✅ Admin Panel: Functional with all features
- ✅ Documentation: Complete deployment guide created

The application is production-ready and can be deployed to any cloud platform following the comprehensive deployment guide.