import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; 
      firstName: string;
      lastName: string;
      email: string;
      birthDate?: Date | null;
      gender?: string | null;
      notificationsEnabled: boolean;
      projects?: string[]; // Assuming projects are stored as ObjectId strings
      tasks?: string[]; // Assuming tasks are stored as ObjectId strings
      sharedWith?: string[]; // Assuming sharedWith is stored as ObjectId strings
      image?: string | null;
    };
  }
}
