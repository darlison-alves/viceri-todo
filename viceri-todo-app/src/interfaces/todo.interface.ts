import { PriorityEnum } from "../app/enums/priority.enum";

export interface Task {
    id?: number;
    title: string;
    done: boolean;
    priority: PriorityEnum
}