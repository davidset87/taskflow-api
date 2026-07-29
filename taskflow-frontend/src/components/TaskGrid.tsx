import { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { taskService } from "../services/taskService";
import type { Task, CreateTaskDto, UpdateTaskDto } from "../types/task";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const STATUS_OPTIONS = ["Todo", "InProgress", "Done"];

export default function TaskGrid() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [newTask, setNewTask] = useState<CreateTaskDto>({
    title: "",
    description: "",
  });

  const [editTask, setEditTask] = useState<UpdateTaskDto>({
    title: "",
    description: "",
    status: "Todo",
  });

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreate() {
    try {
      await taskService.create(newTask);
      setNewTask({ title: "", description: "" });
      setShowCreateDialog(false);
      await loadTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }

  function handleEdit(task: Task) {
    setSelectedTask(task);
    setEditTask({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setShowEditDialog(true);
  }

  async function handleUpdate() {
    if (!selectedTask) return;
    try {
      await taskService.update(selectedTask.id, editTask);
      setShowEditDialog(false);
      await loadTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await taskService.delete(id);
      await loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }

  const StatusCellRenderer = (params: ICellRendererParams) => {
    const colors: Record<string, string> = {
      Todo: "#64748b",
      InProgress: "#f59e0b",
      Done: "#22c55e",
    };
    return (
      <span style={{
        background: colors[params.value] || "#ccc",
        color: "white",
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 12,
      }}>
        {params.value}
      </span>
    );
  };

  const ActionCellRenderer = (params: ICellRendererParams) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center", height: "100%" }}>
      <button
        onClick={() => handleEdit(params.data as Task)}
        style={{ background: "#3b82f6", color: "white", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer" }}
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete((params.data as Task).id)}
        style={{ background: "#ef4444", color: "white", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer" }}
      >
        Delete
      </button>
    </div>
  );

  const columnDefs: ColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "status", headerName: "Status", width: 130, cellRenderer: StatusCellRenderer },
    {
      field: "createdAt", headerName: "Created", width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    { headerName: "Actions", width: 160, cellRenderer: ActionCellRenderer },
  ];

  const dialogStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 1000
  };

  const cardStyle: React.CSSProperties = {
    background: "white", borderRadius: 8, padding: "2rem",
    minWidth: 400, display: "flex", flexDirection: "column", gap: "1rem"
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px 12px", border: "1px solid #e2e8f0",
    borderRadius: 4, fontSize: 14, width: "100%", boxSizing: "border-box"
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1 style={{ margin: 0 }}>TaskFlow 🚀</h1>
        <button
          onClick={() => setShowCreateDialog(true)}
          style={{ background: "#3b82f6", color: "white", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 14 }}
        >
          + New Task
        </button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
          <AgGridReact
            rowData={tasks}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      )}

      {/* Create Dialog */}
      {showCreateDialog && (
        <div style={dialogStyle}>
          <div style={cardStyle}>
            <h2 style={{ margin: 0 }}>New Task</h2>
            <input
              style={inputStyle}
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowCreateDialog(false)}
                style={{ padding: "8px 16px", borderRadius: 4, border: "1px solid #e2e8f0", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleCreate}
                style={{ padding: "8px 16px", borderRadius: 4, background: "#3b82f6", color: "white", border: "none", cursor: "pointer" }}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {showEditDialog && (
        <div style={dialogStyle}>
          <div style={cardStyle}>
            <h2 style={{ margin: 0 }}>Edit Task</h2>
            <input
              style={inputStyle}
              placeholder="Title"
              value={editTask.title}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Description"
              value={editTask.description}
              onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
            />
            <select
              style={inputStyle}
              value={editTask.status}
              onChange={(e) => setEditTask({ ...editTask, status: e.target.value as "Todo" | "InProgress" | "Done" })}
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowEditDialog(false)}
                style={{ padding: "8px 16px", borderRadius: 4, border: "1px solid #e2e8f0", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleUpdate}
                style={{ padding: "8px 16px", borderRadius: 4, background: "#3b82f6", color: "white", border: "none", cursor: "pointer" }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}