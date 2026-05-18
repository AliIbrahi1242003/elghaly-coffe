import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                        Checkout locked
                    </p>
                    <h1 className="mt-3 text-3xl font-bold text-foreground">
                        Sign in to checkout
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                        You need an account before placing an order. Sign in or create a
                        buyer account to continue.
                    </p>
                    <Link
                        href="/login?callbackURL=/checkout"
                        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                    >
                        Sign in to checkout
                    </Link>
                </div>
            </main>
        );
    }

    return <>{children}</>;
}