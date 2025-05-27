import { TopNav } from "@/components/nav";

export default function PlantAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="Plant Assistant" />
      <main className="container mx-auto px-4 py-6 max-w-7xl">{children}</main>
    </>
  );
}