import { drizzle as Drizzle } from 'drizzle-orm/node-postgres';
import ENV from '../../constants/ENV.js';

const drizzle = Drizzle(ENV.POSTGRES_URL);

export default drizzle;