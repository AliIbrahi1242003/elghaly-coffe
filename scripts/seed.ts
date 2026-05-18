import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { db } from "../lib/db";
import { products, productImages, productSizes, productVariants } from "../lib/schema";
import { eq } from "drizzle-orm";
import { seedAdmin } from "./create-admin";

const initialProducts = [
    {
        id: 1,
        title: "Signature Blend",
        price: 250.0,
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=2070&auto=format&fit=crop",
        category: "Coffee Beans",
        description: "Our signature blend combines the best of Arabica and Robusta beans for a rich, full-bodied flavor with notes of chocolate and caramel. Perfect for your daily brew.",
        sizes: [
            { size: "250g", price: 250.0 },
            { size: "500g", price: 480.0 },
            { size: "1kg", price: 900.0 }
        ],
        variants: [
            { name: "Whole Beans" },
            { name: "Turkish Ground" },
            { name: "Espresso Ground" }
        ]
    },
    {
        id: 2,
        title: "Ethiopian Yirgacheffe",
        price: 320.0,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1974&auto=format&fit=crop",
        category: "Single Origin",
        description: "A bright and floral coffee from the birthplace of coffee. Expect distinct notes of jasmine, lemon, and bergamot with a tea-like body.",
        sizes: [
            { size: "250g", price: 320.0 },
            { size: "500g", price: 600.0 }
        ],
        variants: [
            { name: "Whole Beans" },
            { name: "Filter Ground" }
        ]
    },
    {
        id: 3,
        title: "Espresso Roast",
        price: 280.0,
        image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=1974&auto=format&fit=crop",
        category: "Espresso",
        description: "Dark roasted to perfection, this blend delivers a bold and intense flavor profile with a thick crema. Ideal for espresso shots and milk-based drinks.",
        sizes: [
            { size: "250g", price: 280.0 },
            { size: "1kg", price: 1000.0 }
        ],
        variants: [
            { name: "Whole Beans" },
            { name: "Espresso Ground" }
        ]
    },
    {
        id: 4,
        title: "French Press Bundle",
        price: 850.0,
        image: "https://images.unsplash.com/photo-1506372023823-741c83b836fe?q=80&w=2070&auto=format&fit=crop",
        category: "Bundles",
        description: "Everything you need for the perfect French Press brew. Includes a premium French Press, a bag of our coarse-ground Signature Blend, and a measuring scoop.",
        sizes: [],
        variants: []
    },
    {
        id: 5,
        title: "Colombian Supremo",
        price: 290.0,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1974&auto=format&fit=crop",
        category: "Single Origin",
        description: "Balanced and smooth, this Colombian classic offers a sweet acidity with nutty and fruity undertones. A crowd-pleaser for any time of day.",
        sizes: [
            { size: "250g", price: 290.0 }
        ],
        variants: [
            { name: "Whole Beans" }
        ]
    },
    {
        id: 6,
        title: "Hazelnut Delight",
        price: 260.0,
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=2070&auto=format&fit=crop",
        category: "Flavored",
        description: "Premium Arabica beans infused with natural hazelnut flavor. A creamy and nutty treat that pairs perfectly with milk.",
        sizes: [
            { size: "250g", price: 260.0 }
        ],
        variants: [
            { name: "Turkish Ground" }
        ]
    },
    {
        id: 7,
        title: "Chemex Kit",
        price: 1200.0,
        image: "https://images.unsplash.com/photo-1506372023823-741c83b836fe?q=80&w=2070&auto=format&fit=crop",
        category: "Tools",
        description: "Master the art of pour-over coffee with this elegant Chemex kit. Includes a 6-cup Chemex, bonded filters, and a gooseneck kettle.",
        sizes: [],
        variants: []
    },
    {
        id: 8,
        title: "Decaf Roast",
        price: 240.0,
        image: "https://images.unsplash.com/photo-1506372023823-741c83b836fe?q=80&w=2070&auto=format&fit=crop",
        category: "Decaf",
        description: "All the flavor without the caffeine. This Swiss Water Process decaf retains the rich taste of coffee with notes of malt and cocoa.",
        sizes: [
            { size: "250g", price: 240.0 }
        ],
        variants: [
            { name: "Whole Beans" },
            { name: "Filter Ground" }
        ]
    },
];

async function main() {
    console.log("Seeding database...");

    // Seed Products
    for (const product of initialProducts) {
        const { sizes, variants, ...productData } = product;

        // Insert Product
        await db.insert(products).values(productData).onConflictDoUpdate({
            target: products.id,
            set: productData
        });

        // Insert Main Image
        // Check if image exists first to avoid duplicates if running multiple times without clean slate
        // For simplicity in seeding, we'll delete existing relations and re-insert
        await db.delete(productImages).where(eq(productImages.productId, product.id));
        await db.insert(productImages).values({
            productId: product.id,
            url: product.image,
            isMain: true
        });

        // Insert Sizes
        await db.delete(productSizes).where(eq(productSizes.productId, product.id));
        if (sizes && sizes.length > 0) {
            for (const size of sizes) {
                await db.insert(productSizes).values({
                    productId: product.id,
                    ...size
                });
            }
        }

        // Insert Variants
        await db.delete(productVariants).where(eq(productVariants.productId, product.id));
        if (variants && variants.length > 0) {
            for (const variant of variants) {
                await db.insert(productVariants).values({
                    productId: product.id,
                    ...variant
                });
            }
        }
    }

    // Seed Admin
    await seedAdmin();

    console.log("Database seeded!");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
