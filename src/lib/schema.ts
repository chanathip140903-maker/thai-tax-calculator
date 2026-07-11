import { z } from 'zod';

export const incomeSchema = z.object({
  type40_1: z.number().min(0).default(0),
  type40_2: z.number().min(0).default(0),
  type40_3: z.number().min(0).default(0),
  type40_4a: z.number().min(0).default(0),
  type40_4b: z.number().min(0).default(0),
  type40_5: z.number().min(0).default(0),
  type40_6: z.number().min(0).default(0),
  isMedicalProfession: z.boolean().default(false),
  type40_7: z.number().min(0).default(0),
  type40_8: z.number().min(0).default(0),
  withholdingTax: z.number().min(0).default(0),
});

export const allowancesSchema = z.object({
  spouse: z.boolean().default(false),
  children_1: z.number().min(0).default(0),
  children_2_plus: z.number().min(0).default(0),
  parents: z.number().min(0).max(4).default(0), // max 4 legally (2 self, 2 spouse), but usually max 2 if spouse no income. Keep simple.
  disabled: z.number().min(0).default(0),
  lifeInsurance: z.number().min(0).default(0),
  healthInsurance: z.number().min(0).default(0),
  parentsHealthInsurance: z.number().min(0).default(0),
  pensionInsurance: z.number().min(0).default(0),
  providentFund: z.number().min(0).default(0),
  ssf: z.number().min(0).default(0),
  rmf: z.number().min(0).default(0),
  homeLoanInterest: z.number().min(0).default(0),
  socialSecurity: z.number().min(0).default(0),
  educationDonation: z.number().min(0).default(0),
  generalDonation: z.number().min(0).default(0),
});

export const formSchema = z.object({
  income: incomeSchema,
  allowances: allowancesSchema,
});

export type TaxFormValues = z.infer<typeof formSchema>;
