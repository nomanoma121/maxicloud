import { Code, ConnectError } from "@connectrpc/connect";
import { connectClient } from "~/utils/connect";

const FALLBACK_DOMAINS = ["apps.maximum.vc", "internal.maximum.vc"];

export interface IDomainRepository {
  listAvailableDomains(): Promise<string[]>;
  checkDomainAvailability(input: {
    subdomain: string;
    rootDomain: string;
  }): Promise<boolean>;
}

export class DomainRepository implements IDomainRepository {
  async listAvailableDomains(): Promise<string[]> {
    try {
      const { domains } = await connectClient.domain.listAvailableDomains({});
      return domains;
    } catch (error) {
      if (!(error instanceof ConnectError) || error.code !== Code.Unimplemented) {
        throw error;
      }
      return FALLBACK_DOMAINS;
    }
  }

  async checkDomainAvailability(input: {
    subdomain: string;
    rootDomain: string;
  }): Promise<boolean> {
    try {
      const { available } = await connectClient.domain.checkDomainAvailability({
        domain: {
          subdomain: input.subdomain,
          rootDomain: input.rootDomain,
        },
      });
      return available;
    } catch (error) {
      if (!(error instanceof ConnectError) || error.code !== Code.Unimplemented) {
        throw error;
      }
      return true;
    }
  }
}
