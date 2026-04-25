const Room = require("../models/Room");

const seedRooms = async () => {
  try {
    const existingRooms = await Room.find();
    if (existingRooms.length === 0) {
      const sampleRooms = [
        {
          title: "The Grand Resort",
          description:
            "Luxurious resort with ocean views and world-class amenities. Perfect for a relaxing getaway with family or friends.",
          location: {
            address: "123 Ocean Drive",
            city: "Miami",
            country: "USA",
          },
          price: 450,
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          ],
          amenities: [
            "WiFi",
            "Pool",
            "Spa",
            "Restaurant",
            "Gym",
            "Room Service",
          ],
          category: "Resort",
          type: "Suite",
          offer: 20,
        },
        {
          title: "Urban Luxury Hotel",
          description:
            "Modern hotel in the heart of the city with stunning skyline views and contemporary design.",
          location: {
            address: "456 Downtown Blvd",
            city: "New York",
            country: "USA",
          },
          price: 320,
          images: [
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          ],
          amenities: [
            "WiFi",
            "Business Center",
            "Fitness Center",
            "Concierge",
            "Valet Parking",
          ],
          category: "Hotel",
          type: "Deluxe",
          offer: 15,
        },
        {
          title: "Mountain View Cabin",
          description:
            "Cozy cabin nestled in the mountains, perfect for nature lovers and outdoor enthusiasts.",
          location: {
            address: "789 Forest Trail",
            city: "Aspen",
            country: "USA",
          },
          price: 280,
          images: [
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          ],
          amenities: [
            "Fireplace",
            "Hot Tub",
            "Hiking Trails",
            "WiFi",
            "Kitchen",
          ],
          category: "Villa",
          type: "Double Bed",
          offer: 0,
        },
        {
          title: "Beachfront Apartment",
          description:
            "Stunning beachfront apartment with private balcony and direct access to the beach.",
          location: {
            address: "321 Beach Road",
            city: "San Diego",
            country: "USA",
          },
          price: 395,
          images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
          ],
          amenities: [
            "Beach Access",
            "Balcony",
            "Kitchen",
            "WiFi",
            "Air Conditioning",
          ],
          category: "Apartment",
          type: "Suite",
          offer: 10,
        },
      ];

      await Room.insertMany(sampleRooms);
      console.log("Sample rooms created successfully");
    } else {
      console.log("Rooms already exist in database");
    }
  } catch (error) {
    console.error("Room seeding failed:", error.message);
  }
};

module.exports = seedRooms;
