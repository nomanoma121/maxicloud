import { connectClient } from "~/utils/connect";

export interface IDomainRepository {
  listAvailableDomains$$key(): readonly ["available-domains"];
  checkDomainAvailability$$key(subdomain: string, rootDomain: string): readonly ["domain-availability", string, string];
  listAvailableDomains(): Promise<string[]>;
  checkDomainAvailability(input: {
    subdomain: string;
    rootDomain: string;
  }): Promise<boolean>;
}

export class DomainRepository implements IDomainRepository {
  listAvailableDomains$$key() {
    return ["available-domains"] as const;
  }

  checkDomainAvailability$$key(subdomain: string, rootDomain: string) {
    return ["domain-availability", subdomain, rootDomain] as const;
  }

  async listAvailableDomains(): Promise<string[]> {
    const { domains } = await connectClient.domain.listAvailableDomains({});
    return domains;
  }

  async checkDomainAvailability(input: {
    subdomain: string;
    rootDomain: string;
  }): Promise<boolean> {
    const { available } = await connectClient.domain.checkDomainAvailability({
      domain: {
        subdomain: input.subdomain,
        rootDomain: input.rootDomain,
      },
    });
    return available;
  }
}
