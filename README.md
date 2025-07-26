# OOS Copilot - Out-of-Stock Management System

An AI-driven Out-of-Stock (OOS) Copilot system for retail inventory management that provides real-time monitoring, predictive analytics, and automated alerts for out-of-stock situations.

## Features

### 🚨 Real-time OOS Monitoring
- Live dashboard showing current stock levels across all stores
- Real-time out-of-stock event tracking and notifications
- WebSocket-powered live updates

### 🔮 AI-Powered Predictive Analytics
- Demand forecasting using machine learning algorithms
- Stock-out prediction based on consumption patterns
- Seasonal trend analysis and pattern recognition

### 📱 Smart Alert Management
- Configurable alerts with multiple severity levels (Low, Medium, High, Critical)
- Multi-channel notifications (Email, SMS, Push notifications)
- Alert acknowledgment and action tracking system

### 🏪 Multi-Store Management
- Centralized inventory tracking across multiple store locations
- Interactive store map with real-time status indicators
- Store hierarchy and regional management

### 📊 Comprehensive Analytics
- Historical trend analysis and performance metrics
- Service level monitoring and KPI tracking
- Lost sales estimation and impact analysis

### 🔗 Integration Capabilities
- POS system integration for real-time sales data
- Inventory management system connectors
- Weather API integration for demand correlation
- External event data sources (holidays, promotions, local events)

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Socket.IO for real-time communication
- **Database**: PostgreSQL with Prisma ORM (to be configured)
- **State Management**: Zustand
- **Styling**: Tailwind CSS with custom design system
- **Real-time**: Socket.IO for live updates and notifications

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (for production setup)

## Installation

1. **Install Node.js**
   
   If Node.js is not installed, download and install it from [nodejs.org](https://nodejs.org/)
   
   Or using Windows Package Manager:
   ```powershell
   winget install OpenJS.NodeJS
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   
   Copy the example environment file and configure your settings:
   ```bash
   cp .env.example .env.local
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Open the Application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── api/               # API routes
│   │   ├── products/      # Product management endpoints
│   │   ├── stores/        # Store management endpoints
│   │   ├── alerts/        # Alert management endpoints
│   │   └── socket/        # WebSocket endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx     # Context providers
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard component
│   ├── Header.tsx         # Application header
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── dashboard/         # Dashboard-specific components
│       ├── OOSOverview.tsx
│       ├── AlertsPanel.tsx
│       ├── StoreMap.tsx
│       ├── ProductCatalog.tsx
│       ├── DemandForecasting.tsx
│       └── HistoricalAnalysis.tsx
├── stores/                # Zustand state management
│   └── oosStore.ts       # Main application state
├── types/                 # TypeScript type definitions
│   └── index.ts          # Core type definitions
└── utils/                 # Utility functions (to be added)
```

## API Endpoints

### Products API
- `GET /api/products` - Retrieve all products with optional filtering
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get specific product details
- `PUT /api/products/[id]` - Update product information

### Stores API
- `GET /api/stores` - Retrieve all stores with optional filtering
- `GET /api/stores/[id]` - Get specific store details
- `PUT /api/stores/[id]` - Update store information

### Alerts API
- `GET /api/alerts` - Retrieve alerts with filtering options
- `POST /api/alerts` - Create a new alert
- `POST /api/alerts/[id]/read` - Mark alert as read
- `POST /api/alerts/[id]/acknowledge` - Acknowledge an alert

### Real-time WebSocket
- `/api/socket` - WebSocket endpoint for real-time updates

## Key Features Implementation

### Real-time Updates
The application uses Socket.IO for real-time communication:
- Live inventory level updates
- Instant alert notifications
- Real-time dashboard metrics

### Alert System
Comprehensive alert management with:
- Four severity levels: Low, Medium, High, Critical
- Multiple alert types: Stock out, Low stock, Predicted stock out, Supplier delays
- Action tracking and acknowledgment system

### Predictive Analytics
AI-powered forecasting capabilities:
- Demand prediction based on historical data
- Seasonal pattern recognition
- External factor correlation (weather, events)

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/oos_copilot"

# External APIs
WEATHER_API_KEY="your_weather_api_key"
MAPS_API_KEY="your_maps_api_key"

# Notifications
EMAIL_SERVICE_API_KEY="your_email_service_key"
SMS_SERVICE_API_KEY="your_sms_service_key"

# Authentication (if implementing)
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Adding New Features

1. **Components**: Add new React components in the `src/components/` directory
2. **API Routes**: Create new API endpoints in the `src/app/api/` directory
3. **Types**: Define TypeScript types in the `src/types/` directory
4. **State**: Manage application state in the `src/stores/` directory

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is proprietary software developed for retail inventory management.

## Support

For support and questions, please contact the development team or refer to the internal documentation.

---

**Note**: This application includes mock data for demonstration purposes. In a production environment, you'll need to:

1. Set up a PostgreSQL database
2. Configure Prisma ORM
3. Implement proper authentication
4. Set up external API integrations
5. Configure email and SMS notification services
6. Implement proper error handling and logging
7. Add comprehensive testing
8. Set up monitoring and analytics
