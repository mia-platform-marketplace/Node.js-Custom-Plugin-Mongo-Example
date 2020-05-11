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

  t.afterEach(async() => {
    await removeAllElementFromMyCollection()
  })

  t.tearDown(async() => {
    await fastify.close()
  })

  t.test('POST /greetings', t => {
    t.test('should send a POST with the greetings data', async t => {
      t.plan(2)
      const response = await fastify.inject({
        method: 'POST',
        url: '/greetings',
        payload: {
          from: 'sender',
          to: 'receiver',
        },
      })
      t.equal(response.statusCode, 204)

      t.test('should insert a document', async t => {
        t.plan(4)
        const collection = fastify.mongo.db.collection('mycollection')
        const allDocs = await collection.find({}).toArray()

        t.equal(allDocs.length, 1)
        t.strictSame(allDocs[0].from, 'sender')
        t.strictSame(allDocs[0].to, 'receiver')
        t.strictSame(allDocs[0].type, 'hello')
      })
    })
    t.end()
  })

  t.test('GET /greetings', async t => {
    t.test('retrieve no greetings since the searched user does not exist', async t => {
      t.plan(2)

      const response = await fastify.inject({
        method: 'GET',
        url: '/greetings?from=no-existing-sender',
      })
      t.equal(response.statusCode, 404)
      t.strictSame(response.payload, 'No greetings found')
    })

    t.test('retrieve greetings from a given user', async t => {
      t.plan(2)

      await fastify.mongo.db.collection('mycollection').insertOne({ from: 'sender', type: 'hello', to: 'receiver' })

      const response = await fastify.inject({
        method: 'GET',
        url: '/greetings?from=sender',
      })
      t.equal(response.statusCode, 200)
      t.same(JSON.parse(response.payload), {
        from: 'sender',
        to: 'receiver',
        type: 'hello',
      })
    })

    t.test('error connecting to Mongo using not existing host', async t => {
      t.plan(1)
      const WRONG_MONGODB_URL = `mongodb://wronghost:27017/test`
      t.rejects(setupFastify({
        USERID_HEADER_KEY: 'userid',
        GROUPS_HEADER_KEY: 'groups',
        CLIENTTYPE_HEADER_KEY: 'clienttype',
        BACKOFFICE_HEADER_KEY: 'backoffice',
        MICROSERVICE_GATEWAY_SERVICE_NAME: 'microservice-gateway.example.org',
        MONGODB_URL: WRONG_MONGODB_URL,
      }))
    })
    t.test('error contacting Mongo after close connection', async t => {
      t.plan(1)
      await fastify.mongo.client.close()
      t.rejects(fastify.mongo.db.collection('mycollection').insertOne({ from: 'my-user-id', type: 'hello', to: 'Foo' }))
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
