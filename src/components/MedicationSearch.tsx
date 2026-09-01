"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  formatMedicationLabel,
  searchMedications,
} from "@/lib/medications";
import type { MedicationReference } from "@/lib/medications";

interface Props {
  existingDrugIds: string[];
  onSelect: (drug: MedicationReference) => void;
}

export function MedicationSearch({ existingDrugIds, onSelect }: Props) {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = searchMedications(query).filter(
    (r) => !existingDrugIds.includes(r.drug.id),
  );

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
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectDrug = (drug: MedicationReference) => {
    onSelect(drug);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
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
      selectDrug(results[activeIndex].drug);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div className="med-search" ref={containerRef}>
      <label className="med-search__label" htmlFor={`${listboxId}-input`}>
        Ajouter un traitement
      </label>
      <div className="med-search__field">
        <input
          ref={inputRef}
          id={`${listboxId}-input`}
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={`${listboxId}-listbox`}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Rechercher par DCI ou nom commercial (ex. Eliquis, apixaban)…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {showDropdown && (
        <ul
          id={`${listboxId}-listbox`}
          role="listbox"
          className="med-search__results"
        >
          {results.length === 0 ? (
            <li className="med-search__empty" role="option" aria-selected={false}>
              Aucun médicament trouvé
            </li>
          ) : (
            results.map((result, index) => (
              <li key={result.drug.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className="med-search__option"
                  data-active={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectDrug(result.drug)}
                >
                  <span className="med-search__option-name">
                    {formatMedicationLabel(result.drug)}
                  </span>
                  <span className="med-search__option-meta">
                    {result.matchedOn === "commercial"
                      ? `Nom commercial · ${result.matchedLabel}`
                      : `DCI · ${result.drug.therapeuticClass}`}
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
