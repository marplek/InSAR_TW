import express, { Request, Response } from 'express';
import pool from '../db';
import { QueryResult } from 'pg';

const router = express.Router();

interface PointData {
  id: number;
  longitude: number;
  latitude: number;
  avg_data: number;
  error: number;
}

router.get('/class_one', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT id, ST_X(coordinate) as longitude, ST_Y(coordinate) as latitude, avg_data, error
      FROM class_one
    `;
    const result: QueryResult<PointData> = await pool.query(query);

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying class_one data:', err);
    res.status(500).send('Server Error');
  }
});

router.get('/class_two', async (req: Request, res: Response) => {
  try {
    const { west, south, east, north } = req.query;

    let query: string;
    let params: any[] = [];

    if (west && south && east && north) {
      query = `
        SELECT id, ST_X(coordinate) as longitude, ST_Y(coordinate) as latitude, avg_data, error
        FROM class_two
        WHERE ST_Within(coordinate, ST_MakeEnvelope($1, $3, $2, $4, 4326))
        ORDER BY RANDOM()
        LIMIT 10000
      `;
      params = [west, east, south, north];

      const result: QueryResult<PointData> = await pool.query(query, params);

      res.set('Cache-Control', 'public, max-age=300');
      res.json(result.rows);
    } else {
      query = `
        SELECT id, ST_X(coordinate) as longitude, ST_Y(coordinate) as latitude, avg_data, error
        FROM class_two
        ORDER BY RANDOM()
        LIMIT 10000
      `;
      const result: QueryResult<PointData> = await pool.query(query);
      res.json(result.rows);
    }
  } catch (err) {
    console.error('Error querying class_two data:', err);
    res.status(500).send('Server Error');
  }
});

export default router; 