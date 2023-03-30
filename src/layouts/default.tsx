import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />

      {children}

      <AppFooter />
    </>
  );
}
