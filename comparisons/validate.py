#!/usr/bin/env python3
import json
from collections import defaultdict
from pathlib import Path
import sys

from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parent
SCHEMA_PATH = ROOT / "schema.json"
CANONICAL_PATH = ROOT / "data" / "systems.json"
VALIDATION_CASES = sorted((ROOT.parent / "tests" / "comparisons").glob("*.json"))

URL_REQUIRED_EVIDENCE = {
    "primary_documentation",
    "source_code",
    "release_note",
    "live_test",
    "operator_report",
}
EXECUTED_EVIDENCE = {"live_test", "synthetic_test"}


def load(path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def unique_ids(items, label, path):
    ids = [item["id"] for item in items]
    duplicates = sorted({item_id for item_id in ids if ids.count(item_id) > 1})
    if duplicates:
        raise ValueError(f"{path}: duplicate {label} ids: {', '.join(duplicates)}")


def scope_key(observation):
    scope = observation["scope"]
    return (
        observation["system_id"],
        scope["interface"],
        scope["version"],
        scope["deployment_mode"],
        scope.get("platform"),
        scope.get("plan"),
        scope.get("configuration"),
    )


def validate_evidence(evidence, owner_id, path):
    for item in evidence:
        evidence_type = item["type"]
        result = item.get("result")

        if evidence_type in URL_REQUIRED_EVIDENCE and not item.get("url"):
            raise ValueError(
                f"{path}: {owner_id} evidence type {evidence_type} requires a URL"
            )

        if evidence_type in EXECUTED_EVIDENCE:
            if result not in {"pass", "fail", "mixed"}:
                raise ValueError(
                    f"{path}: {owner_id} executed evidence {evidence_type} "
                    f"requires pass/fail/mixed result"
                )
        elif result not in {None, "not_tested"}:
            raise ValueError(
                f"{path}: {owner_id} documentary evidence {evidence_type} "
                f"must use not_tested or omit result"
            )


def validate_references(data, path):
    capability_ids = {item["id"] for item in data["capabilities"]}
    system_ids = {item["id"] for item in data["systems"]}

    unique_ids(data["capabilities"], "capability", path)
    unique_ids(data["systems"], "system", path)
    unique_ids(data["observations"], "observation", path)
    unique_ids(data["integrations"], "integration", path)

    seen_cells = set()
    scopes = defaultdict(set)

    for observation in data["observations"]:
        if observation["capability_id"] not in capability_ids:
            raise ValueError(
                f"{path}: observation {observation['id']} references unknown capability "
                f"{observation['capability_id']}"
            )
        if observation["system_id"] not in system_ids:
            raise ValueError(
                f"{path}: observation {observation['id']} references unknown system "
                f"{observation['system_id']}"
            )

        key = (*scope_key(observation), observation["capability_id"])
        if key in seen_cells:
            raise ValueError(
                f"{path}: duplicate capability cell for "
                f"{observation['system_id']} {observation['scope']} "
                f"{observation['capability_id']}"
            )
        seen_cells.add(key)
        scopes[scope_key(observation)].add(observation["capability_id"])

        if observation["finding"] == "not_applicable":
            if observation["mechanism"] != "not_applicable":
                raise ValueError(
                    f"{path}: {observation['id']} not_applicable finding requires "
                    f"not_applicable mechanism"
                )
        elif observation["mechanism"] == "not_applicable":
            raise ValueError(
                f"{path}: {observation['id']} uses not_applicable mechanism "
                f"for finding {observation['finding']}"
            )

        validate_evidence(observation["evidence"], observation["id"], path)

    # Every published interface/version row is complete across the canonical
    # capability set. Unknown and not_applicable are valid values; omission is not.
    for key, observed_capabilities in scopes.items():
        missing = sorted(capability_ids - observed_capabilities)
        extra = sorted(observed_capabilities - capability_ids)
        if missing or extra:
            system_id, interface, version, deployment_mode, platform, plan, configuration = key
            details = []
            if missing:
                details.append(f"missing capabilities: {', '.join(missing)}")
            if extra:
                details.append(f"unknown capabilities: {', '.join(extra)}")
            raise ValueError(
                f"{path}: incomplete comparison row for {system_id} / {interface} / "
                f"{version} / {deployment_mode} / platform={platform!r} / "
                f"plan={plan!r} / configuration={configuration!r}: {'; '.join(details)}"
            )

    for integration in data["integrations"]:
        for side in ("source", "target"):
            system_id = integration[side]["system_id"]
            if system_id not in system_ids:
                raise ValueError(
                    f"{path}: integration {integration['id']} {side} references unknown system "
                    f"{system_id}"
                )
        validate_evidence(integration["evidence"], integration["id"], path)


def main():
    schema = load(SCHEMA_PATH)
    validator = Draft202012Validator(schema, format_checker=FormatChecker())

    targets = [CANONICAL_PATH, *VALIDATION_CASES]
    failed = False

    for path in targets:
        data = load(path)
        errors = sorted(validator.iter_errors(data), key=lambda error: list(error.path))
        if errors:
            failed = True
            for error in errors:
                location = ".".join(str(part) for part in error.path) or "<root>"
                print(f"{path}: {location}: {error.message}", file=sys.stderr)
            continue

        try:
            validate_references(data, path)
        except ValueError as error:
            failed = True
            print(error, file=sys.stderr)
            continue

        print(f"valid: {path.relative_to(ROOT.parent)}")

    if failed:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
