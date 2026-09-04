import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, auth } = NextAuth({
  providers: [Google],
  pages: { signIn: '/' },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized: () => true,
  },
});
