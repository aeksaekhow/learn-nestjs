import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import TaskStatusValidationPipe from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {

  constructor(private tasksService: TasksService) {
  }

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {

    if (Object.keys(filterDto).length !== 0) return this.tasksService.getTasks(filterDto)

    return this.tasksService.getTasks()
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() dto: CreateTaskDto): Task {
    const task = this.tasksService.createTask(dto)
    return task
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Task {
    const task = this.tasksService.deleteTask(id)
    return task
  }

  @Patch('/:id/status')
  updateTaskStatus(@Param('id') id: string, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Task {
    const task = this.tasksService.updateTaskStatus(id, status)
    return task
  }

}
