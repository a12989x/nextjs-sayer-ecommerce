import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_DATABASE_URL,
    NEXT_PUBLIC_API_URL,
} = process.env;

export default NextAuth({
    providers: [
        Providers.Google({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
    ],
    // database: NEXT_PUBLIC_DATABASE_URL,
    session: { jwt: true },
    callbacks: {
        async session(session, user) {
            session.jwt = user.jwt;
            session.id = user.id;

            return Promise.resolve(session);
        },
        async jwt(token, user, account, profile, isNewUser) {
            const isSignIn = user ? true : false;

            if (isSignIn) {
                const res = await fetch(
                    `${NEXT_PUBLIC_API_URL}/auth/${account.provider}/callback?access_token=${account.accessToken}`
                );
                const data = await res.json();
                token.jwt = data.jwt;
                token.id = data.user.id;
            }

            return Promise.resolve(token);
        },
    },
});
