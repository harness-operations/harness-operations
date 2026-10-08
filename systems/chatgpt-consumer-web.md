# ChatGPT (personal web app)

**Documentation reviewed:** 2026-10-08 (UTC). Rolling hosted surface; no immutable build is asserted.

## Reviewed scope

- **Interface:** ChatGPT signed-in personal web chat, search, and uploaded documents.
- **Execution:** OpenAI-hosted application accessed through a web browser.
- **Account and configuration:** Personal account; supported plan, region, model, and file type. Memory requires available personalization controls to be enabled. Normal chats, not custom GPTs, agent actions, or managed workspaces.
- **Catalog identity:** `chatgpt-consumer-web`.

## What you can use it for

ChatGPT combines conversational explanations and drafting with optional tools for finding web information and examining uploaded documents. Its practical distinction here is that the application supplies these interfaces; the visitor need not integrate an API or launch Codex. Supported tools depend on the account and selected mode. [Capabilities overview][s1]

An illustrative starting task: upload a non-sensitive event itinerary, ask for a shorter version, then ask for source-linked travel information. This is a suggested trial, not a task executed for this review. Check both the original document and cited pages before relying on the result.

## Execution and permissions

The reviewed interface is a hosted service, not local inference. Prompts and uploaded content are supplied to that service. Search can reformulate queries and send query information, including an approximate location when relevant, to search providers. The web-search documentation describes that boundary; web lookup is not evidence of browser-control or purchasing authority. [Search][s2]

This entry excludes connected-app access, autonomous actions, custom GPTs, Projects, Codex, and managed workspaces. Their permissions and lifecycle need separate review. No API credentials or third-party integrations are required by this catalog path.

## Context, memory, and retention

Memory can personalize later conversations when the account has the feature enabled. It is selective rather than complete recall. Turning it off does not delete old conversations, and deleting a chat does not necessarily remove a separate saved memory. Review the applicable memory controls and underlying sources separately. [Memory][s3]

Turning off model improvement affects training use of new conversations, not whether ordinary chats remain in history. Feedback can be an exception. Temporary chats are not used for model improvement while temporary and may be retained for safety for up to 30 days. They can use existing personalization unless started unpersonalized; saving one changes it into an ordinary chat. [Data controls][s4]

Chats and files have separate lifetimes. In particular, deleting a conversation does not remove a file separately saved in Library. Deletion schedules also have security, legal, and de-identification exceptions; do not equate a hidden history item with immediate erasure. [Retention][s5]

## Discovery evidence

These are editorial labels for documented uses of this exact application, not performance findings or guarantees for every plan.

| Catalog field and value | Basis and boundary |
| --- | --- |
| `kinds: application` | Hosted conversational product with built-in user tools, not the API. [Overview][s1] |
| `workloads: everyday assistance` | Explanations, drafting, and summarization. [Overview][s1] |
| `workloads: web research` | Source-linked web lookup; not browser automation. [Search][s2] |
| `workloads: document assistance` | Questions and summaries over supported uploads. [Overview][s1] |
| `operational_characteristics: cross-chat-memory` | Selective personalization when available and enabled. [Memory][s3] |

## Limitations and review status

Documentation review only: no authenticated product trial, recall benchmark, deletion test, or integration test was performed. Tool availability, usage limits, and modes can change; no fixed price, version, or quota is asserted. An apparent successful answer does not establish factual correctness, complete document extraction, or an external action. Offline operation, autonomous task recovery, and voice behavior are not assessed here.

## Primary sources

- [ChatGPT capabilities overview][s1]
- [Searching the web with ChatGPT][s2]
- [Memory in ChatGPT][s3]
- [Data controls in ChatGPT][s4]
- [Chat and file retention in ChatGPT][s5]

[s1]: https://help.openai.com/en/articles/9260256-chatgpt-capabilities-overview
[s2]: https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt
[s3]: https://help.openai.com/en/articles/8590148-memory-in-chatgpt
[s4]: https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt
[s5]: https://help.openai.com/en/articles/8983778-chat-and-file-retention-in-chatgpt
