interface UrlPolicyConfig {
  allowHosts: Set<string>;
  blockHosts: Set<string>;
}

export interface UrlPolicyResult {
  allowed: boolean;
  reason?: string;
}

function parseHosts(raw: string | undefined): Set<string> {
  if (!raw) {
    return new Set<string>();
  }

  return new Set(
    raw
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter((entry) => entry.length > 0)
  );
}

function isPrivateIpv4(hostname: string): boolean {
  const parts = hostname.split(".").map((value) => Number(value));
  if (parts.length !== 4 || parts.some((value) => Number.isNaN(value) || value < 0 || value > 255)) {
    return false;
  }

  const [a, b] = parts as [number, number, number, number];

  if (a === 10) {
    return true;
  }
  if (a === 192 && b === 168) {
    return true;
  }
  if (a === 172 && b >= 16 && b <= 31) {
    return true;
  }
  if (a === 169 && b === 254) {
    return true;
  }

  return false;
}

function isLoopback(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function hostMatchesRule(hostname: string, rule: string): boolean {
  return hostname === rule || hostname.endsWith(`.${rule}`);
}

export function createUrlPolicyFromEnv(env: NodeJS.ProcessEnv = process.env): UrlPolicyConfig {
  return {
    allowHosts: parseHosts(env.ALLOWED_HOSTS),
    blockHosts: parseHosts(env.BLOCKED_HOSTS)
  };
}

export function validateTargetUrl(rawUrl: string, policy: UrlPolicyConfig): UrlPolicyResult {
  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return { allowed: false, reason: "URL is not valid" };
  }

  if (!["http:", "https:"].includes(target.protocol)) {
    return { allowed: false, reason: "Only http and https URLs are allowed" };
  }

  const hostname = target.hostname.toLowerCase();

  if (isLoopback(hostname) || isPrivateIpv4(hostname) || hostname.endsWith(".local")) {
    return { allowed: false, reason: "Local or private network URLs are not allowed" };
  }

  for (const blocked of policy.blockHosts) {
    if (hostMatchesRule(hostname, blocked)) {
      return { allowed: false, reason: "Target host is blocked by policy" };
    }
  }

  if (policy.allowHosts.size > 0) {
    let allowedByHost = false;
    for (const allowed of policy.allowHosts) {
      if (hostMatchesRule(hostname, allowed)) {
        allowedByHost = true;
        break;
      }
    }

    if (!allowedByHost) {
      return { allowed: false, reason: "Target host is not allowed by policy" };
    }
  }

  return { allowed: true };
}