"use client";

import { loginAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function LoginPage() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleClickLogin = (formData: FormData) => {
    startTransition(async () => {
      const result = await loginAction(formData);

      if (result?.errorMessage) {
        console.error(result.errorMessage);
        return;
      } else {
        router.push("/upload/telo");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <h1 className="text-center text-2xl pb-4">Login</h1>

      <form action={handleClickLogin} className="flex flex-col gap-4">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          disabled={isPending}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          disabled={isPending}
        />

        <Button disabled={isPending} type="submit">
          Iniciar sesión
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
