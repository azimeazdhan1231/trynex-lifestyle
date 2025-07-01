# TryNex Lifestyle - Custom Gift E-commerce Platform

## Overview

TryNex Lifestyle is a full-stack e-commerce platform specializing in customized gifts such as t-shirts, mugs, tumblers, and other personalized items. The application is built for the Bangladeshi market with Bengali language support and features a modern, responsive design optimized for both desktop and mobile users.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: 
  - React Query (TanStack Query) for server state
  - React Context for cart management
  - React Hook Form for form handling
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - Shadcn/ui component library for consistent UI components
  - Custom CSS variables for theme customization
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful API architecture
- **Development**: Hot module replacement with Vite integration

### UI Component System
- **Base**: Radix UI primitives for accessibility
- **Theme**: Custom design system with Bengali font support (Noto Sans Bengali)
- **Responsive**: Mobile-first responsive design
- **Internationalization**: Bengali and English content support

## Key Components

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Pooled connections with @neondatabase/serverless

### Authentication & Security
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **Password Handling**: Secure password hashing (implementation pending)
- **CORS**: Configured for cross-origin requests

### E-commerce Features
- **Product Catalog**: Categories, products with customization options
- **Shopping Cart**: Persistent cart with customization details
- **Order Management**: Order processing with item tracking
- **Contact System**: Customer inquiry handling
- **Newsletter**: Email subscription management
- **Blog System**: Content management for SEO and engagement

### External Integrations
- **WhatsApp**: Direct customer communication and order placement
- **Image Hosting**: Unsplash integration for product images
- **Font Loading**: Google Fonts for Bengali typography
- **Social Media**: Facebook, Instagram, YouTube integration

## Data Flow

### Client-Server Communication
1. **API Requests**: Centralized through queryClient with error handling
2. **Data Fetching**: React Query for caching and synchronization
3. **Form Submissions**: React Hook Form with Zod validation
4. **Real-time Updates**: Optimistic updates for cart operations

### Database Schema
- **Users**: Customer accounts with admin privileges
- **Categories**: Product categorization with Bengali names
- **Products**: Customizable products with pricing and images
- **Orders**: Order tracking with customer details
- **Blog Posts**: Content management with Bengali support
- **Contacts**: Customer inquiry storage
- **Newsletters**: Email subscription management

### Cart Management
- **Local State**: React Context for immediate updates
- **Persistence**: LocalStorage for cart recovery
- **WhatsApp Integration**: Direct order placement via WhatsApp API

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling with validation
- **@hookform/resolvers**: Zod integration for validation
- **wouter**: Lightweight routing

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first styling
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library
- **react-icons**: Additional icons (WhatsApp, social media)

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **tsx**: TypeScript execution
- **esbuild**: Fast bundling for production

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application
- **Backend**: esbuild bundles Express server with external dependencies
- **Static Assets**: Served from dist/public directory

### Environment Configuration
- **Development**: Hot reload with Vite dev server
- **Production**: Optimized builds with static file serving
- **Database**: Environment-based DATABASE_URL configuration

### Hosting Requirements
- **Node.js**: Runtime environment
- **PostgreSQL**: Database server (Neon recommended)
- **Static Files**: CDN-ready asset serving
- **SSL**: HTTPS for secure transactions

## Changelog

Changelog:
- June 29, 2025. Initial setup with React/TypeScript, PostgreSQL database, and full-stack architecture
- June 29, 2025. Added comprehensive product catalog with 8 categories and sample products
- June 29, 2025. Implemented professional checkout system with real-time order management
- June 29, 2025. Created admin dashboard with order tracking and customer communication
- June 29, 2025. Added WhatsApp integration for order placement and customer support
- June 29, 2025. Enhanced cart functionality with product customization options
- June 29, 2025. Deployed working website with Bengali language support and responsive design

## Recent Features Added

### E-commerce System
- **Complete Checkout Flow**: Professional checkout page with customer form validation
- **Real-time Admin Panel**: Live order dashboard with automatic updates every 5 seconds
- **Product Customization**: Text, color, size, and custom notes for each product
- **Cart Management**: Persistent shopping cart with item customization
- **Order Management**: Complete order tracking from placement to delivery

### Professional Features
- **WhatsApp Integration**: Direct order placement and customer communication
- **Bengali Language Support**: Full bilingual interface (Bengali/English)
- **Payment Methods**: Cash on delivery, bank transfer, mobile banking
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **SEO Optimization**: Meta tags, Open Graph, structured data

### Database & Backend
- **PostgreSQL Integration**: Scalable database with proper relationships
- **Real-time Updates**: Live order notifications and status updates
- **Data Validation**: Secure form handling with Zod validation
- **Error Handling**: Comprehensive error management and user feedback

### Product Categories
1. Custom T-Shirts (কাস্টম টি-শার্ট)
2. Custom Mugs (কাস্টম মগ)
3. Custom Tumblers (কাস্টম টাম্বলার)
4. Custom Hoodies (কাস্টম হুডি)
5. Custom Caps (কাস্টম ক্যাপ)
6. Custom Keychains (কাস্টম কিচেইন)
7. Custom Phone Cases (কাস্টম ফোন কেস)
8. Custom Pillows (কাস্টম বালিশ)

## User Preferences

Preferred communication style: Simple, everyday language.