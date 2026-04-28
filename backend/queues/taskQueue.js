import Bull from "bull";

const taskQueue = new Bull("taskQueue", {
  redis: { host: "127.0.0.1", port: 6379 }
});

taskQueue.process(async (job) => {
  console.log("Processing job:", job.data);
  // e.g. send email, cleanup old tasks, etc.
});

export default taskQueue;