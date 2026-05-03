import { useQuery } from "@tanstack/react-query";
import { maxicloudQueryKeys } from "~/hooks/maxicloud-query/keys";
import { useRepository } from "~/hooks/use-repository";

export const useAvailableDomainsQuery = () => {
  const { domainRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.availableDomains,
    queryFn: () => domainRepository.listAvailableDomains(),
  });
};

export const useDomainAvailabilityQuery = (input: {
  subdomain: string;
  rootDomain: string;
  enabled: boolean;
}) => {
  const { domainRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.domainAvailability(input.subdomain, input.rootDomain),
    enabled: input.enabled,
    queryFn: () =>
      domainRepository.checkDomainAvailability({
        subdomain: input.subdomain,
        rootDomain: input.rootDomain,
      }),
  });
};
