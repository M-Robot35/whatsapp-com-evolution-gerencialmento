import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import { getServerAction } from "@/app/actions/getSectionAction"

export default async function DashboardLayout({ children, }: { children: React.ReactNode  }) {
   const serverCheckSession= await getServerAction()

    if(!serverCheckSession || serverCheckSession.role != 'SUPER_ADMIN'){
      return redirect('/admin')
    }    

    return (
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 p-4 items-center">
              {children}
              </div> 
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
  )
}