import Providers from 'next-auth/providers';
import adapter from './adapter';
const database = process.env.NEXTAUTH_DATABASE_URL;
const config = {
  database,
  adapter: adapter(database),
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Email',
          type: 'text',
          placeholder: 'admin:admin@localhost',
        },
        password: { label: 'Password', type: 'password' },
      },
      /**
       * Can reuse adapter
       */
      authorize: async function ({ username, password }) {
        try {
          const _adapter = await config.adapter.getAdapter();
          const user = await _adapter.getUserByEmail(username);
          if (user && user.password === password) {
            return user;
          }
          return null;
        } catch (error) {
          console.error('authorize', error);
          return Promise.resolve(null);
        }
      },
    }),
  ],
  session: { jwt: true },
  jwt: {},
};
/**
 * Next-auth configuration
 */
export default config;
