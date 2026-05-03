import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";

export const useAvailableDomains = () => {
  const { domainRepository } = useRepository();
  return useQuery({
    queryKey: QUERY_KEYS.availableDomains,
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
    queryKey: QUERY_KEYS.domainAvailability(input.subdomain, input.rootDomain),
    enabled: input.enabled,
    queryFn: () =>
      domainRepository.checkDomainAvailability({
        subdomain: input.subdomain,
        rootDomain: input.rootDomain,
      }),
  });
};
