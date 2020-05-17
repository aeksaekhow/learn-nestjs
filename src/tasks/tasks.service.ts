import { Injectable, NotFoundException } from '@nestjs/common';
import TaskStatus from './task-status.enum';
import CreateTaskDto from './dto/create-task.dto'
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import TaskEntity from './task.entity';
import TaskRepository from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository) {
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    return this.taskRepository.getTasks(filterDto)
  }

  async getTaskById(id: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({where: {id}})

    if (!task) throw new NotFoundException(`Task id '${id}' not found`)

    return task
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {

    const task = await this.taskRepository.createTask(createTaskDto)
    return task
  }

  async deleteTask(id: number): Promise<void> {
    const deleteResult = await this.taskRepository.delete(id)
    if (deleteResult.affected === 0) throw new NotFoundException(`Task id '${id}' not found`)
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<TaskEntity> {
    const task = await this.getTaskById(id)
    if (!task)throw new NotFoundException(`Task id '${id}' not found`)
    task.status = status
    const savedTask = await task.save()
    return savedTask
  }

}
