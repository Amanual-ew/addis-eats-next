import { z } from "zod";

export const DELIVERY_AREAS = [
  "Ayat",
  "Arabsa",
  "Bole",
  "Mexico",
  "Megenagna",
  "CMC",
  "Gerji",
  "Kazanchis",
  "Piassa",
  "4 Kilo",
];

export const orderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  phone: z
    .string()
    .trim()
    .regex(/^09\d{8}$/, "Enter a valid Ethiopian phone number"),

  area: z
    .string()
    .trim()
    .min(1, "Please select a delivery area")
    .refine((value) => DELIVERY_AREAS.includes(value), {
      message: "Invalid delivery area",
    }),

  items: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]),
        name: z.string().min(1),
        price: z.number().nonnegative(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Cart is empty"),
});