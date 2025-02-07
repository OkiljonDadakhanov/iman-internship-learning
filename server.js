import { Hono } from 'hono';
import { MongoClient } from 'mongodb';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import 'dotenv/config';
import { ObjectId } from 'mongodb';


const app = new Hono();

// Enable CORS
app.use('*', cors());

// MongoDB Connection
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("jobFinder");
const jobsCollection = db.collection("jobs");

// Fetch all jobs
app.get('/api/jobs', async (c) => {
  try {
    const jobs = await jobsCollection.find().toArray();
    return c.json(jobs);
  } catch (error) {
    return c.json({ error: 'Failed to fetch jobs' }, 500);
  }
});

// Fetch a single job by ID
app.get('/api/jobs/:id', async (c) => {
  const id = c.req.param("id");
  try {
    const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
    return job ? c.json(job) : c.json({ error: "Job not found" }, 404);
  } catch (error) {
    return c.json({ error: 'Invalid job ID' }, 400);
  }
});

// Add a new job
app.post('/api/jobs', async (c) => {
  const body = await c.req.json();
  try {
    const result = await jobsCollection.insertOne(body);
    return c.json({ message: "Job added", id: result.insertedId });
  } catch (error) {
    return c.json({ error: 'Failed to add job' }, 500);
  }
});

// Delete a job by ID
app.delete('/api/jobs/:id', async (c) => {
    const id = c.req.param("id");
    try {
      const result = await jobsCollection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0
        ? c.json({ message: "Job deleted" })
        : c.json({ error: "Job not found" }, 404);
    } catch (error) {
      return c.json({ error: 'Invalid job ID' }, 400);
    }
  });
  

// Update a job by ID
app.put('/api/jobs/:id', async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    try {
      const result = await jobsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: body }
      );
      return result.matchedCount > 0
        ? c.json({ message: "Job updated" })
        : c.json({ error: "Job not found" }, 404);
    } catch (error) {
      return c.json({ error: 'Invalid job ID' }, 400);
    }
  });
  

// Start Server
serve(app, { port: 3000 });
console.log("Server running on http://localhost:3000");
