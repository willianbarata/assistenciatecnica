import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from './lib/auth'
import { decrypt } from './lib/auth'

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value;

    // Protected Routes Pattern
    if (request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/clients') ||
        request.nextUrl.pathname.startsWith('/products') ||
        request.nextUrl.pathname.startsWith('/services') ||
        request.nextUrl.pathname.startsWith('/orders') ||
        request.nextUrl.pathname.startsWith('/portal')
    ) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        try {
            const payload = await decrypt(session);
            const role = payload.user.role

            // Clients should not access Dashboard
            if (!request.nextUrl.pathname.startsWith('/portal') && role === 'CLIENT') {
                return NextResponse.redirect(new URL('/portal', request.url))
            }
        } catch (err) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Auth Routes Pattern (redirect if already logged in)
    if (request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup')) {
        if (session) {
            try {
                const payload = await decrypt(session);
                const target = payload.user.role === 'CLIENT' ? '/portal' : '/dashboard'
                return NextResponse.redirect(new URL(target, request.url))
            } catch (e) {
                // Token invalid
            }
        }
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
