import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";

import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />

      <body>
        <AppHeader />

        {children}

        <AppFooter />
      </body>
    </html>
  );
}
