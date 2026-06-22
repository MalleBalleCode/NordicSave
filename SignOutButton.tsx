// components/SignOutButton.tsx
//
// Liten Client Component enbart för utloggningsknappen.
// Den måste vara "use client" eftersom signOut() körs i webbläsaren.
// Dashboard-sidan i sig är en Server Component – vi håller client-koden minimal.

"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm font-medium text-muted hover:text-ink transition-colors"
    >
      Logga ut
    </button>
  );
}
