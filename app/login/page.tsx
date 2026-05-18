"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      let result;
      if (isSignUp) {
        result = await signUp.email({
          name,
          email,
          password,
        });
      } else {
        result = await signIn.email({
          email,
          password,
          rememberMe,
        });
      }

      setLoading(false);

      if (result.error) {
        alert(result.error.message);
        return;
      }

      const callbackURL = searchParams.get("callbackURL");
      if (callbackURL) {
        router.push(callbackURL);
      } else if ((result.data?.user as any)?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setLoading(false);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          {isSignUp ? "Create an Account" : "Sign In"}
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {isSignUp
            ? "Enter your details to create a new account"
            : "Enter your email below to login to your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {isSignUp && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="password"
              autoComplete="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isSignUp && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember">Remember me</Label>
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button
          variant="link"
          className="text-sm text-gray-500 hover:text-gray-900"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<Loader2 className="animate-spin text-primary" size={32} />}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
