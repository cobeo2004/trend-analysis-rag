import { queryOptions } from "@tanstack/react-query";

// biome-ignore lint/complexity/noStaticOnlyClass: We need to use a static method to create the query options
export class HelloService {
  static getHello(name: string) {
    return queryOptions({
      queryKey: ["hello", name],
      queryFn: async () => {
        const response = await fetch("/api/hello", {
          method: "POST",
          body: JSON.stringify({ name }),
        });
        return response.json() as Promise<{ message: string }>;
      },
    });
  }
}
