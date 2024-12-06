import express from 'express';
import { promisify } from 'util';
import { createClient } from 'redis';

const app = express();
const PORT = 1245;
const client = createClient();
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

function getItemById (id) {
  const item = listProducts.find(obj => obj.itemId === id);
  if (item) {
    return Object.fromEntries(Object.entries(item));
  }
}

function reserveStockById (itemId, stock) {
  return promisify(client.set).bind(client)(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById (itemId) {
  return promisify(client.get).bind(client)(`item.${itemId}`);
}

app.get('/list_products', (_req, res) => res.json(listProducts));

app.get('/list_products/:itemId(\\d+)', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) res.json({ status: 'Product not found' });

  else {
    getCurrentReservedStockById(itemId)
      .then((reserved) => {
        item.currentQuantity = item.initialAvailableQuantity - reserved;
        res.json(item);
      });
  }
});

app.get('/reserve_product/:itemId', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    res.json({ status: 'Product not found' });
    return;
  }
  getCurrentReservedStockById(itemId)
    .then((reserved) => {
      if (reserved >= item.initialAvailableQuantity) {
        res.json({ status: 'Not enough stock available', itemId });
        return;
      }
      reserveStockById(itemId, reserved)
        .then(() => {
          res.json({ status: 'Reservation confirmed', itemId });
        });
    });
});

app.listen(1245, () => {
  Promise
    .all(listProducts.map(item => {
      promisify(client.set).bind(client)(`item.${item.itemId}`, 0);
    }))
    .then(() => console.log(`API available on localhost port ${PORT}`));
});

export default app;