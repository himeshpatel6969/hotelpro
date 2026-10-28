const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { connectDB } = require('../config/db');

const initialUsers = [
  {
    name: 'Rajeshwar Singh Shekhawat',
    email: 'admin@hotelpro.com',
    password: 'AdminPassword123!',
    role: 'admin',
    phone: '+91 98110 23456',
  },
  {
    name: 'Ananya Sharma',
    email: 'customer@hotelpro.com',
    password: 'CustomerPassword123!',
    role: 'customer',
    phone: '+91 98201 54321',
  },
  {
    name: 'Arjun Patel',
    email: 'arjun.patel@example.com',
    password: 'CustomerPassword123!',
    role: 'customer',
    phone: '+91 98790 65432',
  },
];

const initialRooms = [
  {
    roomNumber: '101',
    title: 'Maharaja Royal Heritage Suite',
    type: 'Deluxe',
    description: 'Step into the grandeur of Rajasthan royalty. Features intricate jharokha bay windows overlooking lake waters, handcrafted teakwood furnishings, brass chandeliers, and an Italian marble bathroom with rose petal soaking bath.',
    pricePerNight: 8500,
    capacity: 2,
    bedType: '1 Royal Teakwood King Bed',
    roomSize: 58,
    rating: 4.9,
    featured: true,
    status: 'Available',
    amenities: [
      'Traditional Aarti & Garland Welcome',
      'Lake View Jharokha Balcony',
      'Rose Petal Soaking Tub',
      'Ayurvedic Herbal Bath Amenities',
      'High-Speed Wi-Fi',
      'Royal Masala Chai & Nespresso Bar',
      '24/7 Khidmatgar (Butler) Service',
      'Air Conditioning',
    ],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    roomNumber: '201',
    title: 'The Kohinoor Presidential Palace Suite',
    type: 'Presidential',
    description: 'The crown jewel of Indian luxury hospitality. Sprawling royal suite with private open-air terrace jacuzzi, hand-knotted Persian silk rugs, antique Mughal artwork, private dining salon, and dedicated luxury chauffeur.',
    pricePerNight: 24000,
    capacity: 4,
    bedType: '2 Handcrafted King Four-Poster Beds',
    roomSize: 145,
    rating: 5.0,
    featured: true,
    status: 'Available',
    amenities: [
      'Private Terrace & Heated Jacuzzi',
      'Dedicated Royal Butler (Khidmatgar)',
      'Royal Thali Private Dining Chamber',
      'Morning Yoga & Meditation Session',
      'Complimentary Airport Luxury Chauffeur',
      'High-Speed Wi-Fi',
      'Walk-in Royal Dressing Room',
      'Smart Automation & Bang & Olufsen Sound',
    ],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    roomNumber: '301',
    title: 'Malabar Backwaters Executive Suite',
    type: 'Suite',
    description: 'Inspired by the serene backwaters and fragrant spice estates of Kerala. Rosewood furnishings, open-air rainforest shower, private veranda overlooking lily ponds, and complimentary Ayurvedic tea bar.',
    pricePerNight: 12500,
    capacity: 3,
    bedType: '1 King Bed & 1 Daybed (Diwan)',
    roomSize: 72,
    rating: 4.8,
    featured: true,
    status: 'Available',
    amenities: [
      'Botanical Lily Pond Veranda',
      'Ayurvedic Herbal Steam & Rain Shower',
      'Dedicated Workstation & High-Speed Wi-Fi',
      'Club Lounge & Evening High Tea',
      'South Indian Filter Coffee Bar',
      'Organic Cotton Linen & Robes',
      'Air Conditioning',
    ],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    roomNumber: '102',
    title: 'Mughal Courtyard Heritage Double',
    type: 'Double',
    description: 'A tranquil sanctuary opening directly into our fragrant jasmine and frangipani courtyard. Two plush queen beds, soundproofing, organic herbal bath products, and carved stone jaali lattice screens.',
    pricePerNight: 5800,
    capacity: 4,
    bedType: '2 Queen Beds',
    roomSize: 48,
    rating: 4.7,
    featured: false,
    status: 'Available',
    amenities: [
      'Fragrant Courtyard Garden View',
      'Two Plush Queen Beds',
      'High-Speed Wi-Fi',
      'Traditional Handloom Tapestries',
      'Artisanal Brass Bath Amenities',
      'Smart TV & Masala Chai Maker',
      'Morning Yoga Access',
    ],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    roomNumber: '103',
    title: 'Vedic Solo Traveler Sanctuary',
    type: 'Single',
    description: 'An artfully curated sanctuary tailored for the mindful solo traveler or visiting corporate executive. High-thread-count organic cotton linens, copper water vessels, dedicated desk, and fiber internet.',
    pricePerNight: 3200,
    capacity: 1,
    bedType: '1 Queen Bed',
    roomSize: 34,
    rating: 4.6,
    featured: false,
    status: 'Available',
    amenities: [
      'High-Speed Fiber Wi-Fi',
      'Dedicated Work Desk',
      'Ayurvedic Copper Carafe',
      'Rainfall Shower',
      'Smart TV with Streaming Apps',
      'Air Conditioning & Digital Safe',
    ],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    roomNumber: '202',
    title: 'Jaipur Haveli Deluxe Suite',
    type: 'Deluxe',
    description: 'A celebration of Pink City architectural mastery with hand-painted fresco ceilings, ornate stone arches, double marble vanity, and evening courtyard classical sitar performances.',
    pricePerNight: 9200,
    capacity: 2,
    bedType: '1 King Bed',
    roomSize: 64,
    rating: 4.9,
    featured: true,
    status: 'Available',
    amenities: [
      'Heritage Baoli Courtyard Balcony',
      'Double Marble Vanity',
      'Complimentary Kesar Badam Welcome Drink',
      'Deep Soaking Tub',
      'High-Speed Wi-Fi',
      'Pure Silk Bathrobes & Slippers',
    ],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing bookings, rooms, and users...');
    await Booking.deleteMany({});
    await Room.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed] Seeding Indian luxury demo users...');
    const createdUsers = [];
    for (const u of initialUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`[Seed] Seeded ${createdUsers.length} users:`);
    console.log(`   - Admin: admin@hotelpro.com (Password: AdminPassword123!) [${createdUsers[0].name}]`);
    console.log(`   - Customer: customer@hotelpro.com (Password: CustomerPassword123!) [${createdUsers[1].name}]`);

    console.log('[Seed] Seeding Indian heritage suites...');
    const createdRooms = await Room.insertMany(initialRooms);
    console.log(`[Seed] Seeded ${createdRooms.length} Indian royal suites.`);

    console.log('[Seed] Seeding sample booking for demonstration...');
    const customer = createdUsers.find((u) => u.role === 'customer');
    const demoRoom = createdRooms[0];

    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 5);
    checkInDate.setHours(0, 0, 0, 0);

    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + 3);

    const nights = 3;
    const totalPrice = nights * demoRoom.pricePerNight;

    await Booking.create({
      user: customer._id,
      room: demoRoom._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: 2,
      nights,
      pricePerNight: demoRoom.pricePerNight,
      totalPrice,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      specialRequests: 'Traditional garland welcome requested. Annaprashan celebration.',
    });
    console.log(`[Seed] Seeded booking for ${customer.name} in Room ${demoRoom.roomNumber} (Total: ₹${totalPrice}).`);

    console.log('[Seed] Database successfully re-seeded with HotelPro Indian Heritage data!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed database: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = { seedData, initialUsers, initialRooms };
