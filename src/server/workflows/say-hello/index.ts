import "server-only";
import { RetryableError, sleep } from "workflow";
import { helloStep } from "./01-say-hello";

export const sayHelloWorkflow = async (name: string) => {
  "use workflow";
  await sleep("3s");
  const message = await helloStep(name);
  if (Math.random() > 0.5) {
    throw new RetryableError("Failed to say hello", {
      retryAfter: "1s",
    });
  }
  return {
    message,
  };
};
