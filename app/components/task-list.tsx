import { useState } from "react";
import { Task } from "./dashboard";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TaskListProps = {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
};

export function TaskList({ tasks, onEditTask, onDeleteTask }: TaskListProps) {
  const [sortBy, setSortBy] = useState<keyof Task>("dueDate");
  const [filterStatus, setFilterStatus] = useState<Task["status"] | "All">(
    "All"
  );
  const [filterPriority, setFilterPriority] = useState<
    Task["priority"] | "All"
  >("All");

  const filteredAndSortedTasks = tasks
    .filter(
      (task) =>
        (filterStatus === "All" || task.status === filterStatus) &&
        (filterPriority === "All" || task.priority === filterPriority)
    )
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        const dueDateA = a?.dueDate?.getTime() ?? 0;
        const dueDateB = b?.dueDate?.getTime() ?? 0;
        return dueDateA - dueDateB;
      }
      return a?.[sortBy]?.localeCompare(b?.[sortBy] ?? "") ?? 0;
    });

  return (
    <div>
      <div className="mb-4 flex gap-4">
        <Select onValueChange={(value) => setSortBy(value as keyof Task)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) =>
            setFilterStatus(value as Task["status"] | "All")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) =>
            setFilterPriority(value as Task["priority"] | "All")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>{task.dueDate?.toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditTask(task)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteTask(task.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
