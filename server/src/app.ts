import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import staRouter from './routes/sta';
// import loginRouter from './routes/login';
import pool from './db';

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || '5000');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// if (process.env.ENABLE_AUTH === 'true') {
//   app.use(
//     expressjwt({
//       secret: process.env.JWT_SECRET || 'your-secret-key',
//       algorithms: ["HS256"]
//     }).unless({ path: ["/api/login"] })
//   );
// }

app.use('/api', staRouter);
// app.use('/api', loginRouter);

app.get('/health', (req, res) => {
  res.status(200).send('Service is running normally');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  pool.query('SELECT NOW()')
    .then(() => console.log('Database connection test successful'))
    .catch(err => console.error('Database connection test failed:', err));
});

export default app; 