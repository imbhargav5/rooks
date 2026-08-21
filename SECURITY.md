# Security policy

## Supported versions

Rooks supports the current major release line. At the time this policy was added, that line is 9.x. Security fixes are published from the latest minor release in the supported major line; older major lines are unsupported.

| Version            | Supported                                        |
| ------------------ | ------------------------------------------------ |
| Latest 9.x minor   | Yes                                              |
| Earlier 9.x minors | Upgrade to the latest 9.x minor to receive a fix |
| 8.x and older      | No                                               |

When a new major becomes current, maintainers update this table as part of the release work.

## Report a vulnerability privately

Do not open a public issue, discussion, or pull request for a suspected vulnerability. Use [GitHub private vulnerability reporting](https://github.com/imbhargav5/rooks/security/advisories/new) so maintainers can investigate and coordinate a fix before disclosure.

Include as much of the following as you can:

- the affected package version and entrypoint;
- the vulnerable behavior and its security impact;
- a minimal reproduction or proof of concept;
- required browser, server-rendering, framework, or build conditions;
- whether the issue is already public or known to another party;
- any suggested mitigation.

Please avoid accessing data you do not own, disrupting services, or publishing exploit details while a report is being investigated.

## What happens next

Maintainers will review the private report, reproduce and assess it, and communicate through the advisory. Timing depends on severity, maintainer availability, and the work needed to release safely; this project does not promise a fixed response or remediation SLA.

When a fix is ready, maintainers publish it from the latest minor release in the supported major line and coordinate the GitHub advisory and release notes. Reporters may be credited if they want attribution.

For bugs without a security impact, usage questions, or feature proposals, follow [SUPPORT.md](./SUPPORT.md).
