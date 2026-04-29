import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";
import { maxicloudQueryKeys } from "~/hooks/maxicloud-query/keys";

export const useServicesQuery = () => {
  const { serviceRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.services,
    queryFn: () => serviceRepository.listServices(),
  });
};

export const useServiceQuery = (serviceId: string) => {
  const { serviceRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.service(serviceId),
    enabled: serviceId.length > 0,
    queryFn: () => serviceRepository.getService(serviceId),
  });
};
