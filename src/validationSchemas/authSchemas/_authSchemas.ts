import registerConfirmSchema from "./registerConfirmSchema.js";
import registerSchema from "./registerSchema.js";

const authSchemas = {
    register: registerSchema,
    registerConfirm: registerConfirmSchema
};

export default authSchemas;