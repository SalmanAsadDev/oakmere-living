import { Metadata } from "next";
import { login, requestLoginLink } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Admin Login | Oakmere Living",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const query = await searchParams;
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 bg-card rounded-lg border border-border shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-primary mb-2">
            Staff Access
          </h1>
          <p className="text-muted-foreground text-sm">
            Please sign in to the administration portal
          </p>
        </div>

        {query.error && (
          <p role="alert" className="mb-6 border p-4 text-sm leading-6">
            {query.error === "unavailable"
              ? "Sign-in is temporarily unavailable. Please try again later or contact the administrator."
              : query.error === "email"
                ? "Enter a valid email address."
                : "We could not sign you in. Check your details or request an email sign-in link."}
          </p>
        )}
        {query.notice === "link" && (
          <p role="status" className="mb-6 border p-4 text-sm leading-6">
            If this address belongs to an enabled staff account, check its inbox
            for a sign-in link. Open it in this browser. No account or staff
            permission is created by this form.
          </p>
        )}
        <form action={login} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={256}
            />
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <div className="mt-8 border-t pt-6">
          <h2 className="font-serif text-lg">Use an email sign-in link</h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            For existing staff accounts, including first access. No password is
            shared with the development team.
          </p>
          <form action={requestLoginLink} className="mt-4 space-y-3">
            <Label htmlFor="link-email">Staff email</Label>
            <Input
              id="link-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
            <Button type="submit" variant="outline" className="w-full">
              Email a sign-in link
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
