import { Type } from '@angular/core';
import { IUserTask } from './i-user-task.model';

export class UserTaskInfo {

    ProcessName: string;
    Name: string;
    Version: string;
    TaskType: Type<IUserTask>;

    constructor(process: string, name: string, version: string, taskType: Type<IUserTask>) {
        this.ProcessName = process,
        this.Name = name;
        this.Version = version;
        this.TaskType = taskType;
    }
}
