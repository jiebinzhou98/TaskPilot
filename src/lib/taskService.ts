import { v4 as uuidv4 } from "uuid"

export interface Task {
  id: string
  title: string
  completed: boolean
  category: string
  due_date: string | null
  priority: "Low" | "Medium" | "High"
  createdAt: string
}

// ⛔ 不要在模块顶层调用 localStorage
// const deviceId = getDeviceId()
// const storageKey = `tasks-${deviceId}`

// ✅ 改成函数延迟调用
function getStorageKey(): string {
  let id = localStorage.getItem("taskpilot_device_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("taskpilot_device_id", id)
  }
  return `tasks-${id}`
}

export const TaskService = {
  load(): Task[] {
    const data = localStorage.getItem(getStorageKey())
    return data ? JSON.parse(data) : []
  },

  save(tasks: Task[]) {
    localStorage.setItem(getStorageKey(), JSON.stringify(tasks))
  },

  add(task: Task) {
    const tasks = this.load()
    this.save([...tasks, task])
  },

  update(id: string, updates: Partial<Task>) {
    const tasks = this.load().map((t) =>
      t.id === id ? { ...t, ...updates } : t
    )
    this.save(tasks)
  },

  delete(id: string) {
    const tasks = this.load().filter((t) => t.id !== id)
    this.save(tasks)
  },

  clear() {
    localStorage.removeItem(getStorageKey())
  },

  clearOldCompleted(days: number = 7) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    const tasks = this.load().filter((task) => {
      const createdAt = new Date(task.createdAt)
      return !(task.completed && createdAt < cutoff)
    })
    this.save(tasks)
  },
}
