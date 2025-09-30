import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import Project from '#models/project';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare title: string;

  @column()
  declare description: string | null;

  @column()
  declare completed: boolean;

  @column()
  declare projectId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>;
}
