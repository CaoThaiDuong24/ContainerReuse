import fs from 'fs';
import path from 'path';

const STORAGE_DIR = path.join(__dirname, '../../data');
const REGISTERED_CONTAINERS_FILE = path.join(STORAGE_DIR, 'registered-containers.json');

interface RegisteredContainer {
  id: string;
  userId: number; // NguoiTao
  containerData: any;
  gateOutData: any;
  registeredAt: string;
}

class StorageService {
  private ensureStorageExists() {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
    if (!fs.existsSync(REGISTERED_CONTAINERS_FILE)) {
      fs.writeFileSync(REGISTERED_CONTAINERS_FILE, JSON.stringify([], null, 2));
    }
  }

  private readData(): RegisteredContainer[] {
    this.ensureStorageExists();
    try {
      const data = fs.readFileSync(REGISTERED_CONTAINERS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading storage:', error);
      return [];
    }
  }

  private writeData(data: RegisteredContainer[]): void {
    this.ensureStorageExists();
    try {
      fs.writeFileSync(REGISTERED_CONTAINERS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing storage:', error);
    }
  }

  // Add a registered container
  addRegisteredContainer(userId: number, containerData: any, gateOutData: any): RegisteredContainer {
    const containers = this.readData();
    
    const newContainer: RegisteredContainer = {
      id: `${Date.now()}-${userId}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      containerData,
      gateOutData,
      registeredAt: new Date().toISOString()
    };

    containers.push(newContainer);
    this.writeData(containers);
    
    console.log(`✅ Registered container saved for user ${userId}`);
    return newContainer;
  }

  // Get all registered containers for a specific user
  getRegisteredContainersByUser(userId: number): RegisteredContainer[] {
    const containers = this.readData();
    return containers.filter(c => c.userId === userId);
  }

  // Get all registered containers
  getAllRegisteredContainers(): RegisteredContainer[] {
    return this.readData();
  }

  // Delete a registered container
  deleteRegisteredContainer(id: string): boolean {
    const containers = this.readData();
    const filtered = containers.filter(c => c.id !== id);
    
    if (filtered.length < containers.length) {
      this.writeData(filtered);
      return true;
    }
    return false;
  }
}

export const storageService = new StorageService();
