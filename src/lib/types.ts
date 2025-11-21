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
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  image: string;
  tags: string[];
};

export type Certificate = {
  id: string;
  title: string;
  event: string;
  date: string;
  image: string;
};
