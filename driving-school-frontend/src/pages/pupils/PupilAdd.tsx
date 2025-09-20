"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { PupilForm } from "@/components/PupilForm";
import { pupilSchema } from "@/lib/pupilSchema";
import { usePupilStore } from "@/store/pupilStore";

type PupilFormValues = z.infer<typeof pupilSchema>;

const PupilAdd = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addPupilStore = usePupilStore((state) => state.addPupil);

  const form = useForm<PupilFormValues>({
    resolver: zodResolver(pupilSchema),
    defaultValues: {
      forename: "",
      surname: "",
      dob: "",
      gender: "Male",
      email: "",
      home: { mobile: "", work: "" },
      pickupAddress: { postcode: "", houseNo: "", address: "" },
      homeAddress: { postcode: "", houseNo: "", address: "" },
      licenseType: "No License",
      pupilType: "",
      pupilOwner: "",
      allowTextMessaging: false,
      passedTheory: false,
      fott: false,
      fullAccess: false,
      pupilCaution: false,
      discount: "0%",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: PupilFormValues) => {
      // Format payload to match backend
      const payload = {
        ...values,
        dob: values.dob ? new Date(values.dob).toISOString() : undefined,
        pickupAddress: values.pickupAddress?.postcode ? values.pickupAddress : undefined,
        homeAddress: values.homeAddress?.postcode ? values.homeAddress : undefined,
        pupilType: values.pupilType || undefined,
        pupilOwner: values.pupilOwner || undefined,
      };
      return addPupilStore(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pupils"] });
      form.reset({
        forename: "",
        surname: "",
        dob: "",
        gender: "Male",
        email: "",
        home: { mobile: "", work: "" },
        pickupAddress: { postcode: "", houseNo: "", address: "" },
        homeAddress: { postcode: "", houseNo: "", address: "" },
        licenseType: "No License",
        pupilType: "",
        pupilOwner: "",
        allowTextMessaging: false,
        passedTheory: false,
        fott: false,
        fullAccess: false,
        pupilCaution: false,
        discount: "0%",
      });
      navigate({ to: "/pupils" });
    },
    onError: (err: any) => {
      console.error("Mutation error:", err);
      console.error("Backend response:", err.response?.data);
    },
  });

  const onSubmit = (values: PupilFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className=" mx-auto p-4 bg-slate-400">
      <h1 className="text-3xl font-semibold mb-6 text-center">Add New Pupil</h1>

      <PupilForm
        form={form}
        onSubmit={onSubmit}
        isPending={mutation.isPending}
        buttonLabel="Add Pupil"
        disableEmail={false}
      />
    </div>
  );
};

export default PupilAdd;
