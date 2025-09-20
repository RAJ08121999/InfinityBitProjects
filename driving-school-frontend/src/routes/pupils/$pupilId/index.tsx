import { createFileRoute } from '@tanstack/react-router'
import PupilView from '@/pages/pupils/PupilView'
import { useQuery } from '@tanstack/react-query'
import Spinner from '@/assets/Spinner'
import { getPupilById } from '@/lib/api'

export const Route = createFileRoute('/pupils/$pupilId/')({
  component: PupilViewRoute,
})

function PupilViewRoute(){
  const { pupilId } = Route.useParams()

  const { data:pupil , isLoading, isError } = useQuery({
    queryKey:['pupil',pupilId],
    queryFn:() => getPupilById(pupilId),
  })

  if(isLoading){
    return <div className='h-screen w-full flex justify-center items-center'><Spinner/></div>
  }

  if(isError || !pupil) {
    return <p className='text-center text-red-500'>Failed to load Pupil</p>
  }

  return <PupilView />
}