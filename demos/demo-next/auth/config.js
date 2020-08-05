import Providers from "next-auth/providers";
import adapter from "./adapter";
import authorize from "./authorize";
/**
 * Next-auth configuration
 */
export default {
  /**
   * @param {string|{}} [database]
   * @param {{}} [opts]
   */
  adapter,
  // NOTE: adapter : process.env.NODE_ENV !== 'production' ? myDevAdapter : myProductionAdapter
  database: process.env.NEXTAUTH_DATABASE_URL, 
  // process.env.NODE_ENV !== 'production' ? devDb : prodDB  -- 
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "admin:admin@localhost",
        },
        password: { label: "Password", type: "password" },
      },
      authorize,
    }),
  ],
  session: { jwt: true },
  jwt: {},
};
