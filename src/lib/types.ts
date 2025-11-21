export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'organizer' | 'admin';
  interests: string[];
};

export type Event = {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  category?: string;
  tags?: string[];
  organizerId: string;
  image?: string;
};

export type Registration = {
  userId: string;
  eventId: string;
  createdAt: string;
};

export type Attendance = {
    eventId: string;
    userId: string;
    present: boolean;
    timestamp: string;
}

export type Certificate = {
  id: string; // This is the doc id, which is the UUID
  uuid: string; // UUID
  hash: string; // SHA-256
  eventId: string;
  userId: string;
  issueDate: string;
};

export type Report = {
    eventId: string;
    images: string[]; // URLs to images in storage
    generatedAt: string;
}
