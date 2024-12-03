import { TaskModel } from "./taskModel";

export class ProjectModel {
    _id?: string
    name: string;
    description?: string;
    manager: string;
    linkedTasks: TaskModel[];
    members: string[];
    lastModified: Date;
  
    constructor(
      name: string,
      manager:string,
      lastModified: Date = new Date(),
      description?: string,
      linkedTasks: TaskModel[] = [],
      members:string[] = [],
      _id?: string
    ) {
      this._id = _id;
      this.name = name;
      this.description = description || "";
      this.manager = manager;
      this.linkedTasks = linkedTasks;
      this.members = members;
      this.lastModified = lastModified;
    }
}  