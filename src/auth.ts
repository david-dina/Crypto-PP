import { Lucia,TimeSpan } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "./libs/prismaDb";

const adapter = new PrismaAdapter(prisma.session, prisma.user);
export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, "w"),
  getUserAttributes:(attribute)=>{
    return{
      username:attribute.username,
      name:attribute.name,
      email:attribute.email,
      avatarUrl:attribute.avatarUrl,
      premium:attribute.premium,
      emailVerified:attribute.emailVerified,
      phoneNumber:attribute.phoneNumber
    }
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes:DatabaseUserAttributes
  }
}

interface DatabaseSessionAttributes {
  authKey: string;
}
interface DatabaseUserAttributes {
  username: string;
  phoneNumber?:string;
  name?: string;
  email:string;
  avatarUrl:string|null;
  premium?:boolean;
  emailVerified?: boolean;
}
