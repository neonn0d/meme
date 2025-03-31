import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

/**
 * CustomTelegramClient extends the standard TelegramClient but disables
 * the update mechanism to prevent timeout errors in serverless environments
 */
export class CustomTelegramClient extends TelegramClient {
  constructor(
    session: StringSession,
    apiId: number,
    apiHash: string,
    options: any = {}
  ) {
    // Set default options to optimize for serverless environments
    const defaultOptions = {
      connectionRetries: 3,
      maxConcurrentDownloads: 1,
      useWSS: false,
      ...options,
    };

    // Initialize with parent constructor
    super(session, apiId, apiHash, defaultOptions);
  }

  /**
   * Override the connect method to disable updates after connection
   */
  async connect() {
    // Call the original connect method
    const result = await super.connect();
    
    // Disable the update loop - use type assertion to bypass TypeScript checks
    // This is accessing internal properties that aren't in the type definitions
    const client = this as any;
    if (client._updates) {
      // Log that we're disabling updates
      console.log('CustomTelegramClient: Disabling update mechanism for serverless environment');
      
      // Completely disable the update mechanism
      client._updates._runningLoop = false;
      client._updates._pendingUpdates = [];
      client._updates._pendingUpdateCount = 0;
      
      // Replace the update loop method with a no-op function that doesn't throw errors
      client._updates._updateLoop = async () => {
        return Promise.resolve();
      };
      
      // Override the catchUp method to prevent it from calling _updateLoop
      client._updates.catchUp = async () => {
        return Promise.resolve();
      };
      
      // Override the _processUpdate method to be a no-op
      client._updates._processUpdate = () => {};
      
      // Prevent any attempts to start the loop
      client._updates._runLoop = false;
    }
    
    return result;
  }
}
