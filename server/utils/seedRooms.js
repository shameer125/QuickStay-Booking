const Room = require("../models/Room");

const sampleRooms = [
  {
    title: "The Grand Resort",
    description:
      "Luxurious resort with ocean views and world-class amenities. Ideal for families and extended stays with full-service dining and spa access.",
    location: {
      address: "123 Ocean Drive",
      city: "Miami",
      country: "USA",
    },
    price: 450,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Room Service"],
    category: "Resort",
    type: "Family Suite",
    offer: 20,
    rating: 4.9,
    numReviews: 214,
  },
  {
    title: "Urban Luxury Hotel",
    description:
      "Modern hotel in the heart of the city with skyline views, executive lounge access, and a 24-hour business center.",
    location: {
      address: "456 Downtown Blvd",
      city: "New York",
      country: "USA",
    },
    price: 320,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["WiFi", "Business Center", "Fitness Center", "Concierge", "Valet Parking"],
    category: "Hotel",
    type: "Deluxe",
    offer: 15,
    rating: 4.7,
    numReviews: 412,
  },
  {
    title: "Mountain View Cabin",
    description:
      "Cozy alpine retreat with fireplace, private hot tub, and trail access. Perfect for couples and outdoor enthusiasts.",
    location: {
      address: "789 Forest Trail",
      city: "Aspen",
      country: "USA",
    },
    price: 280,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["Fireplace", "Hot Tub", "Hiking Trails", "WiFi", "Kitchen"],
    category: "Villa",
    type: "Double Bed",
    offer: 0,
    rating: 4.85,
    numReviews: 156,
  },
  {
    title: "Beachfront Apartment",
    description:
      "Stunning beachfront apartment with private balcony, full kitchen, and direct sand access with sunset views.",
    location: {
      address: "321 Beach Road",
      city: "San Diego",
      country: "USA",
    },
    price: 395,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["Beach Access", "Balcony", "Kitchen", "WiFi", "Air Conditioning"],
    category: "Apartment",
    type: "Suite",
    offer: 10,
    rating: 4.8,
    numReviews: 289,
  },
  {
    title: "Riverside Boutique Hotel",
    description:
      "Intimate 42-room property on the river with artisan breakfast, library lounge, and curated local experiences.",
    location: {
      address: "18 Quai du Louvre",
      city: "Paris",
      country: "France",
    },
    price: 265,
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["WiFi", "Breakfast", "Concierge", "Airport Shuttle", "Bar"],
    category: "Hotel",
    type: "Luxury Room",
    offer: 12,
    rating: 4.92,
    numReviews: 503,
  },
  {
    title: "Desert Oasis Villa",
    description:
      "Private villa with heated pool, outdoor kitchen, and panoramic desert views. Ideal for small groups seeking quiet luxury.",
    location: {
      address: "2200 Palm Canyon Drive",
      city: "Palm Springs",
      country: "USA",
    },
    price: 520,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["Private Pool", "Kitchen", "Parking", "WiFi", "BBQ"],
    category: "Villa",
    type: "Family Suite",
    offer: 8,
    rating: 4.88,
    numReviews: 97,
  },
  {
    title: "Harbor Executive Suite",
    description:
      "Corner suite with floor-to-ceiling glass, marble bath, and harbor views. Includes club-level breakfast and evening drinks.",
    location: {
      address: "88 Circular Quay",
      city: "Sydney",
      country: "Australia",
    },
    price: 410,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["WiFi", "Club Lounge", "Gym", "Spa Access", "Room Service"],
    category: "Hotel",
    type: "Suite",
    offer: 5,
    rating: 4.75,
    numReviews: 178,
  },
  {
    title: "Old Town Heritage Inn",
    description:
      "Restored 19th-century building with original beams, courtyard garden, and chef-led tasting menus on weekends.",
    location: {
      address: "5 Carrer de la Princesa",
      city: "Barcelona",
      country: "Spain",
    },
    price: 195,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["WiFi", "Garden", "Restaurant", "Room Service", "Laundry"],
    category: "Hotel",
    type: "Double Bed",
    offer: 0,
    rating: 4.65,
    numReviews: 341,
  },
  {
    title: "Skyline Penthouse",
    description:
      "Two-level penthouse with wraparound terrace, piano lounge, and private elevator. The city’s most iconic stay.",
    location: {
      address: "350 5th Avenue",
      city: "New York",
      country: "USA",
    },
    price: 890,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["Terrace", "Butler", "WiFi", "Gym", "Kitchen"],
    category: "Apartment",
    type: "Luxury Room",
    offer: 18,
    rating: 4.95,
    numReviews: 62,
  },
  {
    title: "Tropical Garden Bungalow",
    description:
      "Standalone bungalow among palm groves with outdoor rain shower, plunge pool, and organic farm-to-table dining.",
    location: {
      address: "Jl. Raya Ubud",
      city: "Ubud",
      country: "Indonesia",
    },
    price: 220,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["Pool", "WiFi", "Breakfast", "Spa", "Airport Transfer"],
    category: "Resort",
    type: "Single Bed",
    offer: 22,
    rating: 4.9,
    numReviews: 428,
  },
  {
    title: "Lake District Lodge",
    description:
      "Stone lodge overlooking the lake with stone fireplace, boat dock, and guided hiking packages in summer and ski shuttle in winter.",
    location: {
      address: "14 Lake Road",
      city: "Queenstown",
      country: "New Zealand",
    },
    price: 310,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["Fireplace", "WiFi", "Kitchen", "Parking", "Activities Desk"],
    category: "Villa",
    type: "Family Suite",
    offer: 0,
    rating: 4.82,
    numReviews: 133,
  },
  {
    title: "Art District Loft",
    description:
      "Industrial-chic loft with gallery lighting, chef’s kitchen, and walkability to museums, supper clubs, and live music venues.",
    location: {
      address: "900 Wynwood Blvd",
      city: "Miami",
      country: "USA",
    },
    price: 175,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f31af?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["WiFi", "Kitchen", "Workspace", "Smart TV", "AC"],
    category: "Apartment",
    type: "Deluxe",
    offer: 10,
    rating: 4.58,
    numReviews: 267,
  },
];

const seedRooms = async () => {
  try {
    const existingRooms = await Room.find();
    const existingTitles = new Set(existingRooms.map((r) => r.title));
    const toInsert = sampleRooms.filter((r) => !existingTitles.has(r.title));
    if (toInsert.length > 0) {
      await Room.insertMany(toInsert);
      console.log(`Inserted ${toInsert.length} new sample room(s)`);
    } else {
      console.log("Sample rooms already present; skipped duplicate titles");
    }
  } catch (error) {
    console.error("Room seeding failed:", error.message);
  }
};

module.exports = seedRooms;
