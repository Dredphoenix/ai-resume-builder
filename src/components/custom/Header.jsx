import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Menu, X } from 'lucide-react';

function Header() {
  const { user, isSignedIn } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative p-3 px-5 shadow-md bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img src="/logo.svg" alt="ResMancer logo" className="h-9 w-auto sm:h-11" width={100} height={100} />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <Link to="/auth/sign-in">
              <Button>Get Started</Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(v => !v)}
            className="p-2 rounded-md inline-flex items-center justify-center hover:bg-gray-100"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute right-4 left-4 top-full mt-2 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-4 flex flex-col gap-3">
            {isSignedIn ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Dashboard</Button>
                </Link>
                <div className="flex justify-start"><UserButton /></div>
              </>
            ) : (
              <Link to="/auth/sign-in" onClick={() => setMenuOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
