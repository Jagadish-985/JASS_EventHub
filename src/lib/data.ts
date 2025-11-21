import type { User, Event, Certificate } from './types';

// This file contains placeholder data.
// In a real application, this data would be fetched from a database.

export const user: User = {
  id: '1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatar: 'https://picsum.photos/seed/301/100/100',
  interests: ['AI', 'Web Development', 'UX Design'],
  pastAttendance: ['Web Dev Conf 2023', 'Intro to Machine Learning'],
};

export const events: Event[] = [
  {
    id: '1',
    title: 'AI in the Modern World',
    category: 'Technology',
    date: '2024-10-15T09:00:00',
    location: 'Main Auditorium',
    description: 'Explore the latest advancements in Artificial Intelligence and its impact on various industries.',
    image: 'https://picsum.photos/seed/101/600/400',
    tags: ['AI', 'Machine Learning', 'Tech'],
  },
  {
    id: '2',
    title: 'Advanced UX Design Workshop',
    category: 'Design',
    date: '2024-11-02T10:00:00',
    location: 'Room 201, Design Building',
    description: 'A hands-on workshop for experienced designers to hone their user experience skills.',
    image: 'https://picsum.photos/seed/102/600/400',
    tags: ['UX', 'Design', 'Workshop'],
  },
  {
    id: '3',
    title: 'Annual Tech Career Fair',
    category: 'Career',
    date: '2024-11-20T11:00:00',
    location: 'University Gymnasium',
    description: 'Connect with top tech companies and explore internship and full-time opportunities.',
    image: 'https://picsum.photos/seed/103/600/400',
    tags: ['Career', 'Networking', 'Jobs'],
  },
  {
    id: '4',
    title: '24-Hour Hackathon: Code for Good',
    category: 'Competition',
    date: '2024-12-05T18:00:00',
    location: 'Innovation Hub',
    description: 'Join teams to build innovative solutions for social challenges within 24 hours.',
    image: 'https://picsum.photos/seed/104/600/400',
    tags: ['Hackathon', 'Coding', 'Competition'],
  },
  {
    id: '5',
    title: 'Guest Lecture: The Future of Quantum Computing',
    category: 'Lecture',
    date: '2025-01-22T14:00:00',
    location: 'Physics Hall',
    description: 'A special lecture by Dr. Evelyn Reed on the future prospects of quantum computing.',
    image: 'https://picsum.photos/seed/105/600/400',
    tags: ['Science', 'Quantum', 'Lecture'],
  },
];

export const certificates: Certificate[] = [
  {
    id: 'cert-1',
    title: 'Certificate of Completion: AI Fundamentals',
    event: 'AI in the Modern World',
    date: '2023-10-15',
    image: 'https://picsum.photos/seed/201/800/600',
  },
  {
    id: 'cert-2',
    title: 'Advanced UX Design',
    event: 'Advanced UX Design Workshop',
    date: '2023-11-02',
    image: 'https://picsum.photos/seed/202/800/600',
  },
  {
    id: 'cert-3',
    title: 'Participation in Code for Good Hackathon',
    event: '24-Hour Hackathon: Code for Good',
    date: '2023-12-06',
    image: 'https://picsum.photos/seed/201/800/600',
  },
];

export const skillData = [
  { month: "Jan", "AI/ML": 40, "Web Dev": 24, "Design": 18, "Career": 30 },
  { month: "Feb", "AI/ML": 30, "Web Dev": 14, "Design": 22, "Career": 20 },
  { month: "Mar", "AI/ML": 20, "Web Dev": 48, "Design": 30, "Career": 25 },
  { month: "Apr", "AI/ML": 28, "Web Dev": 38, "Design": 20, "Career": 40 },
  { month: "May", "AI/ML": 19, "Web Dev": 43, "Design": 29, "Career": 32 },
  { month: "Jun", "AI/ML": 52, "Web Dev": 35, "Design": 41, "Career": 28 },
];
