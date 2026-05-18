import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/app/actions/products";

export default async function Shop({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string }>;
}) {
  const products = await getProducts();
  const resolvedSearchParams = await searchParams;
  const searchTerm = resolvedSearchParams?.search?.trim().toLowerCase() ?? "";

  const filteredProducts = searchTerm
    ? products.filter((product) => {
        const searchableText = [product.title, product.category, product.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchTerm);
      })
    : products;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <section className="bg-[#321a12] text-white py-20 relative overflow-hidden pt-24">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/coffee.png')]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop Our Coffee
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our selection of premium beans, brewing tools, and exclusive
            bundles.
          </p>
          {searchTerm && (
            <p className="mt-4 text-sm text-gray-200">
              Showing results for "{resolvedSearchParams?.search?.trim()}"
            </p>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {searchTerm && filteredProducts.length === 0 && (
            <p className="mb-6 text-center text-gray-600">
              No products matched your search.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
