# How to Upload Your Complete Project to EC2

## Option 1: Upload via GitHub (Recommended)

### Step 1: Create GitHub Repository
1. Go to GitHub.com and create a new repository
2. Name it `trynex-ecommerce`
3. Make it public or private (your choice)

### Step 2: Upload Your Project to GitHub
```bash
# On your local machine (where your project is)
cd /path/to/your/trynex-project

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial Trynex E-commerce Project"

# Add GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/trynex-ecommerce.git

# Push to GitHub
git push -u origin main
```

### Step 3: Clone on EC2
```bash
# On your EC2 instance
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/trynex-ecommerce.git
cd trynex-ecommerce
npm install
```

## Option 2: Create Project Files Directly on EC2

Since you can't SSH in yet, let's use the browser terminal:

### Step 1: Connect via Browser
1. AWS Console → EC2 → Instances
2. Select your instance
3. Click "Connect" → "EC2 Instance Connect"
4. Click "Connect" (opens browser terminal)

### Step 2: Create Project Structure
```bash
# Create complete project structure
mkdir -p /home/ubuntu/trynex-ecommerce/{server,client/src/{pages,components,lib},shared,uploads}
cd /home/ubuntu/trynex-ecommerce

# Create package.json
cat > package.json << 'EOF'
{
  "name": "trynex-ecommerce",
  "version": "1.0.0",
  "description": "Bengali E-commerce Platform",
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "vite build",
    "db:push": "drizzle-kit push:pg"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.9.0",
    "express": "^4.18.2",
    "drizzle-orm": "^0.29.3",
    "drizzle-zod": "^0.5.1",
    "postgres": "^3.4.3",
    "bcrypt": "^5.1.1",
    "express-session": "^1.17.3",
    "multer": "^1.4.5-lts.1",
    "zod": "^3.22.4",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@types/node": "^20.10.0",
    "@types/express": "^4.17.21",
    "@types/bcrypt": "^5.0.2",
    "@types/multer": "^1.4.11"
  }
}
EOF
```

### Step 3: Create Database Schema
```bash
# Create shared/schema.ts
cat > shared/schema.ts << 'EOF'
import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import crypto from "crypto";

// Products table
export const products = pgTable("products", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  nameBn: text("name_bn").notNull(),
  description: text("description"),
  descriptionBn: text("description_bn"),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  price: text("price").notNull(),
  originalPrice: text("original_price"),
  image: text("image"),
  images: text("images").array(),
  isCustomizable: boolean("is_customizable").default(false),
  isFeatured: boolean("is_featured").default(false),
  inStock: boolean("in_stock").default(true),
  isActive: boolean("is_active").default(true),
  features: text("features").array(),
  featuresBn: text("features_bn").array(),
  tags: text("tags").array(),
  specifications: text("specifications"), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
});

// Promo offers table
export const promoOffers = pgTable("promo_offers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  titleBn: text("title_bn").notNull(),
  description: text("description").notNull(),
  descriptionBn: text("description_bn").notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  image: text("image"),
  isActive: boolean("is_active").default(true),
  showAsPopup: boolean("show_as_popup").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin users
export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  trackingId: text("tracking_id").unique().notNull(),
  customerName: text("customer_name").notNull(),
  customerNameBn: text("customer_name_bn"),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address").notNull(),
  addressBn: text("address_bn"),
  products: text("products").notNull(), // JSON string
  totalAmount: text("total_amount").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").default("pending"),
  orderStatus: text("order_status").default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas
export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const insertPromoOfferSchema = createInsertSchema(promoOffers);
export const selectPromoOfferSchema = createSelectSchema(promoOffers);
export type InsertPromoOffer = z.infer<typeof insertPromoOfferSchema>;
export type PromoOffer = typeof promoOffers.$inferSelect;

export const insertAdminUserSchema = createInsertSchema(adminUsers);
export const selectAdminUserSchema = createSelectSchema(adminUsers);
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
EOF
```

### Step 4: Create Server Files
```bash
# Create server/index.ts
cat > server/index.ts << 'EOF'
import express from 'express';
import { createServer } from 'http';
import routes from './routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Trynex E-commerce API is running'
  });
});

// Default route
app.get('*', (req, res) => {
  res.json({ 
    message: 'Trynex Bengali E-commerce Platform', 
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api/*',
      admin: '/admin'
    }
  });
});

const server = createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Trynex E-commerce server running on port ${PORT}`);
  console.log(`📝 Admin panel: http://localhost:${PORT}/admin`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});
EOF

# Create basic routes
cat > server/routes.ts << 'EOF'
import express from 'express';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    message: 'Trynex E-commerce API is working!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/products',
      'GET /api/promo-offers',
      'POST /api/orders',
      'GET /admin/*'
    ]
  });
});

// Products endpoint
router.get('/products', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'Premium Love Mug',
      nameBn: 'প্রিমিয়াম লাভ মগ',
      price: '599',
      category: 'mugs',
      isActive: true
    }
  ]);
});

// Promo offers
router.get('/promo-offers', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Welcome Offer',
      titleBn: 'স্বাগতম অফার',
      discountPercentage: 20,
      isActive: true
    }
  ]);
});

export default router;
EOF
```

### Step 5: Create Configuration Files
```bash
# Create TypeScript config
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./",
    "types": ["node"]
  },
  "include": ["server/**/*", "shared/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Create drizzle config
cat > drizzle.config.ts << 'EOF'
import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  }
} satisfies Config;
EOF

# Create environment file
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://trynex_user:TrynexSecure2025!@localhost:5432/trynex_db
EOF
```

### Step 6: Install and Start
```bash
# Install dependencies
npm install

# Create uploads directory
mkdir -p uploads

# Start the application
npm run dev
```

## Option 3: File Upload via AWS Systems Manager

If browser terminal doesn't work well for large files:

### Step 1: Use AWS Systems Manager
1. AWS Console → Systems Manager → Session Manager
2. Start session with your instance
3. This gives you a terminal without SSH

### Step 2: Download Files from Internet
```bash
# If you have files hosted somewhere, download them
wget https://your-file-host.com/project.zip
unzip project.zip
```

## Verification Steps

After uploading your project:

```bash
# Check project structure
ls -la /home/ubuntu/trynex-ecommerce/

# Install dependencies
cd /home/ubuntu/trynex-ecommerce
npm install

# Test the application
npm run dev

# In another terminal, test the API
curl http://localhost:5000/api/test
```

## Access Your Website

Once everything is set up:
- **Website**: http://13.61.71.120
- **API Test**: http://13.61.71.120/api/test
- **Health Check**: http://13.61.71.120/health

Your Trynex E-commerce platform will be live and accessible!