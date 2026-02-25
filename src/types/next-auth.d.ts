import { DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user?: DefaultUser & {
            id: string;
            role: string;
        };
    }

    interface User extends DefaultUser {
        id: string;
        role: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
    }
}
