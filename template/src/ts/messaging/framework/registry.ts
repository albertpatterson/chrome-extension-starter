import { BaseRequestSystem } from './base_request_system';
import { Request } from './types';

class RequestSystemManager {
  private requestSystems: Array<BaseRequestSystem<{}, {}>> = [];

  add(requestSystem: BaseRequestSystem<{}, {}>) {
    this.requestSystems.push(requestSystem);
  }

  get<T>(request: Request<T>): BaseRequestSystem<{}, {}> | undefined {
    for (const requestSystem of this.requestSystems) {
      if (requestSystem.canHandle(request)) {
        return requestSystem;
      }
    }
  }
}

export const requestSystemManager = new RequestSystemManager();
