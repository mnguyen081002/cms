import Link from 'next/link';
import { COLORS } from '@/styles/colors';

export function Footer() {
  return (
    <footer style={{ backgroundColor: COLORS.header.bg, color: COLORS.header.text }} className="mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">About</h3>
            <p className="text-sm text-gray-400">
              A minimalist CMS for sharing your thoughts and ideas with the world.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 transition-colors hover:opacity-80">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-gray-400 transition-colors hover:opacity-80">
                  Posts
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 transition-colors hover:opacity-80">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 transition-colors hover:opacity-80">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy;
            {new Date().getFullYear()}
            {' '}
            CMS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
