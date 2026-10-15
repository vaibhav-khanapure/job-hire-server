import z from "zod";

const loginSchema = z.object({
    email: z.email().trim()
});

export default loginSchema;