const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const mock = false;
const app = express();
const port = 3000;
const user = {
  userName: 'testUser',
  passWord: 'topkHdTcyaOBpm5R',
};
const uri = `mongodb+srv://${user.userName}:${user.passWord}@cluster0.qlf28.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useUnifiedTopology: true });

/**
 * Setting api cors
 */

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

/**
 * Api endpoints
 */

app.get('/api/board', async (req, res) => {
  console.log('GET BOARDs');

  try {
    await client.db('kanban').collection('board').find({}, { projection: { _id: 0 } }).toArray((error, response) => {
      if (error) throw error;

      res.send({
        boards: response,
      });
    });
  } catch (e) {
    if (mock) {
      res.send({
        boards: [
          {
            id: '698d5199-cda3-4438-ad5d-12eb19f47e56',
            name: 'Prvý Board',
            lists: [
              {
                id: '03ceea12-ec86-4159-8010-a3199c2b6a32',
                name: 'TODO',
                items: [
                  {
                    id: 'b513a748-499d-4751-87c6-b67825b1e1cd',
                    name: 'Absolvovať pohovor',
                  },
                  {
                    id: 'ffca0f14-b05d-49c2-81a2-ec1e6ee5dad9',
                    name: 'Podpísať zmluvu',
                  },
                  {
                    id: 'f82b26a2-110a-450f-8c96-a48d0163f0e6',
                    name: 'Nastúpiť do práce',
                  },
                ],
              },
              {
                id: 'ff2c7f71-a0a0-4e07-b9f9-b527786f21a2',
                name: 'In Progress',
                items: [
                  {
                    id: 'd75e9e02-cb75-4879-930f-5adef0748ac0',
                    name: 'Urobiť skúšobný príklad',
                  },
                ],
              },
              {
                id: '722fb2dc-612b-45d9-839b-3f2def44882e',
                name: 'Done',
                items: [],
              },
            ],
          },
          {
            id: 'fce76b89-daeb-41f5-838b-d427cf01c3f9',
            name: 'Druhý board',
          },
        ],
      });
    } else {
      console.log(e);
      res.status(500).send(e);
    }
  }
});

app.get('/api/board/:id', async (req, res) => {
  console.log('GET BOARDs');

  try {
    await client.db('kanban').collection('board').findOne({ id: req.params.id }, { projection: { _id: 0 } }, (error, response) => {
      if (error) throw error;

      res.send(response);
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

app.post('/api/board', async (req, res) => {
  console.log('CREATE BOARD', req.body);
  try {
    if (req.body) {
      await client.db('kanban').collection('board').insertOne(req.body, (error, response) => {
        if (error) throw error;

        res.send(response);
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

app.put('/api/board/:id', async (req, res) => {
  console.log('UPDATE BOARD', req.body, req.params.id);
  try {
    if (req.body) {
      await client.db('kanban').collection('board').findOneAndReplace({ id: req.params.id }, req.body, (error, response) => {
        if (error) throw error;

        res.send(response);
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

app.delete('/api/board/:id', async (req, res) => {
  console.log('DELETE BOARD', req.params.id);

  try {
    client.db('kanban').collection('board').findOneAndDelete({ id: req.params.id }, (error, response) => {
      if (error) throw error;

      res.send(response.value != null);
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

/**
 * Mongo db create connection
 *
 * @returns {Promise<void>}
 */
const connect = async () => {
  await client.connect();

  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  }
};

/**
 * Api Bootstrap function
 * @returns {Promise<void>}
 */
async function main() {
  if (!mock) {
    await connect();
  }

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

main();
