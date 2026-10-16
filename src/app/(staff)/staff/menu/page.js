import MenuManager from "./MenuManager";

export const metadata = { title: "Manage menu · Addis Eats" };

export default function StaffMenuPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Manage menu</h1>
        <p className="text-sm text-gray-600">
          Add dishes, change prices, and mark items sold out.
        </p>
      </header>
      <MenuManager />
    </main>
  );
}