"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  UserRound,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchProduct = {
  id: number;
  title: string;
  category: string;
  description: string;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProducts, setSearchProducts] = useState<SearchProduct[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isSearchOpen || searchProducts.length > 0 || isSearchLoading) {
      return;
    }

    const loadProducts = async () => {
      setIsSearchLoading(true);

      try {
        const response = await fetch("/api/search/products");

        if (!response.ok) {
          throw new Error("Failed to load search products");
        }

        const data = (await response.json()) as SearchProduct[];
        setSearchProducts(data);
      } finally {
        setIsSearchLoading(false);
      }
    };

    void loadProducts();
  }, [isSearchOpen, isSearchLoading, searchProducts.length]);

  const cartCount =
    isMounted && isHydrated
      ? items.reduce((total, item) => total + item.quantity, 0)
      : 0;

  const userName = session?.user?.name;
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";
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

  const handleSearch = () => {
    setIsSearchOpen(true);
    setIsOpen(false);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const matchingProducts = searchQuery.trim()
    ? searchProducts.filter((product) => {
        const searchableText = [
          product.title,
          product.category,
          product.description,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchQuery.trim().toLowerCase());
      })
    : searchProducts.slice(0, 5);

  const visibleSuggestions = matchingProducts.slice(0, 5);

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
          <button
            type="button"
            onClick={handleSearch}
              className="rounded-full p-2 text-foreground transition-colors hover:bg-gray-100"
            aria-label="Search products"
          >
            <Search size={20} />
          </button>
          {isLoggedIn ? (
            <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-foreground shadow-sm">
              <UserRound size={18} className="text-primary" />
              <span className="max-w-[140px] truncate font-medium">
                {userName}
              </span>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
                  aria-label="Open admin dashboard"
                >
                  <LayoutDashboard size={14} />
                  <span>Admin Dashboard</span>
                </Link>
              )}
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
          {!isAdmin && (
            <Link
              href="/cart"
              className="relative rounded-full p-2 text-foreground transition-colors hover:bg-gray-100"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-secondary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
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
              <button
                type="button"
                onClick={handleSearch}
                className="flex items-center space-x-2 text-foreground"
                aria-label="Search products"
              >
                <Search size={20} />
                <span>Search</span>
              </button>
              {isLoggedIn ? (
                <div className="flex items-center space-x-2 text-foreground">
                  <UserRound size={20} />
                  <span>{userName}</span>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <LayoutDashboard size={16} />
                      <span>Dashboard</span>
                    </Link>
                  )}
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
                  className="flex items-center space-x-2 text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <UserRound size={20} />
                  <span>Sign in</span>
                </Link>
              )}
              {!isAdmin && (
                <Link
                  href="/cart"
                  className="flex items-center space-x-2 text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingCart size={20} />
                  <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed inset-0 z-60 flex items-start justify-center bg-black/40 px-4 pt-24 backdrop-blur-sm">
          <div
            className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-dialog-title"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="search-dialog-title"
                  className="text-xl font-semibold text-gray-900"
                >
                  Search products
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Search by product name, category, or description.
                </p>
              </div>
              <button
                type="button"
                onClick={closeSearch}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Type what you want to find..."
                  className="h-12 rounded-2xl border-gray-200 pl-10 text-base"
                />
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                <div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                  <span>Instant suggestions</span>
                  {isSearchLoading && <span>Loading</span>}
                </div>

                <div className="max-h-72 space-y-2 overflow-y-auto">
                  {!isSearchLoading && visibleSuggestions.length === 0 && (
                    <p className="px-1 py-6 text-center text-sm text-gray-500">
                      No matching products yet.
                    </p>
                  )}

                  {visibleSuggestions.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        router.push(`/shop?search=${encodeURIComponent(product.title)}`);
                        closeSearch();
                      }}
                      className="flex w-full items-start gap-3 rounded-2xl border border-transparent bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-primary/20 hover:bg-primary/5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                        {product.title.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="truncate font-semibold text-gray-900">
                            {product.title}
                          </h3>
                          <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            {product.category}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                          {product.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeSearch}
                  className="rounded-2xl"
                >
                  Cancel
                </Button>
                <Button type="submit" className="rounded-2xl px-6">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
