import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdmin = token?.role === 'ADMIN';
        const isAuthRoute = req.nextUrl.pathname.startsWith("/login");

        if (isAuthRoute) {
            if (token) return NextResponse.redirect(new URL("/pos", req.url));
            return null;
        }

        // Restrict Staff from administrative pages
        if (!isAdmin && (
            req.nextUrl.pathname.startsWith('/dashboard') ||
            req.nextUrl.pathname.startsWith('/products')
        )) {
            return NextResponse.redirect(new URL("/pos", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        }
    }
);

export const config = {
    matcher: ["/pos/:path*", "/dashboard/:path*", "/reports/:path*", "/products/:path*"]
};
