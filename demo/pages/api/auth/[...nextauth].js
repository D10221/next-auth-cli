import NextAuth from 'next-auth';
import options from 'auth';
export default (req, res) => NextAuth(req, res, options);
