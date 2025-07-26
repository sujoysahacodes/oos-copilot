<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# OOS Copilot Project Instructions

This is a comprehensive AI-driven Out-of-Stock (OOS) Copilot system for retail inventory management. The application provides real-time monitoring, predictive analytics, and automated alerts for out-of-stock situations.

## Project Structure

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and App Router
- **Backend**: Next.js API routes with Socket.IO for real-time updates
- **Database**: PostgreSQL with Prisma ORM (to be configured)
- **State Management**: Zustand for client-side state
- **Real-time**: Socket.IO for live updates and notifications

## Key Features

1. **Real-time OOS Monitoring**: Live dashboard showing current stock levels and out-of-stock events
2. **Predictive Analytics**: AI-powered demand forecasting and stock-out predictions
3. **Alert Management**: Configurable alerts with severity levels and notification systems
4. **Store Management**: Multi-store inventory tracking with geographical mapping
5. **Historical Analysis**: Trend analysis and performance metrics
6. **Integration Layer**: APIs for POS systems, inventory management, weather data, and external events

## Technical Guidelines

- Use TypeScript for all new files
- Follow Next.js 14 App Router conventions
- Implement proper error handling and loading states
- Use Tailwind CSS for styling with the custom color palette
- Maintain responsive design principles
- Implement proper accessibility features
- Use Zustand for state management
- Follow REST API conventions for backend endpoints
- Implement proper data validation and sanitization

## API Endpoints Structure

- `/api/products` - Product catalog management
- `/api/stores` - Store information and hierarchy
- `/api/alerts` - Alert management and notifications
- `/api/oos-events` - Out-of-stock event tracking
- `/api/forecasts` - Demand forecasting and predictions
- `/api/inventory` - Real-time inventory levels
- `/api/metrics` - Performance metrics and analytics
- `/api/socket` - WebSocket connection for real-time updates

## Database Schema

The application uses the following main entities:
- Products: SKU, name, category, stock levels, suppliers
- Stores: Location, hierarchy, operating hours, contacts
- Inventory: Real-time stock levels, movements, reservations
- Alerts: Notifications, severity levels, acknowledgments
- Events: OOS events, external factors, historical data
- Users: Authentication, roles, permissions, preferences

## Development Notes

- All components should be responsive and accessible
- Implement proper loading states and error boundaries
- Use mock data until database is fully configured
- Follow the established color scheme and design patterns
- Implement proper SEO and meta tags
- Use server-side rendering where appropriate
- Optimize for performance and scalability
