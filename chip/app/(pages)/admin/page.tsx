import { redirect } from 'next/navigation'
import Loading from '@/components/my-components/loading'
import { getServerAction } from '@/app/actions/getSectionAction'
export default async function Page() {
  const {id, name, email, role, image}= await getServerAction()
  
  if(id){
    return redirect('/admin/dashboard')
  }else{
    return redirect('/auth/login')
  }

  return (
    <div className='min-h-screen w-screen flex justify-center align-middle'>
        <Loading/>
    </div>
  )

  return (    
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>     
  )
}
