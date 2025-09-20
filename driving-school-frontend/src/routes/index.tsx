import Spinner from '@/assets/Spinner'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className=" mx-auto py-10 text-center bg-slate-800 h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6 text-amber-700">Welcome to Driving School</h1>
      <p className="text-gray-200 mb-8">
        Add View Update and Delete Pupils in one place.
      </p>

      <div className="flex justify-center gap-4">
        <a href="/pupils" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          View Pupils
        </a>
        <a href="/pupils/add" className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">
          Add Pupil
        </a>
      </div>
      
      <div className='mt-8'>
        <Spinner/>
      </div>

    </div>
  )
}

