import { Router } from 'express';

const tokenRouter = Router();

tokenRouter.post('/generate-access-token');

export default tokenRouter;