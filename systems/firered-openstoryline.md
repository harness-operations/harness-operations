# FireRed-OpenStoryline

**Subject kind:** agentic application  
**Workload:** conversational video creation and editing  
**Reviewed:** September 30, 2026  
**Repository revision:** `c9e945215586f45c12a61c1951ee9a8e9c43a027`

Primary source:

- [Repository at reviewed revision](https://github.com/FireRedTeam/FireRed-OpenStoryline/tree/c9e945215586f45c12a61c1951ee9a8e9c43a027)

## Operational relevance

FireRed-OpenStoryline shows a creative workload in which the interesting system is broader than a media-generation model.

The application combines conversational planning/editing with media search, script generation, music/voice/font recommendations, rendering/editing infrastructure, reusable skills, and optional generative-video services.

## Native application surfaces

The reviewed repository exposes:

- a command-line conversation interface;
- a web/FastAPI interface;
- an MCP server;
- application agent code and prompts;
- media/editing skills;
- storage/memory and media resources;
- Agent Skills for installation and use from other compatible agents.

## Workload and completion

The application is designed to turn source media plus natural-language direction into an edited video.

Documented capabilities include media search/organization, script/storyline generation, music/voice/font recommendations, conversational refinement, reusable editing skills, and optional AI-generated transition shots.

A successful render is not automatically a successful creative outcome. Mechanical completion, request adherence, asset provenance/licensing, and subjective quality remain separate dimensions.

## External services and cost boundaries

The repository requires API-key configuration for model/service access.

Its AI transition feature is documented as using third-party AIGC video-generation services, with relatively high cost and variable output quality.

The application can therefore coordinate deterministic editing components and remote generative services. Data, credential, and cost boundaries depend on configured providers.

## Independent operation

The repository can run its own CLI or web conversation interface and start its own MCP server. It is therefore useful independently of a coding Harness.

## Invocation through Agent Skills

The repository includes `openstoryline-install` and `openstoryline-use` skills.

It documents direct use from Claude Code when started in the repository root and an experimental Agent Skills installation path for Codex and other compatible agents.

Those are **documented invocation relationships**, not live compatibility tests. The outer coding Harness retains its own session and permission semantics; OpenStoryline retains its media workflow and provider dependencies.

## Artifacts and reuse

Final video plus intermediate media/script/editing artifacts provide durable boundaries.

"Editing skill archiving" illustrates cooperation through reusable workflow knowledge without requiring two live agents to communicate.

## Unknowns and limitations

The top-level material reviewed does not establish generic guarantees for rollback, exactly-once editing effects, session recovery after process loss, or cancellation of already-issued third-party generation requests.

Harness Operations did not run a video workflow, external provider, skill installation, or cross-Harness invocation in this reference entry.
