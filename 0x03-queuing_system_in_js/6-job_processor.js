import { createQueue } from 'kue';

const queue = createQueue();

queue.process('push_notification_code', (job, done) => {
  function sendNotification (phoneNumber, message) {
    console.log(
      `Sending notification to ${phoneNumber}, with message: ${message}`
    );
  }
  sendNotification(job.data.phoneNumber, job.data.message);
  done();
});