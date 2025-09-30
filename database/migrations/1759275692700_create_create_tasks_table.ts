import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'tasks';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('title').notNullable();
      table.text('description').nullable();
      table.boolean('completed').defaultTo(false);
      table.integer('project_id').unsigned().notNullable();

      table.timestamp('created_at');
      table.timestamp('updated_at');

      table.foreign('project_id').references('projects.id').onDelete('CASCADE');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
