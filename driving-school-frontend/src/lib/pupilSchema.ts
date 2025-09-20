import { z } from "zod"

export const genderOptions = ["Male", "Female", "Others"] as const
export const licenseOptions = ["No License", "Provisional", "Full License"] as const

export const pupilSchema = z.object({
  forename: z
    .string()
    .min(2, "First name is required")
    .max(50, "First name can't exceed 50 characters"),

  surname: z
    .string()
    .min(3, "Last name is required")
    .max(50, "Last name can't exceed 50 characters"),

  dob: z
  .string()
  .refine((val) => {
    const date = new Date(val);
    if(isNaN(date.getTime())) return false;
    const age = new Date().getFullYear()-date.getFullYear();
    return age>=16 && age <=100;
  },{message: "Invalid Date",}),

  gender: z.enum(genderOptions, {
    message: "Gender must be Male, Female or Others",
  }),

  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
    

  home: z
    .object({
      mobile: z
        .string()
        .regex(
          /^\+?\d{1,4}?[\s.-]?\(?\d{1,5}?\)?[\s.-]?\d{1,5}[\s.-]?\d{1,9}$/,
          "Invalid mobile number format"
        )
        .optional()
        .or(z.literal("")),
      work: z
        .string()
        .regex(
          /^\+?\d{1,4}?[\s.-]?\(?\d{1,5}?\)?[\s.-]?\d{1,5}[\s.-]?\d{1,9}$/,
          "Invalid work number format"
        )
        .optional()
        .or(z.literal("")),
    })
    .default({mobile:"",work:""}),
    
    pickupAddress:z
    .object({
      postcode: z.string().optional().default(""),
      houseNo: z.string().optional().default(""),
      address: z.string().optional().default(""),
    })
    .default({ postcode: "", houseNo: "", address: "" }),

    homeAddress:z
    .object({
      postcode: z.string().optional().default(""),
      houseNo: z.string().optional().default(""),
      address: z.string().optional().default(""),
    })
    .default({ postcode: "", houseNo: "", address: "" }),

  licenseType: z
    .enum(licenseOptions, {
      message: "License type can only be No License, Provisional, Full License",
    })
    .default("No License"),

    pupilType: z.string().optional().default(""),
    pupilOwner: z.string().optional().default(""),


    allowTextMessaging: z.boolean().default(false),
    passedTheory: z.boolean().default(false),
    fott: z.boolean().default(false),
    fullAccess: z.boolean().default(false),
    pupilCaution: z.boolean().default(false),
    discount: z.string().default("0%"),
})

export type Pupil = z.infer<typeof pupilSchema>
