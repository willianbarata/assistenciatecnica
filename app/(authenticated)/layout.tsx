import { Sidebar } from "@/components/Sidebar";
import { getSession } from "@/lib/auth";

export default async function AuthenticatedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getSession();
    const role = session?.user?.role || 'USER';

    return (
        <div className="flex min-h-screen">
            <Sidebar role={role} />
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
