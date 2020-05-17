import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import {v1} from 'uuid'
import CreateTaskDto from './dto/create-task.dto'
import GetTasksFilterDto from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {

  private tasks: Task[] = []


  getTasks(filterDto: GetTasksFilterDto = null): Task[] {

    if (!filterDto) return this.tasks

    return this.tasks.filter(task => {

      let isMatch = true
      if (filterDto.status) {
        isMatch = isMatch && (task.status === filterDto.status)
      }
      if (filterDto.search) {
        isMatch = isMatch && (task.title.includes(filterDto.search) || task.description.includes(filterDto.search))
      }

      return isMatch
    })
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find(task => task.id === id)

    if (!task) throw new NotFoundException(`Task id '${id}' not found`)

    return task
  }

  createTask(createTaskDto: CreateTaskDto): Task {

    const {title, description} = createTaskDto

    const task: Task = {
      id: v1(),
      title,
      description,
      status: TaskStatus.OPEN
    }
    this.tasks.push(task)
    return task
  }

  deleteTask(id: string): Task {
    const index = this.tasks.findIndex(task => task.id === id)
    if (index === -1) throw new NotFoundException(`Task id '${id}' not found`)
    const task = this.tasks[index]
    this.tasks.splice(index, 1)
    return task
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id)
    if (!task)throw new NotFoundException(`Task id '${id}' not found`)
    task.status = status
    return task
  }

}
