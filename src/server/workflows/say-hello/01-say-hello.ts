import { sleep } from "workflow";

export const helloStep = async (name: string) => {
  "use step";
  console.log(`Message from the server: Hello, ${name}!`);
  await sleep("1s");
  return {
    message: `Hello, ${name}!`,
  };
};
