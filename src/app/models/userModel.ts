import { ProjectModel } from "./projectModel";
import { TaskModel } from "./taskModel";

export class UserModel {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    joinDate: Date;
    notificationsEnabled: boolean;
    birthDate?: Date;
    gender?: 'M' | 'F' | null;
    projects: ProjectModel[];
    tasks: TaskModel[];
    sharedWith: UserModel[];
    profileImage?: string;
  
    constructor(
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      joinDate: Date = new Date(),
      notificationsEnabled: boolean = true,
      projects: ProjectModel[] = [],
      tasks: TaskModel[] = [],
      sharedWith: UserModel[] = [],
      _id?: string,
      birthDate?: Date,
      gender?: 'M' | 'F' | null,
      profileImage?: string
    ) {
      this._id = _id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.birthDate = birthDate;
      this.email = email;
      this.gender = gender ?? null;
      this.password = password;
      this.joinDate = joinDate;
      this.notificationsEnabled = notificationsEnabled;
      this.projects = projects;
      this.tasks = tasks;
      this.sharedWith = sharedWith;
      this.profileImage = profileImage;
    }
  

  }
  
