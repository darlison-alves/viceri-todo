import { PriorityEnum } from "../enums/todo.priority.enum";

export class TodoDTO {
    title: string = "";
    priority: PriorityEnum = PriorityEnum.Low;
}