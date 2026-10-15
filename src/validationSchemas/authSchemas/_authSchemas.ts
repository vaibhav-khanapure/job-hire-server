import loginSchema from "./loginSchema.js";
import registerConfirmSchema from "./registerConfirmSchema.js";
import registerSchema from "./registerSchema.js";

const authSchemas = {
    login: loginSchema,
    register: registerSchema,
    registerConfirm: registerConfirmSchema
};

export default authSchemas;