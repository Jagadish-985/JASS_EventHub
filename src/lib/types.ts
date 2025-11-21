export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  interests: string[];
  pastAttendance: string[];
};

export type Event = {
  id: string;
  name: string;
  description: string;
  location: string;
  startTime: string; // Changed from date
  endTime: string; // Added
  organizerId: string; // Added
  tagIds?: string[]; // Added
  image?: string; // Made optional
  category?: string; // Made optional
  tags?: string[]; // Made optional
};

export type Certificate = {
  id: string;
  title: string;
  event: string;
  date: string;
  image: string;
};
