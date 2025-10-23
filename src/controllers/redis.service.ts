//src/controllers/redis.service.ts
//TODO: create server side redis storage to optimize application 
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

export class RedisService {
  private static instance: Redis;

  public static getInstance(): Redis {
    if (!RedisService.instance) {
      RedisService.instance = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        // Optional: use different DB for development
        db: process.env.NODE_ENV === 'production' ? 0 : 1,
      });

      RedisService.instance.on('error', (err) => {
        console.error('Redis error:', err);
      });

      RedisService.instance.on('connect', () => {
        console.log('✅ Redis connected');
      });
    }
    return RedisService.instance;
  }
}