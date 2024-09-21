import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Task } from "./dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type KanbanBoardProps = {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
};

export function KanbanBoard({ tasks, onUpdateTask }: KanbanBoardProps) {
  const columns: { [key in Task["status"]]: Task[] } = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    Completed: tasks.filter((task) => task.status === "Completed"),
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const task = columns[source.droppableId as Task["status"]][source.index];
    const newTask = {
      ...task,
      status: destination.droppableId as Task["status"],
    };
    onUpdateTask(newTask);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4">
        {Object.entries(columns).map(([status, tasks]) => (
          <div key={status} className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>{status}</CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[200px]"
                    >
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-secondary p-2 mb-2 rounded"
                            >
                              <h3 className="font-semibold">{task.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {task.description}
                              </p>
                              <div className="flex justify-between mt-2 text-xs">
                                <span>{task.priority}</span>
                                <span>
                                  {task.dueDate?.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
