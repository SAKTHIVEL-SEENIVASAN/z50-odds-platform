import { Link, useLocation } from 'react-router-dom';
import { Activity, Heart, Bot, Zap } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Matches', icon: Activity },
    { to: '/favorites', label: 'Favorites', icon: Heart },
    { to: '/agent', label: 'AI Agent', icon: Bot },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-foreground">Z50 Sports Odds</h1>
            <p className="text-[10px] leading-tight text-muted-foreground">
              Built by Sakthivel S M · AI Engineer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
