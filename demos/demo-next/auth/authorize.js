import adapter from "./adapter";
import config from "./config";
/** */
export default async function authorize({ username, password }) {
  try {
    const _adapter = await adapter(config.database).getAdapter();
    const user = await _adapter.getUserByEmail(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  } catch (error) {
    console.error("authorize", error);
    return Promise.resolve(null);
  }
}
