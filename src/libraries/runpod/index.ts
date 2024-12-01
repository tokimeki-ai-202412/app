type CreateJobResult = {
  id: string;
};

export type JobStatusResult = {
  delayTime: number; // Time in milliseconds the job spent in the queue
  executionTime: number; // Time in milliseconds the job spent executing
  id: string; // Unique identifier for the job
  output?: {
    input_tokens: number; // Number of input tokens processed
    output_tokens: number; // Number of output tokens generated
    text: string[]; // Array of generated text responses
    [key: string]: any; // Additional output properties
  };
  status: string; // Job status (e.g., "COMPLETED", "RUNNING", "FAILED")
  [key: string]: any; // Additional response properties
};

export type RunpodClient = {
  createJob: (endpointId: string, data: any) => Promise<CreateJobResult>;
  cancelJob: (endpointId: string, jobId: string) => Promise<void>;
  getJobStatus: (endpointId: string, jobId: string) => Promise<JobStatusResult>;
};

export function CreateRunpod(token: string): RunpodClient {
  async function createJob(
    endpointId: string,
    data: any,
  ): Promise<CreateJobResult> {
    const url = `https://api.runpod.ai/v2/${endpointId}/run`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json(); // Return the JSON result
    } catch (e) {
      throw new Error(`Fetch Error: ${e}`);
    }
  }

  async function cancelJob(endpointId: string, jobId: string): Promise<void> {
    const url = `https://api.runpod.ai/v2/${endpointId}/cancel/${jobId}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }

      console.log(`Job ${jobId} successfully cancelled.`);
    } catch (e) {
      throw new Error(`Fetch Error: ${e}`);
    }
  }

  async function getJobStatus(
    endpointId: string,
    jobId: string,
  ): Promise<JobStatusResult> {
    const url = `https://api.runpod.ai/v2/${endpointId}/status/${jobId}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json(); // Return the JSON result
    } catch (e) {
      throw new Error(`Fetch Error: ${e}`);
    }
  }

  return { createJob, cancelJob, getJobStatus };
}
