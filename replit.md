# Trynex Lifestyle E-Commerce Platform

## Overview

This is a full-stack e-commerce platform for Trynex Lifestyle, a custom mug and gift shop specializing in personalized mugs with Bengali-English bilingual support. The application provides a complete online shopping experience with custom design uploads, order tracking, and admin management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with a clear separation between client and server components:

- **Frontend**: React + TypeScript + Vite for the client-side application
- **Backend**: Express.js + TypeScript for the REST API server
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query for server state + React Context for client state

## Key Components

### Frontend Architecture
- **Component Structure**: Modular React components using shadcn/ui design system
- **Routing**: Wouter for lightweight client-side routing
- **Language Support**: Custom bilingual system (Bengali/English) with context provider
- **Cart Management**: React Context-based shopping cart with persistent state
- **UI Framework**: Tailwind CSS with custom color scheme and responsive design

### Backend Architecture
- **API Structure**: RESTful Express.js server with TypeScript
- **File Handling**: Multer for image uploads (product images, design files, payment screenshots)
- **Authentication**: Simple session-based admin authentication
- **Validation**: Zod schemas for request/response validation

### Database Schema
The application uses PostgreSQL with the following main entities:
- **Products**: Customizable mugs with Bengali/English names and descriptions
- **Orders**: Customer orders with tracking IDs and delivery information
- **Custom Designs**: User-uploaded design files linked to orders
- **Order Timeline**: Status tracking for order progression
- **Admin Users**: Administrative access control

## Data Flow

1. **Product Browsing**: Users view products fetched from PostgreSQL via REST API
2. **Shopping Cart**: Client-side cart state management with React Context
3. **Checkout Process**: Form submission with file uploads for custom designs
4. **Order Processing**: Server creates order records with unique tracking IDs
5. **Admin Management**: Secure admin panel for order and product management
6. **Order Tracking**: Public order status lookup by tracking ID

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL (configured for Neon/Supabase)
- **ORM**: Drizzle with automatic migrations
- **File Storage**: Local filesystem with Express static serving
- **Payment Integration**: Manual payment processing (bKash, Nagad, Upay)

### UI Libraries
- **Component Library**: Radix UI primitives with shadcn/ui styling
- **Icons**: Font Awesome for consistent iconography
- **Fonts**: Google Fonts (Noto Sans Bengali + Inter)

### Development Tools
- **Build System**: Vite for fast development and optimized builds
- **Type Safety**: TypeScript across the entire stack
- **Code Quality**: ESLint and TypeScript compiler checks

## Deployment Strategy

The application is designed for a split deployment approach:

### Frontend Deployment
- **Target**: Static hosting (Netlify recommended)
- **Build**: Vite production build to `dist/public`
- **Assets**: Optimized static files with CDN-friendly structure

### Backend Deployment
- **Target**: Node.js hosting (AWS EC2 recommended)
- **Build**: ESBuild bundling for production
- **Process**: PM2 or similar for process management
- **Files**: Upload directory needs persistent storage

### Database
- **Provider**: Supabase PostgreSQL (new credentials updated January 2025)
- **Connection**: postgresql://postgres.ickclyevpbgmppqizfov:***@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
- **Migrations**: Drizzle migrations in `/migrations` directory
- **Status**: Connected and schema pushed successfully

### Recent Changes (January 26, 2025)
- ✓ Fixed database connection with new Supabase credentials
- ✓ Full-stack architecture completed with Bengali e-commerce functionality
- ✓ Fixed duplicate districts key issue and order creation multer errors
- ✓ Order system now supports multiple file uploads (payment + custom designs)
- ✓ Complete deployment guides created for Netlify + AWS EC2
- ✓ All APIs working with proper error handling and file upload support
- ✓ Enhanced admin panel with real-time order updates and auto-refresh
- ✓ Improved order success modal with confetti animation and comprehensive information
- ✓ Created advanced order tracking page with timeline visualization
- ✓ Admin login system fixed and working properly (admin/admin123)
- ✓ Real-time order management with 5-second polling intervals
- ✓ Created comprehensive production deployment guide (FINAL_PRODUCTION_DEPLOYMENT.md)
- ✓ All old deployment guides removed and consolidated
- ✓ Ready for production deployment with enhanced features

### Key Architectural Decisions

1. **Monorepo Structure**: Simplifies development while maintaining clear boundaries
2. **TypeScript Everywhere**: Ensures type safety across client-server boundary
3. **Shared Schema**: Common data types and validation in `/shared` directory
4. **File Upload Strategy**: Local storage with Express serving (can be migrated to cloud storage)
5. **Bilingual Support**: Custom translation system for Bengali-English content
6. **Payment Flow**: Manual verification process suitable for local market
7. **Admin Authentication**: Simple but secure for small business requirements

The architecture prioritizes simplicity, type safety, and maintainability while providing a robust foundation for the e-commerce platform's specific requirements.