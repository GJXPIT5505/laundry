import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { users, services, orders, orderItems, payments } from './schema'

export type Env = {
  DB: D1Database
  STORAGE: R2Bucket
}

const app = new Hono<{ Bindings: Env }>()

// Enable CORS for frontend requests
app.use('/api/*', cors())

app.get('/', (c) => {
  return c.text('Welcome to Student Laundry Hub API!')
})

// --- SERVICES ---
app.get('/api/services', async (c) => {
  const db = drizzle(c.env.DB)
  const allServices = await db.select().from(services)
  return c.json(allServices)
})

// --- USERS ---
app.post('/api/users', async (c) => {
  const db = drizzle(c.env.DB)
  const body = await c.req.json()
  
  // Basic validation
  if (!body.name || !body.email) {
    return c.json({ error: 'Name and email are required' }, 400)
  }

  const result = await db.insert(users).values({
    name: body.name,
    email: body.email,
    phone: body.phone,
    role: body.role || 'customer',
    createdAt: new Date(),
  }).returning()

  return c.json(result[0], 201)
})

// --- ORDERS ---
app.post('/api/orders', async (c) => {
  const db = drizzle(c.env.DB)
  const body = await c.req.json()

  // body: { userId, items: [{ serviceId, quantity }], notes, pickupDate, deliveryDate }
  if (!body.userId || !body.items || body.items.length === 0) {
    return c.json({ error: 'Invalid order data' }, 400)
  }

  // Calculate total price based on service prices
  let totalPrice = 0
  const orderItemsData = []

  // Fetch all services to get prices
  const allServices = await db.select().from(services)
  const serviceMap = new Map(allServices.map(s => [s.id, s]))

  for (const item of body.items) {
    const service = serviceMap.get(item.serviceId)
    if (!service) return c.json({ error: `Service ${item.serviceId} not found` }, 400)
    
    const price = service.pricePerUnit * item.quantity
    totalPrice += price
    orderItemsData.push({
      serviceId: item.serviceId,
      quantity: item.quantity,
      price: price
    })
  }

  // Create order
  const orderResult = await db.insert(orders).values({
    userId: body.userId,
    totalPrice: totalPrice,
    pickupDate: body.pickupDate ? new Date(body.pickupDate) : null,
    deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
    notes: body.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning()

  const orderId = orderResult[0].id

  // Create order items
  await db.insert(orderItems).values(
    orderItemsData.map(item => ({
      orderId: orderId,
      ...item
    }))
  )

  return c.json(orderResult[0], 201)
})

app.get('/api/orders/:id', async (c) => {
  const db = drizzle(c.env.DB)
  const orderId = parseInt(c.req.param('id'))

  const orderResult = await db.select().from(orders).where(eq(orders.id, orderId))
  if (orderResult.length === 0) {
    return c.json({ error: 'Order not found' }, 404)
  }

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId))
  
  return c.json({
    ...orderResult[0],
    items
  })
})

app.patch('/api/orders/:id/status', async (c) => {
  const db = drizzle(c.env.DB)
  const orderId = parseInt(c.req.param('id'))
  const body = await c.req.json()

  if (!body.status) {
    return c.json({ error: 'Status is required' }, 400)
  }

  const result = await db.update(orders)
    .set({ status: body.status, updatedAt: new Date() })
    .where(eq(orders.id, orderId))
    .returning()

  if (result.length === 0) {
    return c.json({ error: 'Order not found' }, 404)
  }

  return c.json(result[0])
})

export default app
