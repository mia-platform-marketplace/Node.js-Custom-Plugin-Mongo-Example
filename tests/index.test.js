/*
 * Copyright 2019 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint id-length: 0 */
/* eslint no-shadow: 0 */
/* eslint no-magic-numbers: 0 */
/* eslint no-process-env: 0 */
/* eslint no-use-before-define: 0 */
/* eslint max-nested-callbacks: 0 */
'use strict'

const t = require('tap')
const { MongoClient } = require('mongodb')
const lc39 = require('@mia-platform/lc39')

async function setupFastify(envVariables) {
  const fastify = await lc39('./index.js', {
    logLevel: 'silent',
    envVariables,
  })
  return fastify
}

const MONGODB_URL = `mongodb://${(process.env.MONGO_HOST || 'localhost')}:27017/test`
t.test('%CUSTOM_PLUGIN_SERVICE_NAME%', async t => {
  // silent => trace for enabliing logs
  const fastify = await setupFastify({
    USERID_HEADER_KEY: 'userid',
    GROUPS_HEADER_KEY: 'groups',
    CLIENTTYPE_HEADER_KEY: 'clienttype',
    BACKOFFICE_HEADER_KEY: 'backoffice',
    MICROSERVICE_GATEWAY_SERVICE_NAME: 'microservice-gateway.example.org',
    MONGODB_URL,
  })

  t.tearDown(async() => {
    await fastify.close()
  })

  t.test('POST /greetings', t => {
    t.test('ok', async t => {
      t.plan(2)
      await removeAllElementFromMyCollection()
      const response = await fastify.inject({
        method: 'POST',
        url: '/greetings',
        headers: {
          userid: 'my-user-id',
        },
        payload: {
          who: 'Foo',
        },
      })
      t.equal(response.statusCode, 204)

      t.test('should insert a document', async t => {
        t.plan(4)
        const collection = fastify.mongo.db.collection('mycollection')
        const allDocs = await collection.find({}).toArray()

        t.equal(allDocs.length, 1)
        t.strictSame(allDocs[0].from, 'my-user-id')
        t.strictSame(allDocs[0].to, 'Foo')
        t.strictSame(allDocs[0].type, 'hello')
      })
    })
    t.end()
  })

  t.test('GET /greetings', async t => {
    await removeAllElementFromMyCollection()

    t.test('no greetings found', async t => {
      t.plan(2)

      const response = await fastify.inject({
        method: 'GET',
        url: '/greetings',
        headers: {
          userid: 'no-existing-user',
        },
      })
      t.equal(response.statusCode, 404)
      t.strictSame(response.payload, 'No greetings found')
    })

    t.test('greetings found', async t => {
      t.plan(2)

      await fastify.mongo.db.collection('mycollection').insertOne({ from: 'my-user-id', type: 'hello', to: 'Foo' })

      const response = await fastify.inject({
        method: 'GET',
        url: '/greetings',
        headers: {
          userid: 'my-user-id',
        },
      })
      t.equal(response.statusCode, 200)
      t.same(JSON.parse(response.payload), {
        from: 'my-user-id',
        to: 'Foo',
        type: 'hello',
      })
    })

    t.end()
  })

  t.end()
})

async function removeAllElementFromMyCollection() {
  const client = await MongoClient.connect(MONGODB_URL, { useNewUrlParser: true })
  const db = client.db('test')
  const collection = db.collection('mycollection')
  await collection.deleteMany({})
  return client.close()
}
