"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import axios from "axios"
import Spinner from "@/assets/Spinner"
import { z } from "zod"

import { pupilSchema } from "@/lib/pupilSchema"
import { PupilForm } from "@/components/PupilForm"

type PupilFormValues = z.infer<typeof pupilSchema>

const API_BASE = "http://localhost:6006/api"

const PupilEdit = () => {
  const { pupilId } = useParams({ from: "/pupils/$pupilId/edit" })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<PupilFormValues>({
    resolver: zodResolver(pupilSchema),
    defaultValues: {
      forename: "",
      surname: "",
      email: "",
      dob: "",
      gender: "Male",
      home: { mobile: "", work: "" },
      pickupAddress: { postcode: "", houseNo: "", address: "" },
      homeAddress: { postcode: "", houseNo: "", address: "" },
      licenseType: "No License",
    },
  })

  // fetch pupil data
  const { data: pupil, isLoading } = useQuery({
    queryKey: ["pupil", pupilId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/pupils/${pupilId}`)
      return res.data.data || res.data
    },
  })

  // when query resolves, update the form values
  useEffect(() => {
    if (pupil) {
      form.reset({
        ...pupil,
        dob: pupil.dob ? pupil.dob.split("T")[0] : "",
        gender: pupil.gender || "Male",
        home: pupil.home || { mobile: "", work: "" },
        pickupAddress: pupil.pickupAddress || {
          postcode: "",
          houseNo: "",
          address: "",
        },
        homeAddress: pupil.homeAddress || {
          postcode: "",
          houseNo: "",
          address: "",
        },
        licenseType: pupil.licenseType || "No License",
        allowTextMessaging: pupil.allowTextMessaging ?? false,
        passedTheory: pupil.passedTheory ?? false,
        fott: pupil.fott ?? false,
        fullAccess: pupil.fullAccess ?? false,
        pupilCaution: pupil.pupilCaution ?? false,
        discount: pupil.discount || "0%",
      })
    }
  }, [pupil, form])

  const mutation = useMutation({
    mutationFn: async (values: PupilFormValues) => {
      const payload = {
        ...values,
        dob: values.dob ? new Date(values.dob).toISOString() : undefined,
      }
      console.log("submitting update payload:", payload)
      return await axios.put(`${API_BASE}/pupils/${pupilId}`, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pupils"] })
      navigate({ to: "/pupils" })
    },
    onError: (err: any) => {
      console.error("Mutation Error:", err)
      console.error("Backend response:", err.response?.data)
    },
  })

  if (isLoading) return <div className='h-screen w-full flex justify-center items-center'><Spinner/></div>

  const onSubmit = (values: PupilFormValues) => {
    mutation.mutate(values)
  }

  return (
    <div className=" mx-auto p-4 bg-slate-400">
      <h1 className="text-3xl font-semibold mb-6 text-center">Edit Pupil</h1>
      <PupilForm
        form={form}
        onSubmit={onSubmit}
        isPending={mutation.isPending}
        buttonLabel="Update Pupil"
        disableEmail={true} // keep email locked
      />
    </div>
  )
}

export default PupilEdit
