import { EntityRepository, Repository } from 'typeorm';
import TaskEntity from './task.entity';
import TaskStatus from './task-status.enum';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import UserEntity from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(TaskEntity)
export default class TaskRepository extends Repository<TaskEntity>{

  private logger = new Logger('TaskRepository')

  async createTask(createTaskDto: CreateTaskDto, userEntity: UserEntity): Promise<TaskEntity> {

    const task: TaskEntity = this.create()
    task.title = createTaskDto.title
    task.description = createTaskDto.description
    task.status = TaskStatus.OPEN
    task.user = userEntity

    try {
      await task.save()
    }
    catch (e) {
      this.logger.error(`Failed to create task for user "${userEntity.username}". Data: ${JSON.stringify(createTaskDto)}`, e.stack)
      throw new InternalServerErrorException()
    }

    delete task.user

    return task
  }

  async getTasks(filterDto: GetTasksFilterDto, userEntity: UserEntity): Promise<TaskEntity[]> {
    const {status, search} = filterDto
    const query = this.createQueryBuilder('task')

    query.where('task.userId = :userId', {userId: userEntity.id})

    if (status) {
      query.andWhere('task.status = :status', {status})
    }

    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`})
    }

    try {
      const tasks = await query.getMany()
      return tasks
    }
    catch (e) {
      this.logger.error(`Failed to get tasks for user "${userEntity.username}" `, e.stack)
      throw new InternalServerErrorException()
    }
  }

}