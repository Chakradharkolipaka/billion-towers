const properties = [
  {
    id: 1,
    createdAt: "2025-01-10T12:00:00.000Z",
    name: "Luxury Downtown Apartment",
    description: "Modern apartment in the heart of downtown with stunning city views and premium amenities.",
    price: 2.5,
    profit: 8.5,
    returns: 12.3,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
    ],
    location: {
      city: "New York",
      state: "NY",
      country: "USA"
    },
    investors: 45,
    totalShares: 1000,
    availableShares: 200,
    status: "active",
    category: "residential",
    features: ["Pool", "Gym", "Parking", "Balcony"],
    isFeatured: true,
    yearBuilt: 2020,
    squareFootage: 1200,
    bedrooms: 2,
    bathrooms: 2,
    financials: {
      monthlyRent: 3500,
      annualYield: 8.5,
      expenses: 500,
      netIncome: 3000
    },
    occupancyPercent: 94,
    projectedRoi: 12.3,
    verified: true
  },
  {
    id: 2,
    createdAt: "2025-04-22T09:30:00.000Z",
    name: "Commercial Office Building",
    description: "Prime commercial space in the business district with excellent connectivity and modern facilities.",
    price: 5.2,
    profit: 7.2,
    returns: 10.8,
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
    ],
    location: {
      city: "San Francisco",
      state: "CA",
      country: "USA"
    },
    investors: 78,
    totalShares: 2000,
    availableShares: 150,
    status: "active",
    category: "commercial",
    features: ["Conference Rooms", "Parking", "Security", "High-Speed Internet"],
    isFeatured: true,
    yearBuilt: 2018,
    squareFootage: 5000,
    financials: {
      monthlyRent: 15000,
      annualYield: 7.2,
      expenses: 2000,
      netIncome: 13000
    },
    occupancyPercent: 88,
    projectedRoi: 10.8,
    verified: true
  },
  {
    id: 3,
    createdAt: "2025-08-05T15:00:00.000Z",
    name: "Suburban Family Home",
    description: "Spacious family home in a quiet neighborhood with excellent schools and parks nearby.",
    price: 1.8,
    profit: 6.8,
    returns: 9.2,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"
    ],
    location: {
      city: "Austin",
      state: "TX",
      country: "USA"
    },
    investors: 32,
    totalShares: 800,
    availableShares: 120,
    status: "active",
    category: "residential",
    features: ["Garden", "Garage", "Fireplace", "Hardwood Floors"],
    isFeatured: false,
    yearBuilt: 2015,
    squareFootage: 2200,
    bedrooms: 4,
    bathrooms: 3,
    financials: {
      monthlyRent: 2800,
      annualYield: 6.8,
      expenses: 400,
      netIncome: 2400
    },
    occupancyPercent: 91,
    projectedRoi: 9.2,
    verified: false
  },
  {
    id: 4,
    createdAt: "2025-10-18T11:45:00.000Z",
    name: "Industrial Warehouse",
    description: "Large industrial facility perfect for manufacturing and distribution operations.",
    price: 3.7,
    profit: 9.1,
    returns: 11.5,
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop"
    ],
    location: {
      city: "Chicago",
      state: "IL",
      country: "USA"
    },
    investors: 56,
    totalShares: 1500,
    availableShares: 180,
    status: "active",
    category: "industrial",
    features: ["Loading Docks", "High Ceilings", "Office Space", "Security"],
    isFeatured: true,
    yearBuilt: 2019,
    squareFootage: 10000,
    financials: {
      monthlyRent: 12000,
      annualYield: 9.1,
      expenses: 1500,
      netIncome: 10500
    },
    occupancyPercent: 86,
    projectedRoi: 11.5,
    verified: true
  },
  {
    id: 5,
    createdAt: "2026-02-28T08:00:00.000Z",
    name: "Beachfront Condo",
    description: "Luxury beachfront condominium with ocean views and resort-style amenities.",
    price: 4.1,
    profit: 7.8,
    returns: 10.2,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
    ],
    location: {
      city: "Miami",
      state: "FL",
      country: "USA"
    },
    investors: 67,
    totalShares: 1200,
    availableShares: 90,
    status: "active",
    category: "residential",
    features: ["Ocean View", "Pool", "Beach Access", "Concierge"],
    isFeatured: true,
    yearBuilt: 2021,
    squareFootage: 1800,
    bedrooms: 3,
    bathrooms: 2,
    financials: {
      monthlyRent: 4500,
      annualYield: 7.8,
      expenses: 600,
      netIncome: 3900
    },
    occupancyPercent: 97,
    projectedRoi: 10.2,
    verified: true
  },
  {
    id: 6,
    createdAt: "2026-05-01T14:20:00.000Z",
    name: "Mixed-Use Development",
    description: "Modern mixed-use building combining retail, office, and residential spaces.",
    price: 6.8,
    profit: 8.2,
    returns: 11.8,
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
    ],
    location: {
      city: "Seattle",
      state: "WA",
      country: "USA"
    },
    investors: 89,
    totalShares: 2500,
    availableShares: 110,
    status: "active",
    category: "mixed-use",
    features: ["Retail Space", "Office Floors", "Residential Units", "Parking"],
    isFeatured: false,
    yearBuilt: 2020,
    squareFootage: 15000,
    financials: {
      monthlyRent: 25000,
      annualYield: 8.2,
      expenses: 3000,
      netIncome: 22000
    },
    occupancyPercent: 89,
    projectedRoi: 11.8,
    verified: false
  }
];

export default properties;

