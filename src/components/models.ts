export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
}

export interface Post {
  title: string;
  thumbnail: string;
  content: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}
