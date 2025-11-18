"use client";

import { useState } from "react";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SignOutButton() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const onSignOut = async () => {
    setIsPending(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsPending(false);
          toast.success("Signed out successfully");
          router.push("/");
        },
        onError: () => {
          setIsPending(false);
          toast.error("Failed to sign out");
        },
      },
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={onSignOut}
      variant="outline"
      className="transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </>
      )}
    </Button>
  );
}
