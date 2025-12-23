import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const documents = sqliteTable('documents', {
	id: text('id')
		.primaryKey()
		.$default(() => crypto.randomUUID()),
	title: text('title').notNull(),
	code: text('code').unique().notNull(),
	editorPassword: text('editor_password').notNull(),
	viewerPassword: text('viewer_password'),
	content: text('content').notNull().default('◊'),
	createdAt: text('created_at')
		.notNull()
		.$default(() => new Date().toISOString()),
	updatedAt: text('updated_at')
		.notNull()
		.$default(() => new Date().toISOString())
		.$onUpdate(() => new Date().toISOString())
});

export const accounts = sqliteTable('accounts', {
	id: text('id')
		.primaryKey()
		.$default(() => crypto.randomUUID()),
	username: text('username').unique().notNull(),
	password: text('password').notNull(),
	documents: text('documents').notNull().unique().default(''),
	createdAt: text('created_at')
		.notNull()
		.$default(() => new Date().toISOString()),
	updatedAt: text('updated_at')
		.notNull()
		.$default(() => new Date().toISOString())
		.$onUpdate(() => new Date().toISOString())
});

export const logs = sqliteTable('logs', {
	id: text('id')
		.primaryKey()
		.$default(() => crypto.randomUUID()),
	dateTime: text('date_time')
		.notNull()
		.$default(() => new Date().toISOString()),
	userAgent: text('user_agent'),
	action: text('action').notNull(),
	info: text('info').notNull(),
	success: integer('success').notNull().default(1),
	error: text('error').default('no error')
});
