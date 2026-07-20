# Sample Product Data for Testing

## Property 1: Luxury Downtown Apartment
```json
{
  "name": "Luxury Downtown High-Rise Apartment",
  "description": "Premium residential property in the heart of downtown with stunning city views, modern amenities, and high occupancy rates. Perfect for investors seeking stable rental income.",
  "price": 50000,
  "cuttedPrice": 55000,
  "category": "residential",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "address": "123 Park Avenue, Manhattan",
  "totalShares": 1000,
  "availableShares": 750,
  "investors": 25,
  "targetYield": 8.5,
  "projectedRoi": 12,
  "occupancy": 95,
  "yearBuilt": 2018,
  "squareFootage": 1200,
  "bedrooms": 2,
  "bathrooms": 2,
  "status": "active",
  "verified": true,
  "isFeatured": true,
  "monthlyRent": 3500,
  "annualYield": 8.5,
  "expenses": 800,
  "netIncome": 2700,
  "features": "Gym, Pool, 24/7 Security, Concierge, Parking",
  "imageUrl": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800\nhttps://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800\nhttps://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
  "logoUrl": "https://via.placeholder.com/150?text=BT",
  "brandname": "Billion Towers"
}
```

## Property 2: Commercial Office Space
```json
{
  "name": "Modern Commercial Office Complex",
  "description": "State-of-the-art office building in prime business district with excellent transport links and corporate tenants. Long-term leases provide stable cash flow.",
  "price": 150000,
  "cuttedPrice": 165000,
  "category": "commercial",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "address": "555 Market Street, Financial District",
  "totalShares": 2000,
  "availableShares": 1500,
  "investors": 50,
  "targetYield": 7.2,
  "projectedRoi": 10.5,
  "occupancy": 88,
  "yearBuilt": 2020,
  "squareFootage": 5000,
  "bedrooms": 0,
  "bathrooms": 4,
  "status": "active",
  "verified": true,
  "isFeatured": false,
  "monthlyRent": 12000,
  "annualYield": 7.2,
  "expenses": 2500,
  "netIncome": 9500,
  "features": "High-speed Internet, Conference Rooms, Elevator, Climate Control",
  "imageUrl": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800\nhttps://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
  "logoUrl": "https://via.placeholder.com/150?text=BT",
  "brandname": "Billion Towers"
}
```

## Property 3: Industrial Warehouse
```json
{
  "name": "Industrial Warehouse Distribution Center",
  "description": "Large warehouse facility perfect for logistics and distribution operations. Strategic location near major highways and excellent loading infrastructure.",
  "price": 200000,
  "cuttedPrice": 220000,
  "category": "industrial",
  "city": "Chicago",
  "state": "IL",
  "country": "USA",
  "address": "789 Industrial Parkway",
  "totalShares": 3000,
  "availableShares": 2400,
  "investors": 60,
  "targetYield": 9.0,
  "projectedRoi": 14,
  "occupancy": 100,
  "yearBuilt": 2015,
  "squareFootage": 25000,
  "bedrooms": 0,
  "bathrooms": 2,
  "status": "active",
  "verified": true,
  "isFeatured": true,
  "monthlyRent": 18000,
  "annualYield": 9.0,
  "expenses": 3000,
  "netIncome": 15000,
  "features": "Loading Docks, Climate Control, Security System, Ample Parking",
  "imageUrl": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800\nhttps://images.unsplash.com/photo-1553413077-190dd305871c?w=800",
  "logoUrl": "https://via.placeholder.com/150?text=BT",
  "brandname": "Billion Towers"
}
```

## Quick Test Property (Minimal)
```json
{
  "name": "Test Property Downtown",
  "description": "This is a test property for validation purposes with all required fields properly set.",
  "price": 10000,
  "cuttedPrice": 12000,
  "category": "residential",
  "city": "Austin",
  "state": "TX",
  "country": "USA",
  "address": "",
  "totalShares": 1000,
  "availableShares": 1000,
  "investors": 0,
  "targetYield": 8,
  "projectedRoi": 10,
  "occupancy": 0,
  "yearBuilt": "",
  "squareFootage": "",
  "bedrooms": "",
  "bathrooms": "",
  "status": "active",
  "verified": true,
  "isFeatured": false,
  "monthlyRent": "",
  "annualYield": "",
  "expenses": "",
  "netIncome": "",
  "features": "Modern, Clean",
  "imageUrl": "https://via.placeholder.com/800x600?text=Test+Property",
  "logoUrl": "https://via.placeholder.com/150?text=BT",
  "brandname": "Billion Towers"
}
```

## Important Notes

### Required Fields (Backend Validation)
- **name**: Minimum 3 characters
- **description**: Minimum 10 characters ✅
- **price**: Must be a number >= 0
- **category**: Must be one of: residential, commercial, industrial
- **stock** (availableShares): Must be a number >= 0
- **images**: At least one image URL is required (automatically formatted by frontend)

### Categories
Valid categories: `residential`, `commercial`, `industrial`

### Image URLs
- Enter one URL per line in the imageUrl field
- The frontend will automatically convert them to the correct format
- Use placeholder images from unsplash.com or placeholder.com for testing

### How to Use in Admin Dashboard
1. Sign in as admin: `admin@billiontowers.demo` / `Admin@12345`
2. Go to Admin Dashboard
3. Click "Add Property" button
4. Copy and paste values from one of the sample properties above
5. Submit the form

### Troubleshooting
- If you get "400 Bad Request", check that description has at least 10 characters
- Make sure price and stock are valid numbers
- Ensure category is exactly one of: residential, commercial, or industrial
- At least one image URL must be provided
