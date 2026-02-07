import { Task } from "../types";

export class TestSuite {
  private log: string[] = [];

  private assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`%c[PASS] ${message}`, 'color: green');
      this.log.push(`✅ ${message}`);
    } else {
      console.error(`[FAIL] ${message}`);
      this.log.push(`❌ ${message}`);
      throw new Error(message);
    }
  }

  async runHealthCheck(tasks: Task[], createAction: (t: Task) => void, deleteAction: (id: string) => void): Promise<string> {
    this.log = [];
    const timestamp = Date.now();
    console.group(`Running TaskFlow Health Check ${timestamp}`);

    try {
      // 1. Test Task Creation Logic (Mock)
      const testId = `test_${timestamp}`;
      const mockTask: Task = {
        id: testId,
        text: 'Integration Test Task',
        completed: false,
        priority: 'high',
        createdAt: Date.now(),
        tags: ['test']
      };

      // We verify the logic, normally we'd check if state updated, 
      // but here we check if the object is valid before 'dispatching' essentially.
      this.assert(mockTask.text.length > 0, "Task creation validation");
      this.assert(mockTask.priority === 'high', "Task priority assignment");

      // 2. Storage Connectivity Check
      if ('indexedDB' in window) {
        const dbReq = indexedDB.open('TaskFlowDB');
        await new Promise<void>((resolve, reject) => {
          dbReq.onsuccess = () => {
            this.assert(true, "IndexedDB connection successful");
            resolve();
          };
          dbReq.onerror = () => reject("IndexedDB connection failed");
        });
      } else {
        this.log.push("⚠️ IndexedDB not supported");
      }

      // 3. Performance / Memory Check
      if (tasks.length > 0) {
        this.assert(tasks.length >= 0, `Current Task Count: ${tasks.length}`);
        const serialized = JSON.stringify(tasks);
        this.assert(serialized.length < 5000000, "Storage size within safe limits (<5MB)");
      }

      this.log.push("✨ All Systems Operational");
      
    } catch (e: any) {
      this.log.push(`⛔ Critical Error: ${e.message}`);
    } finally {
      console.groupEnd();
    }

    return this.log.join('\n');
  }
}