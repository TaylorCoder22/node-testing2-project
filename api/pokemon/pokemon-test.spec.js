const request = require('supertest')
const db = require('../../data/db-config')
const server = require('../server')
const Model = require('./pokemon-model')

const pikachu = {name: 'pikachu'}
const charizard = {name: 'charizard'}

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db('pokemon').truncate()
})

afterAll(async () => {
    await db.destroy()
})

test('correct env', () => {
    expect(process.env.DB_ENV).toBe('testing')
})

describe('[POST] testing the create pokemon route', () => {
    test('responds with newly created pokemon', async () => {
        let response
        response = await request(server).post('/').send(charizard)
        expect(response.body).toMatchObject({id: 1, ...charizard})
        response = await request(server).post('/').send(pikachu)
        expect(response.body).toMatchObject({id: 2, ...pikachu})
        expect(response.status).toBe(201)
    })
    test('check if pokemon name is not an empty string', async () => {
        let response
        response = await request(server).post('/').send(charizard)
        const name = response.name
        expect(String(name)).toHaveLength(9)
    })
})

describe('[DELETE] testing the delete route', () => {
    beforeAll(async () => {
        await db('pokemon').insert({name: 'blastoids'})
    })
    test('deleted item is returned when deleted', async () => {
        const blastoids = await db('pokemon').where('id', 1)
        deleted = await request(server).delete(`/${blastoids.id}`)
        expect(deleted).toMatchObject({id: 1, ...blastoids})
    })
})