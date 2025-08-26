"use client";

import type { SettingsState } from "../SettingsClient";
import { FieldLabel, Select } from "../_components/Field";

export default function LanguageRegionSection({
  state,
  setState,
}: {
  state: SettingsState;
  setState: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <label className="block">
        <FieldLabel>Language</FieldLabel>
        <Select
          className="mt-1"
          value={state.lang}
          onChange={(e) => setState((s) => ({ ...s, lang: e.target.value }))}
        >
          <option className="bg-slatebg">English (India)</option>
          <option className="bg-slatebg">हिन्दी (Hindi)</option>
        </Select>
      </label>

      <label className="block">
        <FieldLabel>Region</FieldLabel>
        <Select
          className="mt-1"
          value={state.region}
          onChange={(e) => setState((s) => ({ ...s, region: e.target.value }))}
        >
          <option className="bg-slatebg">India</option>
        </Select>
      </label>

      <label className="block">
        <FieldLabel>Distance Unit</FieldLabel>
        <Select
          className="mt-1"
          value={state.unit}
          onChange={(e) =>
            setState((s) => ({ ...s, unit: e.target.value as SettingsState["unit"] }))
          }
        >
          <option className="bg-slatebg">Kilometers</option>
          <option className="bg-slatebg">Miles</option>
        </Select>
      </label>
    </div>
  );
}
