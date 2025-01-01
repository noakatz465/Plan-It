import { TaskModel } from "./taskModel";

export class ProjectModel {
    _id?: string
    name: string;
    description?: string;
    managerID: string;
    LinkedTasks?: TaskModel[];
    members: string[];
    lastModified: Date;
  
    constructor(
      name: string,
      managerID:string,
      lastModified: Date = new Date(),
      description?: string,
      LinkedTasks: TaskModel[] = [],
      members:string[] = [],
      _id?: string
    ) {
      this._id = _id;
      this.name = name;
      this.description = description || "";
      this.managerID = managerID;
      this.LinkedTasks = LinkedTasks;
      this.members = members;
      this.lastModified = lastModified;
    }
}  