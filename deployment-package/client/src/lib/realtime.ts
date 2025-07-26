// Real-time updates for order management
export class RealtimeOrderManager {
  private static instance: RealtimeOrderManager;
  private subscribers: Map<string, (data: any) => void> = new Map();
  private pollInterval: NodeJS.Timeout | null = null;
  private isPolling = false;

  static getInstance() {
    if (!RealtimeOrderManager.instance) {
      RealtimeOrderManager.instance = new RealtimeOrderManager();
    }
    return RealtimeOrderManager.instance;
  }

  subscribe(key: string, callback: (data: any) => void) {
    this.subscribers.set(key, callback);
    if (!this.isPolling) {
      this.startPolling();
    }
  }

  unsubscribe(key: string) {
    this.subscribers.delete(key);
    if (this.subscribers.size === 0) {
      this.stopPolling();
    }
  }

  private startPolling() {
    this.isPolling = true;
    this.pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/admin/orders');
        if (response.ok) {
          const orders = await response.json();
          this.subscribers.forEach((callback) => callback(orders));
        }
      } catch (error) {
        console.error('Real-time polling error:', error);
      }
    }, 5000); // Poll every 5 seconds
  }

  private stopPolling() {
    this.isPolling = false;
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }
}