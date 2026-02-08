import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  const links = [
    { href: '#', label: 'Privacy' },
    { href: '#', label: 'Terms' },
    { href: '#', label: 'Parents' },
    { href: '#', label: 'Support' },
  ];

  return (
    <footer className="border-t border-mint-300/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <Sparkles className="w-5 h-5 text-mint-300" />
            <span className="font-display font-semibold text-white">
              Orbit English
            </span>
          </a>

          {/* Links */}
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-400 hover:text-mint-300 transition-colors duration-200 text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Tagline */}
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-mint-300 fill-mint-300" />
            <span>for young learners</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
