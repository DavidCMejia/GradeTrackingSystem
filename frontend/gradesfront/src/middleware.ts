/* eslint-disable consistent-return */
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('appSession');
  // console.log('🚀 ~ token:', token?.value);
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}
export const config = {
  matcher: ['/dashboard/:path*'],
};
