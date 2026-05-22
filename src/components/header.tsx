'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'All Projects' },
    { href: '/resources', label: 'Resources' },
    { href: '/showcase', label: 'Showcase' },
  ];

  return (
    <>
      <style>{`
        .hkn-header {
          padding: 0.5rem 2rem;
          backdrop-filter: blur(10px);
          background-color: #11192840;
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 100;
          font-family: var(--font-geist-sans);
          font-size: 1rem;
        }

        .hkn-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Desktop link row */
        .hkn-links {
          display: flex;
          gap: 20px;
        }

        .hkn-link {
          text-decoration: none;
        }

        /* Hamburger button — hidden on desktop */
        .hkn-burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .hkn-burger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #bfdbfee6;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }

        /* Mobile drawer */
        .hkn-drawer {
          display: none;
        }

        @media (max-width: 640px) {
          .hkn-header {
            padding: 0.5rem 1rem;
          }

          /* Hide the inline link row */
          .hkn-links {
            display: none;
          }

          /* Show burger */
          .hkn-burger {
            display: flex;
          }

          /* Animated burger → X when open */
          .hkn-burger.open span:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
          }
          .hkn-burger.open span:nth-child(2) {
            opacity: 0;
          }
          .hkn-burger.open span:nth-child(3) {
            transform: translateY(-7px) rotate(-45deg);
          }

          /* Dropdown drawer */
          .hkn-drawer {
            display: flex;
            flex-direction: column;
            gap: 0;
            overflow: hidden;
            max-height: 0;
            transition: max-height 0.3s ease;
            background-color: #0d1f38e6;
          }

          .hkn-drawer.open {
            max-height: 300px;
          }

          .hkn-drawer a {
            padding: 14px 16px;
            color: #bfdbfee6;
            text-decoration: none;
            font-family: var(--font-geist-sans);
            font-size: 1rem;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            transition: background 0.15s;
          }

          .hkn-drawer a:hover,
          .hkn-drawer a.active {
            background: rgba(96, 165, 250, 0.12);
            color: #60a5fa;
          }
        }
      `}</style>

      <header className="hkn-header">
        <nav className="hkn-nav">
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/hkn-logo.svg" alt="HKN Logo" width={48} height={48} />
          </Link>

          {/* Desktop links */}
          <div className="hkn-links">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="hkn-link"
                style={{ color: pathname === href ? '#5f69a6' : '#bfdbfee6' }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className={`hkn-burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
        </nav>

        {/* Mobile drawer */}
        <div className={`hkn-drawer ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      </header>
    </>
  );
}