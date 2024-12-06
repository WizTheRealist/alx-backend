import { createClient, print } from 'redis';

const client = createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
  main();
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.toString()}`);
});

function main () {
  const hash = {
    Portland: '50',
    Seattle: '80',
    'New York': '20',
    Bogota: '20',
    Cali: '40',
    Paris: '2'
  };

  for (const [key, value] of Object.entries(hash)) {
    client.hset('HolbertonSchools', key, value, print);
  }

  client.hgetall('HolbertonSchools', (_err, reply) => console.log(reply));
}