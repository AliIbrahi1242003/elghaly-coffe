"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, Menu, X, UserRound, LogOut } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { items, isHydrated } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount =
    isMounted && isHydrated
      ? items.reduce((total, item) => total + item.quantity, 0)
      : 0;

  const userName = session?.user?.name;
  const isLoggedIn = Boolean(session?.user);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2"
          : "bg-white/80 backdrop-blur-md shadow-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          Elghaly Coffe
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            About
          </Link>
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-foreground">
            <Search size={20} />
          </button>
          {isLoggedIn ? (
            <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-foreground shadow-sm">
              <UserRound size={18} className="text-primary" />
              <span className="max-w-[140px] truncate font-medium">
                {userName}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-foreground"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
            >
              <UserRound size={18} className="text-primary" />
              Sign in
            </Link>
          )}
          <Link
            href="/cart"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-foreground relative"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-secondary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              className="text-foreground hover:text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-foreground hover:text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <div className="flex space-x-4 pt-4 border-t border-gray-100">
              <button className="flex items-center space-x-2 text-foreground">
                <Search size={20} />
                <span>Search</span>
              </button>
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-foreground"
                >
                  <UserRound size={20} />
                  <span>{userName}</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <UserRound size={20} />
                  <span>Sign in</span>
                </Link>
              )}
              <Link
                href="/cart"
                className="flex items-center space-x-2 text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart size={20} />
                <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
