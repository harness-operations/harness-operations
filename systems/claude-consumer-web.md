# Claude (personal web app)

**Documentation reviewed:** 2026-10-08 (UTC). Rolling hosted surface; no immutable build is asserted.

## Reviewed scope

- **Interface:** Claude signed-in personal web chat, web search, and file uploads.
- **Execution:** Anthropic-hosted application accessed through a web browser.
- **Account and configuration:** Personal Free, Pro, or Max account; supported model and file format within usage limits. Current memory experience enabled for normal chats outside projects. Not Claude Code, Cowork, or organizational accounts.
- **Catalog identity:** `claude-consumer-web`.

## What you can use it for

The consumer web chat can discuss uploaded material and answer everyday questions using web sources when useful. The search feature retrieves information and returns citations, while file uploads supply material for analysis. These are distinct from Claude Code sessions or Cowork execution. [Web search][s1] [Uploads][s2]

An illustrative trial: provide a non-sensitive club newsletter, ask which dates need attention, and ask Claude to check a public event page. Inspect the newsletter and the cited page yourself. No such product trial was performed in this documentation review.

## Execution and permissions

This scope is the hosted personal web application. It uses submitted messages and files; selecting a file is not permission to operate the whole computer. External connectors, browser control, and local or cloud Cowork tasks are outside this entry.

The current search documentation distinguishes a newer experience that searches automatically when helpful from the older search toggle. Do not assume every user sees the same settings. Search and URL retrieval consume usage; a citation is a route to checking a claim, not proof the claim is correct. [Web search][s1]

File support is format- and size-dependent. In particular, text extraction and visual understanding are not equivalent across document types; spreadsheet handling can require additional enabled capabilities. Check the upload guide rather than assuming every embedded diagram is read. [Uploads][s2]

## Context, memory, and retention

For the current personal-account experience, memory stores individual topics that can inform later chats. It is distinct from searching past chats, which has separate paid-plan eligibility. Turning memory off for a single chat and deleting saved topics are different controls. Deleting a conversation does not automatically delete its related topics. This review uses the current memory section, not the legacy summary behavior described later on the same page. [Memory][s3]

Incognito is another mode: it omits chat history and memory, does not use existing memories, and is not used for training, but has default 30-day retention. Profile preferences may still apply. The current documentation also warns that incognito in the new experience cannot create files or run code; do not inherit normal-chat features into it. [Incognito][s4]

Consumer model-improvement choices are separate from history and memory. The policy describes opt-in training, safety-related processing, and feedback exceptions. It is not the policy for commercial API or organizational use. [Consumer training][s5]

## Discovery evidence

| Catalog field and value | Basis and boundary |
| --- | --- |
| `kinds: application` | User-facing web chat with its own search and upload interfaces. [Search][s1] [Uploads][s2] |
| `workloads: everyday assistance` | Conversational information gathering and discussing supplied material. [Search][s1] [Uploads][s2] |
| `workloads: web research` | Search and source-linked responses, not browser control. [Search][s1] |
| `workloads: document assistance` | Supported uploaded-document analysis. [Uploads][s2] |
| `operational_characteristics: cross-chat-memory` | Current memory topics for later normal chats when enabled. [Memory][s3] |

## Limitations and review status

No authenticated workflow, deletion, memory-quality, or interoperability tests were run. This is not a claim of unrestricted plan availability or error-free extraction. The ordinary web-chat scope deliberately excludes Projects, the separately cataloged coding coordinator, API behavior, and device actions. A paused response, a saved conversation, and a recoverable background task are not treated as equivalent capabilities.

## Primary sources

- [Enable and use web search][s1]
- [Upload files to Claude][s2]
- [Chat search and memory in Claude][s3]
- [Use incognito chats][s4]
- [Consumer model-training policy][s5]

[s1]: https://support.claude.com/en/articles/10684626-enable-and-use-web-search
[s2]: https://support.claude.com/en/articles/8241126-upload-files-to-claude
[s3]: https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context
[s4]: https://support.claude.com/en/articles/12260368-use-incognito-chats
[s5]: https://privacy.claude.com/en/articles/10023580-is-my-data-used-for-model-training
