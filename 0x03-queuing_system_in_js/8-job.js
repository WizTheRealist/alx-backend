import { Queue, Job } from 'kue';

/**
 * It takes into argument jobs (array of objects), and queue (Kue queue)
 * @param {Job[]} jobs in an array
 * @param {Queue} a Kue queue
 */
export default function createPushNotificationsJobs (jobs, queue) {
  if (!(jobs instanceof Array)) throw new Error('Jobs is not an array');

  jobs.forEach((item) => {
    const job = queue.create('push_notification_code_3', item);

    job
      .on('enqueue', () => {
        console.log('Notification job created:', job.id);
      })
      .on('complete', () => {
        console.log('Notification job', job.id, 'completed');
      })
      .on('failed', (err) => {
        console.log('Notification job', job.id, 'failed:', err.message || err.toString());
      })
      .on('progress', (progress, _data) => {
        console.log(`Notification job', ${job.id} ${progress}% complete`);
      });
    job.save();
  });
}