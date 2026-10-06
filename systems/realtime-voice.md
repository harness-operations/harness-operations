# Realtime Voice

**Area:** realtime voice and multimodal conversation  
**Operational characteristics:** realtime, streaming, interruptible  
**Reviewed:** October 5, 2026

This entry compares two materially different runtime placements for realtime conversational agents:

- OpenAI Realtime API as a hosted stateful realtime session/runtime;
- Pipecat as an application-hosted open framework/runtime for realtime voice and multimodal agents.

Primary sources:

- [OpenAI Realtime API](https://developers.openai.com/api/docs/guides/realtime)
- [OpenAI Realtime with tools](https://developers.openai.com/api/docs/guides/realtime-mcp)
- [Pipecat repository at reviewed revision](https://github.com/pipecat-ai/pipecat/tree/baf1f16896f2914207abebd794233166cd031c59)
- [Pipecat documentation](https://docs.pipecat.ai/)

## Operational relevance

Realtime voice changes the execution model.

A conventional request/response agent can often treat one model turn as a bounded unit. A live voice agent instead manages a continuous session in which audio arrives while the agent may be speaking, tools may execute during the conversation, the user can interrupt output, and transport latency affects whether the interaction is usable.

The important operational concerns therefore include:

- turn detection and conversational state;
- interruption / barge-in;
- partial audio already delivered to a user;
- transport and reconnection;
- first-audio and tool-call latency;
- concurrent input/output;
- tool authority during a live session;
- session termination versus cancellation of an individual action.

Realtime execution is an **execution characteristic**, not a maturity level or cooperation pattern.

## OpenAI Realtime API

OpenAI documents the Realtime API as a stateful speech-to-speech and multimodal session surface.

A typical browser voice-agent path uses:

1. an application server to create an ephemeral client secret;
2. a frontend `RealtimeSession`;
3. WebRTC in the browser or WebSocket on the server;
4. a realtime agent/session that handles audio turns, tools, interruptions, and handoffs.

The session maintains conversation state and is designed for low-latency interaction with barge-in and natural turn taking.

### Tool execution ownership

OpenAI distinguishes two important tool paths:

- **function tools** — the application receives the function call and executes the business logic;
- **remote MCP tools** — the Realtime API can connect to and invoke the remote MCP server.

Those paths have different trust boundaries. A realtime session being able to call a tool does not mean OpenAI, the client application, and the tool server share one authority or evidence model.

### Interruption is not rollback

Barge-in can stop or truncate generated output, but already delivered audio or already completed external tool effects remain real. A request to **stop speaking** is also not the same operation as a request to **cancel the user's underlying task**; backend task state must be handled separately.

Operational evidence should therefore distinguish:

- generated audio;
- audio actually delivered;
- interruption time;
- tool request;
- tool completion;
- any external effect that committed before the interruption.

## Pipecat

Pipecat describes itself as an open-source Python framework for realtime voice and multimodal conversational agents.

Its architecture composes transports, AI services, processors, and conversation pipelines. It can support one agent or multiple specialist pipelines and can run with different speech, model, transport, and deployment providers.

The reviewed repository revision is:

`baf1f16896f2914207abebd794233166cd031c59`

### Where the loop lives

Unlike a hosted model-platform session, a Pipecat application owns the surrounding Python process and configures the pipeline.

The operational boundary therefore depends on the selected:

- transport;
- speech-to-text / speech-to-speech service;
- model provider;
- text-to-speech service;
- tool/application logic;
- deployment environment.

A Pipecat application can be local or remote while still depending on external realtime model or media services.

### Frames and pipelines

Pipecat's frame/pipeline model makes streaming state explicit. Audio, text, control signals, and other data move through processors rather than being reduced to one final request/response object.

That makes pipeline ordering, backpressure, cancellation, interruption, and processor failure part of the agent runtime.

## Completion and lifecycle

Realtime conversational systems often do not have one obvious "task completed" event.

Relevant lifecycle boundaries can include:

- transport connected/disconnected;
- session created/closed;
- user speech started/stopped;
- agent speech started/stopped;
- interruption;
- tool call started/completed;
- handoff;
- explicit hangup or application termination.

A conversation ending normally, a transport dropping, and a user interrupting one utterance are different outcomes.

## Relationship to text Harnesses

Realtime voice can be hosted inside a broader application or delegated to/from another agent, but those are separate composition choices.

The realtime transport/session should not automatically inherit the lifecycle, approval, or persistence semantics of a separate Harness simply because both use the same model provider or Agents SDK. The reviewed Realtime API surface is treated here as a hosted execution/runtime surface rather than automatically as a complete Harness.

## Evidence and limitations

This entry is documentation/source backed.

Harness Operations did not establish a live audio session, measure latency, exercise barge-in, execute a realtime tool call, or test reconnect behavior.

Pipecat behavior is highly configuration-dependent; this entry describes the framework/runtime shape rather than claiming identical semantics across every transport and provider.
