import { useQuery } from "@tanstack/react-query";
import { HelloService } from "@/services/hello-service";

export const useHello = () => useQuery(HelloService.getHello("Simon"));
