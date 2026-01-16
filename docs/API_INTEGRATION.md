# API Integration Documentation

## Overview

This document describes the integration between the Matchdaysproject-new frontend and the Marketplace-Backend API for sports listings.

## Architecture

```
┌─────────────────────────────────────┐
│   Matchdaysproject-new (Frontend)   │
│         Next.js + TypeScript        │
│              Port: 3001             │
└──────────────┬──────────────────────┘
               │
               │ HTTP/REST API
               │
┌──────────────▼──────────────────────┐
│   Marketplace-Backend (API)         │
│      Node.js + Express + MongoDB    │
│              Port: 5000             │
└─────────────────────────────────────┘
```

## Backend Components

### 1. Model: `models/listings/sportsListing.js`

Defines the MongoDB schema for sports listings with fields:

- Basic info: title, description, category
- Product details: brand, model, club, season, size, condition
- Verification: autograph, vintage, defects
- AI data: recognition, pricing, authenticity
- Listing type: auction or buy_now
- Photos: array of photo objects with typeHints
- Owner info: user reference, contact details
- Status: pending_payment, pending, approved, active, etc.

### 2. Controller: `controllers/listings/sportsListingController.js`

Handles business logic for:

- `createSportsListing` - Create new listing
- `getAllSportsListings` - Get listings with filters
- `getSportsListingById` - Get single listing
- `updateSportsListing` - Update existing listing
- `deleteSportsListing` - Delete listing
- `placeBid` - Place bid on auction

### 3. Routes: `routes/listings/sportsListingRoutes.js`

API endpoints:

- `POST /api/sports-listings` - Create listing (auth required)
- `GET /api/sports-listings` - Get all listings (public)
- `GET /api/sports-listings/:id` - Get single listing (public)
- `PUT /api/sports-listings/:id` - Update listing (auth required)
- `DELETE /api/sports-listings/:id` - Delete listing (auth required)
- `POST /api/sports-listings/:id/bid` - Place bid (auth required)

## Frontend Components

### 1. API Client: `lib/api/listings.api.ts`

TypeScript functions for API communication:

- `createSportsListing(data)` - Create new listing
- `getSportsListings(params)` - Get listings with filters
- `getSportsListingById(id)` - Get single listing
- `updateSportsListing(id, data)` - Update listing
- `deleteSportsListing(id)` - Delete listing
- `placeBid(id, amount)` - Place bid

### 2. Form Component: `components/add-listing/smart-steps/SmartForm.tsx`

Main form component that:

- Manages form state with `SmartFormData` type
- Handles multi-step form navigation
- Calls `createSportsListing` API on publish
- Shows success/error messages

### 3. Types: `types/features/listing.types.ts`

TypeScript type definitions:

- `SmartFormData` - Complete form data structure
- `Photo` - Photo object with id, url, typeHint
- `AIAnalysisResult` - AI analysis data structure
- `Category` - Category with verification requirements

## Data Flow

### Creating a Listing

1. **User fills form** → `SmartForm.tsx` updates `data` state
2. **User clicks "Publish"** → `handlePublish()` is called
3. **API call** → `createSportsListing(data)` sends POST request
4. **Backend validation** → Controller validates required fields
5. **Database save** → Listing saved to MongoDB
6. **Response** → Success/error returned to frontend
7. **UI update** → Show success view or error message

```typescript
// Frontend
const handlePublish = async () => {
  const result = await createSportsListing(data);
  if (result.success) {
    setIsPublished(true);
  } else {
    alert(result.error);
  }
};
```

```javascript
// Backend
export const createSportsListing = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  const newListing = new SportsListing({
    ...req.body,
    user: req.user.userId,
    status: user.role === "admin" ? "approved" : "pending_payment",
  });
  const savedListing = await newListing.save();
  res.status(201).json({ success: true, data: savedListing });
};
```

## Authentication

The API uses JWT tokens for authentication:

1. **Token storage**: Stored in `localStorage` as `authToken`
2. **Token retrieval**: `getAuthToken()` function
3. **Header injection**: Added to requests via `createHeaders()`

```typescript
const createHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};
```

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Backend (.env.server)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=your_secret_key
```

## Testing the Integration

### 1. Start Backend

```bash
cd Marketplace-Backend
npm start
```

### 2. Start Frontend

```bash
cd Matchdaysproject-new
npm run dev
```

### 3. Test Flow

1. Navigate to `http://localhost:3001/add-listing`
2. Fill out the form (category, photos, details, pricing)
3. Click "Publish Listing"
4. Check browser console for API calls
5. Check backend logs for request processing
6. Verify listing in MongoDB

## Error Handling

### Frontend

- Try-catch blocks around API calls
- User-friendly error messages via `alert()`
- Console logging for debugging

### Backend

- Validation errors return 400 status
- Authentication errors return 401/403 status
- Server errors return 500 status
- All errors include descriptive messages

## Future Enhancements

1. **Image Upload**: Direct upload to Supabase/S3
2. **Real-time Updates**: WebSocket for auction bids
3. **Payment Integration**: Stripe/PayPal for listing fees
4. **AI Integration**: Actual AI analysis of photos
5. **Notifications**: Email/push notifications for bids
6. **Search**: Advanced filtering and search
7. **Analytics**: View tracking and insights

## Troubleshooting

### CORS Issues

Ensure backend has CORS enabled for frontend origin:

```javascript
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
```

### Authentication Errors

- Check if token is stored in localStorage
- Verify token format: `Bearer <token>`
- Check token expiration

### Network Errors

- Verify backend is running on port 5000
- Check API_URL in .env.local
- Inspect network tab in browser DevTools

## API Response Examples

### Success Response

```json
{
  "success": true,
  "message": "Sports listing created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Manchester United Home Jersey 2023/24",
    "category": "jerseys",
    "price": 89.99,
    "status": "pending_payment",
    "createdAt": "2026-01-14T12:00:00.000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Title is required"
}
```

## Contact

For questions or issues, please contact the development team.
