import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  phone: text('phone'),
  role: text('role').notNull().default('customer'), // 'customer' or 'admin'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const services = sqliteTable('services', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), // e.g. "Wash & Fold", "Dry Cleaning"
  description: text('description'),
  pricePerUnit: real('price_per_unit').notNull(), // e.g. price per kg or per item
  unit: text('unit').notNull().default('kg'), // 'kg', 'item'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  status: text('status').notNull().default('pending'), // 'pending', 'collected', 'washing', 'ready', 'delivered'
  totalPrice: real('total_price').notNull().default(0),
  pickupDate: integer('pickup_date', { mode: 'timestamp' }),
  deliveryDate: integer('delivery_date', { mode: 'timestamp' }),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  serviceId: integer('service_id').references(() => services.id).notNull(),
  quantity: real('quantity').notNull(), // e.g. 5 (kg) or 2 (items)
  price: real('price').notNull(), // Price at the time of order
});

export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  amount: real('amount').notNull(),
  status: text('status').notNull().default('pending'), // 'pending', 'paid', 'failed'
  paymentMethod: text('payment_method'), // 'cash', 'transfer'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
