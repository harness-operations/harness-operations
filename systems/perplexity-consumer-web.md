# Perplexity (personal web app)

**Documentation reviewed:** 2026-10-08 (UTC). Rolling hosted surface; no immutable build is asserted.

## Reviewed scope

- **Interface:** Perplexity personal web search and conversations with uploaded files.
- **Execution:** Perplexity-hosted application accessed through a web browser.
- **Account and configuration:** Personal account; search mode, file support, and limits depend on plan. Ordinary search/file conversations only, not Computer, Comet, mobile assistant actions, Sonar API, or Enterprise.
- **Catalog identity:** `perplexity-consumer-web`.

## What you can use it for

Perplexity's personal web interface turns questions into web searches and conversational, source-linked answers. It can also discuss supported uploaded files. This makes it a starting point for everyday information gathering and document questions, rather than a substitute for its API or a computer-control agent. [Overview][s1] [Files][s2]

An illustrative trial: ask a public-information question, open the cited pages, then upload a non-sensitive document to compare with the findings. Treat the generated synthesis as something to verify. This review did not execute that trial or compare answer quality against other products.

## Execution and permissions

The application is hosted. Messages and selected uploads enter the service; no local-inference claim follows from opening it in a browser. Search retrieves web information, while uploaded-file discussions have a separate source context. Neither establishes permission to control the user's desktop or transact with another service. [Overview][s1] [Files][s2]

Search modes and file limits depend on plan. This scope excludes Computer, Comet, mobile assistant actions, Sonar API, organizational accounts, and connected personal data. It does not inherit their tools, guarantees, or privacy policies.

## Context, data controls, and retention

The upload guide describes follow-up questions within a session, which is not proof of memory across unrelated conversations. It also distinguishes uploaded-file retention from conversational context: later answers can refer to earlier exchanges even after an upload expires. **Cross-chat memory is unassessed in this review, not recorded as unsupported.** No memory tag is supplied to the chooser. [Files][s2]

For personal Free, Pro, and Max accounts, AI Data Retention is documented as enabled by default. Turning it off is a forward-looking training opt-out, not deletion of previously collected training data or a stop to all service processing. The enterprise default is different and is not used to characterize these accounts. [Data collection][s3]

Review sharing controls before sharing a conversation or its files. The upload-privacy page and consumer data-collection policy address different questions; the former is not treated here as a blanket exemption from the latter. Account deletion and stored search/profile data have another documented retention process, rather than an immediate-erasure promise. [Upload privacy][s4] [Retention][s5]

## Discovery evidence

| Catalog field and value | Basis and boundary |
| --- | --- |
| `kinds: application` | User-facing conversational search product. [Overview][s1] |
| `workloads: everyday assistance` | Everyday information questions and follow-up discussion. [Overview][s1] |
| `workloads: web research` | Web retrieval and cited synthesis, not browser automation. [Overview][s1] |
| `workloads: document assistance` | Questions about supported uploads in the reviewed session. [Files][s2] |

The absence of an optional memory field records this review's evidence limit. Selecting the memory interest can therefore omit this entry without implying the product lacks that feature.

## Limitations and review status

Primary-documentation review only; no authenticated consumer trial, deletion test, source-quality benchmark, or safety certification. Marketing descriptions of reliable sources are not treated as measured accuracy. Check citations, document extraction, account settings, and present availability. This entry does not assert a specific price, quota, model build, offline mode, or guarantee of recovery after interruption.

## Primary sources

- [What is Perplexity?][s1]
- [Typing a question versus uploading a file or image][s2]
- [Data Collection at Perplexity][s3]
- [Security and privacy with file uploads][s4]
- [Search history and personal-information retention][s5]

[s1]: https://www.perplexity.ai/help-center/en/articles/10352155-what-is-perplexity
[s2]: https://www.perplexity.ai/help-center/en/articles/10354939-what-s-the-difference-between-typing-a-question-and-uploading-a-file-or-image
[s3]: https://www.perplexity.ai/help-center/en/articles/11564572-data-collection-at-perplexity
[s4]: https://www.perplexity.ai/help-center/en/articles/10354810-security-and-privacy-with-file-uploads
[s5]: https://www.perplexity.ai/help-center/en/articles/10354873-how-long-does-perplexity-retain-my-search-history-profile-data-and-personal-information
