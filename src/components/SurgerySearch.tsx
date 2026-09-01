"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  formatSurgeryLabel,
  searchSurgeries,
} from "@/lib/surgeries";
import type { SurgeryReference } from "@/lib/surgeries";
import { getSurgeryById } from "@/lib/surgeries";

interface Props {
  selectedSurgeryId?: string;
  onSelect: (surgery: SurgeryReference) => void;
  onClear?: () => void;
}

export function SurgerySearch({ selectedSurgeryId, onSelect, onClear }: Props) {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsId = `${listboxId}-listbox`;
  const selected = selectedSurgeryId
    ? getSurgeryById(selectedSurgeryId)
    : undefined;

  const [query, setQuery] = useState(selected ? formatSurgeryLabel(selected) : "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (selected) {
      setQuery(formatSurgeryLabel(selected));
    }
  }, [selected]);

  const results = searchSurgeries(query);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        if (selected) setQuery(formatSurgeryLabel(selected));
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selected]);

  const selectSurgery = (surgery: SurgeryReference) => {
    onSelect(surgery);
    setQuery(formatSurgeryLabel(surgery));
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      selectSurgery(results[activeIndex].surgery);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const showDropdown = open && query.trim().length > 0 && !selected;

  return (
    <div className="clinical-field surgery-search" ref={containerRef}>
      <label className="clinical-field__label" htmlFor={`${listboxId}-input`}>
        Chirurgie
      </label>
      <div className="surgery-search__field">
        <input
          ref={inputRef}
          id={`${listboxId}-input`}
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={controlsId}
          autoComplete="off"
          placeholder="Rechercher (ex. PTH, prothèse de hanche)…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (selected && onClear) onClear();
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {selected && onClear && (
          <button
            type="button"
            className="btn btn-ghost surgery-search__clear"
            onClick={() => {
              onClear();
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            Effacer
          </button>
        )}
      </div>
      {selected && (
        <p className="clinical-field__hint">
          Risque hémorragique : <strong>{selected.bleedingRisk}</strong>
          {selected.source ? ` · ${selected.source}` : ""}
        </p>
      )}
      {showDropdown && (
        <ul id={controlsId} role="listbox" className="med-search__results">
          {results.length === 0 ? (
            <li className="med-search__empty">Aucune chirurgie trouvée</li>
          ) : (
            results.map((result, index) => (
              <li key={result.surgery.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className="med-search__option"
                  data-active={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSurgery(result.surgery)}
                >
                  <span className="med-search__option-name">
                    {formatSurgeryLabel(result.surgery)}
                  </span>
                  <span className="med-search__option-meta">
                    Risque hémorragique {result.surgery.bleedingRisk}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
