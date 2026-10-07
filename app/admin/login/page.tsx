import { Metadata } from "next";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Admin Login | Oakmere Living",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 bg-card rounded-lg border border-border shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-primary mb-2">Staff Access</h1>
          <p className="text-muted-foreground text-sm">Please sign in to the administration portal</p>
        </div>

        <form action={login} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
