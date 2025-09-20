import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import { FiArrowLeft } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { getPupilById } from "@/lib/api"
import Spinner from "@/assets/Spinner"


const PupilView = () => {
  const navigate = useNavigate()
  const { pupilId } = useParams({ from: "/pupils/$pupilId/" }) // route param

  const { data:fetchedPupil, isLoading, isError, error } = useQuery({
    queryKey: ["pupil", pupilId],
    queryFn: () => getPupilById(pupilId),
    enabled: !!pupilId, // only run when pupilId exists
  })

  if (isLoading) return <div className='h-screen w-full flex justify-center items-center'><Spinner/></div>
  if (isError) return <p className="text-center text-red-500">{(error as Error).message}</p>

  if (!fetchedPupil) return <p className="text-center">No pupil found</p>

  return (
    <div className="bg-slate-400 min-h-screen p-4">
      <div className="max-w-3xl mx-auto mt-20">
        <Card className="bg-slate-950 text-gray-300">
          <CardHeader className="flex flex-row items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className=" hover:bg-slate-600 transition-colors"
              onClick={() => navigate({ to: "/pupils" })}
            >
              <FiArrowLeft className="h-5 w-5 text-blue-400" />
            </Button>
            <CardTitle className="text-center font-bold text-3xl flex-1">
              {fetchedPupil.forename} {fetchedPupil.surname}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
          <h3 className="font-semibold text-lg text-blue-400">Personal Information</h3>
            <p>
              <strong>Date of Birth:</strong> { " "}
              {new Date (fetchedPupil.dob).toLocaleDateString("en-GB")}
            </p>
            <p>
              <strong>Gender:</strong> {fetchedPupil.gender}
            </p>
            <p>
              <strong>Email:</strong> {fetchedPupil.email || "N/A"}
            </p>
            <p>
              <strong>Mobile:</strong> {fetchedPupil.home?.mobile || "N/A"}
            </p>
            <p>
              <strong>Work:</strong> {fetchedPupil.home?.work || "N/A"}
            </p>

            
            <div>
              <h3 className="font-semibold text-lg text-blue-400">Pickup Address</h3>
              <p>
                <strong>Postcode:</strong> {fetchedPupil.pickupAddress?.postcode || "N/A"}
              </p>
              <p>
                <strong>House No:</strong> {fetchedPupil.pickupAddress?.houseNo || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {fetchedPupil.pickupAddress?.address || "N/A"}
              </p>
            </div>

            {/* Home Address */}
            <div>
              <h3 className="font-semibold text-lg text-blue-400">Home Address</h3>
              <p>
                <strong>Postcode:</strong> {fetchedPupil.homeAddress?.postcode || "N/A"}
              </p>
              <p>
                <strong>House No:</strong> {fetchedPupil.homeAddress?.houseNo || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {fetchedPupil.homeAddress?.address || "N/A"}
              </p>
            </div>

            <p>
              <strong>License Type:</strong> {fetchedPupil.licenseType}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PupilView
