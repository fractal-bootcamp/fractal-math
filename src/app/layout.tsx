import "./globals.css";
import { Providers } from "./providers";
import Navigation from "@/components/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden">
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}

export const metadata = {
  title: "Your App",
  description: "Your App Description",
};
