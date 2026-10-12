import { createClient } from 'redis';
import ENV from '../constants/ENV.js';

const redis = createClient({
    url: ENV.REDIS_URL
});

redis.on('connect', () => {
    console.log('Redis connection successful');
});

redis.on('ready', () => {
    console.log('Redis connected');
});

redis.on('reconnecting', () => {
    console.log('Redis reconnecting...');
});

redis.on('end', () => {
    console.log('Redis connection closed');
});

redis.on('error', (err) => {
    console.error('Redis Error:', err);
});

export default redis;