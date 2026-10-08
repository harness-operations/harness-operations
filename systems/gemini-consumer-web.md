# Gemini (personal web app)

**Documentation reviewed:** 2026-10-08 (UTC). Rolling hosted surface; no immutable build is asserted.

## Reviewed scope

- **Interface:** Gemini personal web text chats, file analysis, and web research.
- **Execution:** Google-hosted application accessed through a web browser.
- **Account and configuration:** Signed-in personal Google Account, age 18+ for the reviewed memory and Deep Research features; eligible country/language and usage limits. Cross-chat memory requires Keep Activity and Memory on; not Gems, Live, Spark, or work/school accounts.
- **Catalog identity:** `gemini-consumer-web`.

## What you can use it for

Gemini's web application can help with planning, drafts, and summarization. Signed-in users can also provide supported files for questions and summaries. This entry concentrates on an adult personal-account web experience rather than a developer API or a phone's device-assistant permissions. [Getting started][s1] [File analysis][s2]

An illustrative trial: upload a non-sensitive activity schedule, ask for a simpler plan, and investigate a related topic using web sources. Check extracted dates against the file. This is a proposed trial, not a measured success.

## Execution and permissions

Google operates the hosted application and processes submitted content. Direct file upload is distinct from connecting Drive or another Google app; those connections have their own prerequisites and data access. Large files can exceed what the selected model or usage tier can effectively analyze. [File analysis][s2]

Deep Research is a documented web-research path for eligible adults: it proposes a plan, lets the user change it, and searches selected sources after initiation. Google Search is a default source; connected personal sources are a separate choice. Model and usage limits vary. This entry does not assert that memory is used inside every research task or that a task has durable recovery. [Deep Research][s3]

Normal responses can have related source links, but not every response does. Verify the original information rather than interpreting a nearby link as support for every sentence. [Source links][s5]

## Context, memory, and retention

The reviewed cross-chat memory feature requires an adult personal account with Keep Activity and Memory enabled. It is available in the web app but not all modes, including Gems and Live. Deleting chats containing remembered information can affect personalization after a delay. Connected-app sources require separate handling; memory is not a promise of exhaustive recall. [Memory][s4]

Keep Activity, training use, and retention are related but not identical. Google documents human review and service/safety processing, including retention of temporary or activity-off chats for 72 hours. Reviewed data and legal or safety exceptions can last longer. Changing Gemini activity does not delete data held by other services. These are consumer policies, not a claim of Workspace enterprise protections or local-only processing. [Privacy hub][s6]

## Discovery evidence

| Catalog field and value | Basis and boundary |
| --- | --- |
| `kinds: application` | User-facing Gemini web experience. [Getting started][s1] |
| `workloads: everyday assistance` | Planning, drafting, and summarization. [Getting started][s1] |
| `workloads: web research` | Documented research over web sources; no browser-control inference. [Deep Research][s3] |
| `workloads: document assistance` | Supported user uploads, distinct from connected Drive access. [File analysis][s2] |
| `operational_characteristics: cross-chat-memory` | Eligible normal text chats with the required settings enabled. [Memory][s4] |

## Limitations and review status

This is a review of documentation, not an authenticated app test, a privacy audit, or an assessment of result quality. Age, country, language, plan, and settings affect access. A match identifies features within the reviewed application, not a guarantee they compose in every mode. Spark, Gems, Live, browser/device actions, work/school accounts, and third-party connectors are excluded. No fixed price, quota, model version, offline operation, or autonomous recovery guarantee is recorded.

## Primary sources

- [Use Gemini Apps][s1]
- [Upload and analyze files in Gemini Apps][s2]
- [Use Deep Research in Gemini Apps][s3]
- [Memory of past Gemini chats (web)][s4]
- [View related sources and double-check responses][s5]
- [Gemini Apps Privacy Hub][s6]

[s1]: https://support.google.com/gemini/answer/13275745?hl=en
[s2]: https://support.google.com/gemini/answer/14903178?hl=en
[s3]: https://support.google.com/gemini/answer/15719111?hl=en
[s4]: https://support.google.com/gemini/answer/16598469?hl=en&co=GENIE.Platform%3DDesktop
[s5]: https://support.google.com/gemini/answer/14143489?hl=en
[s6]: https://support.google.com/gemini/answer/13594961?hl=en
