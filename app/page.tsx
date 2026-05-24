import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { Coffee, ShieldCheck, Truck, Award } from "lucide-react";
import { getProducts } from "@/app/actions/products";

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Navbar />
      <Hero />

      {/* Featured Products */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-white/40 -z-10"></div>
        <div className="container mx-auto px-4">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
                Featured Products
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto mb-6 rounded-full"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our most popular blends and single-origin coffees, loved
                by coffee enthusiasts everywhere.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <FadeIn key={product.id} direction="up" delay={index * 0.1}>
                <ProductCard {...product} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-[#321a12] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/coffee.png')]"></div>
        {/* Decorative gradient orb */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <FadeIn direction="right" className="lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-green-300 rounded-2xl transform translate-x-4 translate-y-4 opacity-50"></div>
                <img
                  src="https://plus.unsplash.com/premium_photo-1733317435318-531c85f0f00a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEzfHxjb2ZmZSUyMGJyZXdpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop"
                  alt="Coffee Brewing"
                  className="rounded-2xl shadow-2xl relative z-10 w-full object-cover h-[500px]"
                />
              </div>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.2} className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Our Passion for Coffee
              </h2>
              <div className="w-20 h-1 bg-primary mb-8 rounded-full"></div>
              
              <p className="text-xl text-gray-300 mb-6 leading-relaxed font-light">
                At Elghaly Coffe, we believe that every cup tells a story. From
                the high-altitude farms where our beans are grown to the careful
                roasting process, we are dedicated to bringing you the finest
                coffee experience.
              </p>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light">
                Our master roasters carefully select each batch to ensure
                consistency and flavor. Whether you prefer a bold espresso or a
                smooth pour-over, we have something for every palate.
              </p>
              <button className="px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-primary/30">
                Read Our Story
              </button>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
