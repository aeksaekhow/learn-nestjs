import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import TaskStatus from './task-status.enum';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import TaskStatusValidationPipe from './pipes/task-status-validation.pipe';
import TaskEntity from './task.entity';

@Controller('tasks')
export class TasksController {

  constructor(private tasksService: TasksService) {
  }

  @Get()
  async getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    return await this.tasksService.getTasks(filterDto)
  }

  @Get('/:id')
  async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
    return await this.tasksService.getTaskById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(@Body() dto: CreateTaskDto): Promise<TaskEntity> {
    const task = await this.tasksService.createTask(dto)
    return task
  }

  @Delete('/:id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.tasksService.deleteTask(id)
  }

  @Patch('/:id/status')
  async updateTaskStatus(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<TaskEntity> {
    const task = await this.tasksService.updateTaskStatus(id, status)
    return task
  }

}
