import { promisify } from 'util';
import { createClient, print } from 'redis';

const client = createClient();

client.on('connect', async () => {
  console.log('Redis client connected to the server');
  await main();
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.toString()}`);
});

async function main () {
  function setNewSchool (schoolName, value) {
    client.SET(schoolName, value, print);
  }

  async function displaySchoolValue (schoolName) {
    console.log(await promisify(client.GET).bind(client)(schoolName));
  }

  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
}