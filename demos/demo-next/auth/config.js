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
  database: process.env.NEXTAUTH_DATABASE_URL,
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
