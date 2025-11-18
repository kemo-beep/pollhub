import { getServerSession } from "@/lib/auth/get-session"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { RouteHeader } from "./components/RouteHeader"
import { ContestFormContextWrapper } from "./components/ContestFormContextWrapper"

export default async function RoutesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession()

    // Only show sidebar for logged-in users
    if (session?.user) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <ContestFormContextWrapper>
                        <RouteHeader />
                        <div className="flex flex-1 flex-col gap-4 p-4">
                            {children}
                        </div>
                    </ContestFormContextWrapper>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    // For non-authenticated users, render without sidebar
    return <>{children}</>
}

