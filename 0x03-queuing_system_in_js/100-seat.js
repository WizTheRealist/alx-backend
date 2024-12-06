import express from 'express';
import { promisify } from 'util';
import { createQueue } from 'kue';
import { createClient } from 'redis';

const port = 1245;
const app = express();
const queue = createQueue();
const initialSeats = process.env.INITIAL_SEATS_COUNT || 50;
let reservationEnabled = true;
const client = createClient({ name: 'reserve_seat' });

async function reserveSeat (number) {
  return promisify(client.SET).bind(client)('available_seats', number);
}

async function getCurrentAvailableSeats () {
  return promisify(client.GET).bind(client)('available_seats');
}

app.get('/available_seats', (_, res) => {
  getCurrentAvailableSeats()
    .then((numberOfAvailableSeats) => {
      res.json({ numberOfAvailableSeats });
    });
});

app.get('/reserve_seat', (_req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }
  try {
    const job = queue.create('reserve_seat');

    job.on('failed', (err) => {
      console.log(
        `Seat reservation job ${job.id} failed:`,
        err.message || err.toString()
      );
    });
    job.on('complete', () => {
      console.log(`Seat reservation job ${job.id} completed`);
    });
    job.save();
    res.json({ status: 'Reservation in process' });
  } catch {
    res.json({ status: 'Reservation failed' });
  }
});

app.get('/process', (_req, res) => {
  res.json({ status: 'Queue processing' });
  queue.process('reserve_seat', (_job, done) => {
    getCurrentAvailableSeats()
      .then((result) => Number.parseInt(result || 0))
      .then((availableSeats) => {
        reservationEnabled = availableSeats <= 1 ? false : reservationEnabled;
        if (availableSeats >= 1) {
          reserveSeat(availableSeats - 1).then(() => done());
        } else {
          done(new Error('Not enough seats available'));
        }
      });
  });
});

app.listen(port, () => {
  async function resetAvailableSeats () {
    return promisify(client.SET)
      .bind(client)('available_seats', Number.parseInt(initialSeats));
  }
  resetAvailableSeats()
    .then(() => console.log(`API available on localhost port ${port}`));
});

export default app;