import { createQueue } from 'kue';

const BLACKLISTED_NUMBERS = ['4153518780', '4153518781'];
const queue = createQueue();

queue.process('push_notification_code_2', 2, (job, done) => {
  function sendNotification (phoneNumber, message, job, done) {
    const total = 2; let pending = 2;
    const sendInterval = setInterval(() => {
      if ((total - pending) <= (total / 2)) job.progress(total - pending, total);

      if (BLACKLISTED_NUMBERS.includes(phoneNumber)) {
        done(new Error(`Phone number ${phoneNumber} is blacklisted`));
        clearInterval(sendInterval);
        return;
      }
      if (total === pending) {
        console.log(
          `Sending notification to ${phoneNumber}, with message: ${message}`
        );
      }
      --pending || done();
      pending || clearInterval(sendInterval);
    }, 1000);
  }

  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});