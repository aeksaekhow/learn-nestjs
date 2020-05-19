import { Injectable, NotFoundException } from '@nestjs/common';
import TaskStatus from './task-status.enum';
import CreateTaskDto from './dto/create-task.dto'
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import TaskEntity from './task.entity';
import TaskRepository from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from '../auth/user.entity';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository) {
  }

  async getTasks(filterDto: GetTasksFilterDto, userEntity: UserEntity): Promise<TaskEntity[]> {
    return this.taskRepository.getTasks(filterDto, userEntity)
  }

  async getTaskById(id: number, userEntity: UserEntity): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({where: {id, user: userEntity}})

    if (!task) throw new NotFoundException(`Task id '${id}' not found`)

    return task
  }

  async createTask(createTaskDto: CreateTaskDto, userEntity: UserEntity): Promise<TaskEntity> {

    const task = await this.taskRepository.createTask(createTaskDto, userEntity)
    return task
  }

  async deleteTask(id: number, userEntity: UserEntity): Promise<void> {
    const deleteResult = await this.taskRepository.delete({id, user: userEntity})
    if (deleteResult.affected === 0) throw new NotFoundException(`Task id '${id}' not found`)
  }

  async updateTaskStatus(id: number, status: TaskStatus, userEntity: UserEntity): Promise<TaskEntity> {
    const task = await this.getTaskById(id, userEntity)
    task.status = status
    await task.save()
    return task
  }

}
