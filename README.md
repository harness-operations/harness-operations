# Harness Operations

**Find the right way to put AI to work.**

Harness Operations is a practical guide to the tools and capabilities behind AI
agents. Learn what is possible, understand trade-offs, compare reviewed interfaces,
and find options that fit what you want to do.

It is not a prescribed architecture, a maturity model, or a universal product ranking.

## Start exploring

- [Explore capabilities](https://harness-operations.com/capabilities/) — practical examples and questions to investigate.
- [Help me choose](https://harness-operations.com/choose/) — three questions and an explained, unranked shortlist.
- [Browse reviewed systems](systems/) — concrete tools, applications, and components in their native terms.
- [Compare evidence](comparisons/methodology.md) — scoped observations, review dates, sources, and limitations.

The chooser filters the canonical [Systems index](systems/index.json). It does not
use a model, score products, infer unsupported capabilities, or save/send answers.
Missing catalog coverage means we need more evidence—not that no suitable tools exist.

## What is a harness?

A harness is the software around an AI model that gives it tools, context, and a
way to get work done. Different tools suit different goals. Applications, models,
tool interfaces, runtimes, and frameworks can help explain those differences;
including them does not make them interchangeable products.

Capability guides are a map of possibilities, not a checklist every system should satisfy.
Optional [operating arrangements](systems/operating-arrangements.md),
[patterns](patterns/), and [standards and boundaries](reference/standards.md)
provide deeper reading. Earlier design material is [archived](reference/README.md)
for historical links and provenance; it no longer defines the project direction.

## Evidence and scope

Coverage is selective. Entries identify the reviewed interface and deployment
boundary, version or revision where available, review date, sources, and limitations.
Documentation/source review is not a live product test. Capability coverage,
performance, model quality, and interoperability are different questions.

No universal lifecycle, required implementation schema, protocol, registry, SDK,
security grade, or conformity assessment is implied by this project.

## Website and development

The site lives in [`site/`](site/) and renders canonical content from the same
checkout. Substantive work begins in [GitHub Issues](https://github.com/harness-operations/harness-operations/issues)
and changes are reviewed through pull requests. Content, discovery rules, tests,
and website changes are reviewed together.

Published releases remain immutable. New work must not reinterpret earlier evidence.
CI validates canonical data, executable examples, interface smoke tests, discovery
rules, the static build, links, and browser behavior.

- [Contribution guide](CONTRIBUTING.md)
- [Release process](RELEASING.md)
- [Releases](https://github.com/harness-operations/harness-operations/releases)

## License

Content and code are licensed under the [Apache License 2.0](LICENSE).
