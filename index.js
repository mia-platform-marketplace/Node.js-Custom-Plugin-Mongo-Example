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
/* eslint require-await: 0 */
'use strict'

const fastifyMongodb = require('fastify-mongodb')
const customService = require('@mia-platform/custom-plugin-lib')({
  type: 'object',
  required: ['MONGODB_URL'],
  properties: {
    MONGODB_URL: { type: 'string' },
  },
})

module.exports = customService(async function index(service) {
  service.register(fastifyMongodb, {
    url: service.config.MONGODB_URL,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  service.addRawCustomPlugin('GET', '/greetings', async function handler(req, reply) {
    const cursor = this.mongo.db.collection('mycollection').find({ from: req.query.from })

    cursor.toArray((error, docs) => {
      if (error) {
        throw (new Error('fatal error'))
      }
      if (docs.length === 0) {
        reply.code(404).send('No greetings found')
        return
      }
      reply.code(200)
        .send({
          from: docs[0].from,
          to: docs[0].to,
          type: docs[0].type,
        })
    })
  }, {
    querystring: {
      type: 'object',
      required: ['from'],
      properties: {
        from: {
          type: 'string',
        },
      },
    },
  })

  service.decorate('GREETING_TYPE', {
    HELLO: 'hello',
  })
  service.addRawCustomPlugin('POST', '/greetings', async function handler(req, reply) {
    const { from, to } = req.body
    await this.mongo.db.collection('mycollection').insertOne({
      from,
      to,
      type: this.GREETING_TYPE.HELLO,
    })
    reply.code(204)
  }, {
    body: {
      type: 'object',
      required: ['from', 'to'],
      properties: {
        from: {
          type: 'string',
        },
        to: {
          type: 'string',
        },
      },
    },
  })
})

