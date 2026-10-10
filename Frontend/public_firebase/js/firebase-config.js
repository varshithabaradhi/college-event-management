// Firebase Configuration for project "event-433eb"
const firebaseConfig = {
  apiKey: "AIzaSyCkZB3BnxZMf9UlWoxu1mAetxX_IlaT54g",
  authDomain: "event-433eb.firebaseapp.com",
  projectId: "event-433eb",
  storageBucket: "event-433eb.firebasestorage.app",
  messagingSenderId: "65144884283",
  appId: "1:65144884283:web:51e7de7c19a6ef1fa3201e",
  measurementId: "G-2YCW253JLX"
};

// Initialize Firebase App
let firebaseApp, auth, db;
try {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  try {
    db = firebase.firestore();
  } catch (e) {
    console.warn('Firestore initial check:', e);
  }
} catch (err) {
  console.error('Firebase initialization error:', err);
}

// Initial Sample Data Store
const DEFAULT_EVENTS = [
  {
    id: 'evt-101',
    title: 'HackSphere 2026: Annual Inter-College Hackathon',
    category: 'Technical',
    date: '2026-10-24',
    time: '09:00 AM',
    venue: 'Sir MV Seminar Hall',
    venueLocation: 'CS Engineering Block, 2nd Floor',
    organizer: 'Department of Computer Science & Coding Club',
    maxParticipants: 120,
    deadline: '2026-10-22',
    banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    description: 'A thrilling 36-hour hackathon bringing together the brightest minds to solve real-world problems using AI, Web3, and Cloud computing. Exciting cash prizes worth ₹1,50,000!',
    status: 'Upcoming'
  },
  {
    id: 'evt-102',
    title: 'Tarang 2026: Grand Annual Cultural Festival',
    category: 'Cultural',
    date: '2026-11-05',
    time: '04:30 PM',
    venue: 'Central Open Amphitheatre',
    venueLocation: 'Near Student Recreation Center',
    organizer: 'Student Cultural Committee',
    maxParticipants: 500,
    deadline: '2026-11-03',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    description: 'The biggest cultural celebration of the year featuring battle of the bands, classical & western dance showdowns, stage plays, and fashion parade followed by celebrity DJ night.',
    status: 'Upcoming'
  },
  {
    id: 'evt-103',
    title: 'Generative AI & Agentic Systems Workshop',
    category: 'Workshop',
    date: '2026-10-18',
    time: '10:30 AM',
    venue: 'APJ Abdul Kalam Auditorium',
    venueLocation: 'Main Campus Block A, Ground Floor',
    organizer: 'AI & Data Science Association',
    maxParticipants: 100,
    deadline: '2026-10-16',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    description: 'Hands-on interactive masterclass covering LLMs, autonomous coding agents, and LangChain orchestration conducted by industry tech leads from top AI research labs.',
    status: 'Upcoming'
  },
  {
    id: 'evt-104',
    title: 'Inter-Department Badminton Championship',
    category: 'Sports',
    date: '2026-10-28',
    time: '08:00 AM',
    venue: 'Indoor Sports Complex',
    venueLocation: 'Sports Ground North Wing',
    organizer: 'Physical Education Department',
    maxParticipants: 64,
    deadline: '2026-10-25',
    banner: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    description: 'Annual men & women singles and doubles tournament. Trophies, medals, and university athletic credit points for all category winners.',
    status: 'Upcoming'
  }
];

const DEFAULT_VENUES = [
  { id: 'v1', name: 'APJ Abdul Kalam Auditorium', location: 'Main Campus Block A, Ground Floor', capacity: 600 },
  { id: 'v2', name: 'Sir MV Seminar Hall', location: 'CS Engineering Block, 2nd Floor', capacity: 180 },
  { id: 'v3', name: 'Central Open Amphitheatre', location: 'Near Student Recreation Center', capacity: 800 },
  { id: 'v4', name: 'Indoor Sports Complex', location: 'Sports Ground North Wing', capacity: 400 }
];
