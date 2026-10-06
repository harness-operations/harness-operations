# Background and Long-running Execution

**Operational characteristics:** background, long-running, asynchronous, resumable observation  
**Reviewed:** October 5, 2026

Primary source:

- [OpenAI Background mode](https://developers.openai.com/api/docs/guides/background)

## Operational relevance

Long-running execution breaks the assumption that the lifetime of an agent task is the lifetime of the client connection.

The OpenAI Responses API is a useful concrete case because its Background Mode allows a request to continue asynchronously while the caller disconnects and later observes, streams, or cancels the same response.

This is an **execution characteristic**, not by itself a complete workflow engine, scheduler, recurring job system, or autonomous agent architecture.

## Native lifecycle

A background response is created with `background: true`.

The documented lifecycle includes:

- `queued`;
- `in_progress`;
- a terminal response status.

The caller can retrieve the response later and poll while it remains queued or in progress.

The stable operational identity for the retained background execution is the response ID, not the network connection that originally created it.

## Disconnect and resume

Background execution can be combined with streaming when the response is created with both `background` and `stream` enabled.

For that case, OpenAI documents sequence-number cursors so a client that loses the stream can reconnect and continue from a later point rather than starting the work again.

That distinction is operationally important:

- **resume observation** continues reading an existing execution;
- **retry execution** creates or repeats work.

Those must not be treated as equivalent when the work may create external effects.

## Cancellation

The API exposes cancellation for an in-flight background response.

OpenAI documents repeated cancellation as idempotent: later cancel requests return the final Response object.

A cancellation request still should not be interpreted as retroactive rollback of any tool or external effect already completed before cancellation took effect. The documented idempotency of repeated cancel requests applies to the response-cancellation operation; it does not establish exactly-once semantics for downstream tools.

## Retention and privacy boundary

Background execution requires server-side state long enough to support asynchronous operation and polling.

OpenAI documents special retention behavior. Current documentation says background requests may temporarily retain response data for roughly ten minutes to support asynchronous execution and polling even when longer-term storage is disabled; longer retention depends on project settings and the `store` choice.

That means choosing background execution can change the data-retention boundary relative to an otherwise similar synchronous call. The exact retention policy must be evaluated for the project's data-controls configuration rather than inferred from `store=false` alone.

An operator evaluating a background-capable Harness/runtime should therefore ask:

- what state is retained;
- for how long;
- where;
- whether the execution can be resumed;
- whether event history is complete;
- what cancellation actually stops.

## Completion and evidence

A client closing its connection is not evidence that the execution stopped.

Likewise, receiving a terminal response is not by itself proof that every external effect happened exactly once.

Useful evidence includes:

- stable execution/response ID;
- status transitions;
- stream sequence position;
- cancellation request and resulting terminal state;
- tool or downstream-operation records;
- any uncertain effect when a provider/tool response is lost.

## Relationship to Deep Research and coding agents

Long-running research or coding workloads can use background execution, but Background Mode should not be equated with those workloads.

The execution mode answers **how work survives client connectivity and is observed over time**. It does not define the task strategy, research method, coding loop, or quality criteria.

## Evidence and limitations

This entry is documentation-backed.

Harness Operations did not execute a background response, measure retention behavior, test dropped-stream recovery, or verify cancellation against a consequential tool call.
