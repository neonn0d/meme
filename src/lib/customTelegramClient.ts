import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Logger } from 'telegram/extensions/Logger';

// Configure logging
Logger.setLevel('info');

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
      connectionRetries: 5,
      maxConcurrentDownloads: 1,
      useWSS: false,
      requestRetries: 5,
      timeout: 30000, // Increase timeout to 30 seconds
      autoReconnect: true,
      floodSleepThreshold: 60, // Increase flood sleep threshold
      ...options,
    };

    // Initialize with parent constructor
    super(session, apiId, apiHash, defaultOptions);
  }

  /**
   * Override the connect method to handle updates more gracefully
   */
  async connect(): Promise<boolean> {
    try {
      // Call the original connect method with timeout handling
      const result = await Promise.race([
        super.connect(),
        new Promise<boolean>((_, reject) => {
          setTimeout(() => reject(new Error('Connection timeout')), 30000);
        })
      ]) as boolean;
      
      // Disable the update loop - use type assertion to bypass TypeScript checks
      // This is accessing internal properties that aren't in the type definitions
      const client = this as any;
      if (client._updates) {
        // Log that we're disabling updates
        console.log('CustomTelegramClient: Configuring update mechanism for serverless environment');
        
        // Completely disable the update mechanism
        client._updates._runningLoop = false;
        client._updates._pendingUpdates = [];
        client._updates._pendingUpdateCount = 0;
        
        // Replace the update loop method with a more robust version that handles timeouts
        const originalUpdateLoop = client._updates._updateLoop;
        client._updates._updateLoop = async () => {
          try {
            // Only run the update loop if explicitly requested
            if (!client._updates._runningLoop) {
              return Promise.resolve();
            }
            
            // Add timeout to the update loop
            return await Promise.race([
              originalUpdateLoop.call(client._updates),
              new Promise((resolve) => setTimeout(resolve, 15000)) // 15 second timeout
            ]);
          } catch (error: any) {
            console.warn('Update loop error (handled):', error.message);
            return Promise.resolve(); // Continue despite errors
          }
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
    } catch (error: any) {
      console.error('Connection error:', error.message);
      throw error;
    }
  }
}
