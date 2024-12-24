import ErrorPage from "@/app/(site)/error-page/page";
import { Providers } from "./(site)/providers";

export default function NotFoundPage() {
  return (
    <Providers>
      <ErrorPage />
    </Providers>
  );
}
