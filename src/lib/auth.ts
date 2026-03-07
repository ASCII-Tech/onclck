import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { genericOAuth } from "better-auth/plugins";
import { Role } from "@/generated/prisma/enums";

export const auth = betterAuth({
  // Now, the prismaAdapter uses the shared, singleton instance
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
      phoneNumber: {
        type: "string",
        required: false,
      },
    },
  },

  plugins: [
    nextCookies(),
    genericOAuth({
      config: [
        {
          providerId: "fayda",
          clientId: process.env.FAYDA_CLIENT_ID!,
          clientSecret: process.env.FAYDA_CLIENT_SECRET!,
          discoveryUrl: "https://api.id.et/.well-known/openid-configuration",
          scopes: ["openid", "profile", "email", "phone_number"],
          mapProfileToUser: async (profile) => {
            return {
              ...(profile.email
                ? {
                    email: profile.email,
                    emailVerified: profile.email_verified || false,
                  }
                : {
                    phoneNumber: profile.phone_number || profile.sub,
                  }),
              name: profile.name,
              image: profile.picture,
              role: profile.role || Role.USER,
            };
          },
        },
      ],
    }),
  ],
});
