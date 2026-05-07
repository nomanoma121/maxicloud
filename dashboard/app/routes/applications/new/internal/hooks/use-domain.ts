import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";

export const useAvailableDomains = () => {
  const { domainRepository } = useRepository();
  return useQuery({
    queryKey: domainRepository.listAvailableDomains$$key(),
    queryFn: () => domainRepository.listAvailableDomains(),
  });
};

export const useDomainAvailability = (input: {
  subdomain: string;
  rootDomain: string;
  enabled: boolean;
}) => {
  const { domainRepository } = useRepository();
  return useQuery({
    queryKey: domainRepository.checkDomainAvailability$$key(input.subdomain, input.rootDomain),
    enabled: input.enabled,
    queryFn: () =>
      domainRepository.checkDomainAvailability({
        subdomain: input.subdomain,
        rootDomain: input.rootDomain,
      }),
  });
};
