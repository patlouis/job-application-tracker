import { Router, Request, Response } from 'express';
import { connectToDatabase } from '../lib/database';

const router = Router();

/**
 * Get all applications
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const pool = await connectToDatabase();
    const [rows] = await pool.query('SELECT * FROM job_applications ORDER BY created_at DESC');
    res.json(rows);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

/**
 * Get a single application by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const pool = await connectToDatabase();
    const [rows]: any = await pool.query('SELECT * FROM job_applications WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

/**
 * Create a new application
 */
router.post('/', async (req: Request, res: Response) => {
  const { position, company, status } = req.body;

  if (!position || !company || !status) {
    return res.status(400).json({ error: 'position, company, and status are required' });
  }

  try {
    const pool = await connectToDatabase();
    const [result]: any = await pool.query(
      'INSERT INTO job_applications (position, company, status) VALUES (?, ?, ?)',
      [position, company, status]
    );

    res.status(201).json({ id: result.insertId, position, company, status });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

/**
 * Update an application by ID
 */
router.put('/:id', async (req: Request, res: Response) => {
  const { position, company, status } = req.body;

  try {
    const pool = await connectToDatabase();
    const [result]: any = await pool.query(
      'UPDATE job_applications SET position = ?, company = ?, status = ? WHERE id = ?',
      [position, company, status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ message: 'Application updated successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

/**
 * Delete an application by ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const pool = await connectToDatabase();
    const [result]: any = await pool.query('DELETE FROM job_applications WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

export default router;
