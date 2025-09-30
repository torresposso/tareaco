import { DateTime } from 'luxon';
import { BaseModel, column, beforeCreate, hasMany } from '@adonisjs/lucid/orm';
import { nanoid } from 'nanoid';
import Project from '#models/project';
import type { HasMany } from '@adonisjs/lucid/types/relations';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string | null;

  @column()
  declare email: string;

  @column()
  declare providerId: string;

  @column()
  declare avatarUrl: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @hasMany(() => Project)
  declare projects: HasMany<typeof Project>;

  @beforeCreate()
  static assignId(user: User) {
    user.id = nanoid();
  }
}
