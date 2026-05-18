"use client";

/**
 * Mobile bottom-sheet filter drawer for the Shop page.
 *
 * The Shop page is a server component, so it composes <MobileFilterTrigger />
 * which owns the open/close state and renders both the trigger button
 * (slotted into the mobile filter bar) and the sheet itself.
 *
 * URL changes are driven by next/navigation's router.push so the server
 * component re-renders with updated facet counts. The drawer closes when
 * the URL changes.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toggleParam, clearAll, type SearchParams } from "@/lib/filters";
import type { ProductFilter, Tier } from "@/lib/api";
import shopStyles from "@/app/shop/page.module.css";
import styles from "./MobileFilterDrawer.module.css";

const TIERS: Tier[] = ["Tournament", "Club", "Practice"];
const BRANDS = ["YONEX", "RSL", "VICTOR", "LI-NING"];
const FEATHERS = ["Goose", "Duck", "Nylon"];
const SPEEDS = ["75", "76", "77", "78"];
const SPEED_LABELS: Record<string, string> = {
  "75": "75 · cold",
  "76": "76 · standard",
  "77": "77 · warm",
  "78": "78 · hot",
};

type FilterKey = "tier" | "brand" | "feather" | "speed";

type Counts = {
  tier: Record<string, number>;
  brand: Record<string, number>;
  feather: Record<string, number>;
  speed: Record<string, number>;
};

type Props = {
  sp: SearchParams;
  filter: ProductFilter;
  counts: Counts;
  activeCount: number;
};

export function MobileFilterTrigger(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Filter
        {props.activeCount > 0 && (
          <span className={`bh-tnum ${styles.triggerBadge}`}>{props.activeCount}</span>
        )}
      </button>
      <MobileFilterDrawer
        {...props}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

function MobileFilterDrawer({
  sp,
  filter,
  counts,
  activeCount,
  open,
  onClose,
}: Props & { open: boolean; onClose: () => void }) {
  const router = useRouter();

  // Lock body scroll + handle ESC while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function navigate(href: string) {
    router.push(href, { scroll: false });
  }

  function handleToggle(key: FilterKey, value: string) {
    navigate(`/shop${toggleParam(sp, key, value)}`);
  }

  function handleClearAll() {
    if (activeCount === 0) return;
    navigate(`/shop${clearAll(sp)}`);
  }

  function handleApply() {
    onClose();
  }

  const tierOptions = TIERS.map((t) => ({
    value: t,
    label: t,
    count: counts.tier[t] ?? 0,
  }));
  const featherOptions = FEATHERS.map((f) => ({
    value: f,
    label: f,
    count: counts.feather[f] ?? 0,
  }));
  const speedOptions = SPEEDS.map((s) => ({
    value: s,
    label: SPEED_LABELS[s] ?? s,
    count: counts.speed[s] ?? 0,
  }));
  const brandOptions = BRANDS.map((b) => ({
    value: b,
    label: b,
    count: counts.brand[b.toLowerCase()] ?? 0,
  }));

  return (
    <>
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`${styles.sheet} ${open ? styles.sheetOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
        aria-hidden={!open}
      >
        <div className={styles.dragHandleRow}>
          <div className={styles.dragHandle} />
        </div>

        <div className={styles.header}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close filters"
          >
            ×
          </button>
          <div className={styles.title}>Filter</div>
          <button
            type="button"
            className={`${styles.clearAll} ${activeCount === 0 ? styles.clearAllDisabled : ""}`}
            onClick={handleClearAll}
            disabled={activeCount === 0}
          >
            Clear all
          </button>
        </div>

        <div className={styles.body}>
          <DrawerFilterGroup
            title="Tier"
            param="tier"
            options={tierOptions}
            active={filter.tier ?? []}
            onToggle={handleToggle}
          />
          <DrawerFilterGroup
            title="Feather"
            param="feather"
            options={featherOptions}
            active={filter.feather ?? []}
            onToggle={handleToggle}
          />
          <DrawerFilterGroup
            title="Speed"
            param="speed"
            options={speedOptions}
            active={filter.speed ?? []}
            onToggle={handleToggle}
          />
          <DrawerFilterGroup
            title="Brand"
            param="brand"
            options={brandOptions}
            active={filter.brand ?? []}
            onToggle={handleToggle}
          />
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.applyBtn}
            onClick={handleApply}
          >
            {activeCount > 0 ? `Apply filters (${activeCount})` : "Show results"}
          </button>
        </div>
      </div>
    </>
  );
}

type Option = { value: string; label: string; count: number };

function DrawerFilterGroup({
  title,
  param,
  options,
  active,
  onToggle,
}: {
  title: string;
  param: FilterKey;
  options: Option[];
  active: string[];
  onToggle: (key: FilterKey, value: string) => void;
}) {
  return (
    <div className={shopStyles.filterGroup}>
      <div className={shopStyles.filterGroupTitle}>{title}</div>
      <ul className={styles.list}>
        {options.map((opt) => {
          const isChecked = active.includes(opt.value);
          return (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => onToggle(param, opt.value)}
                className={`${styles.optionBtn} ${shopStyles.filterItem} ${
                  isChecked ? shopStyles.filterItemChecked : ""
                }`}
                aria-pressed={isChecked}
              >
                <span className={shopStyles.filterLabel}>
                  <span
                    className={`${shopStyles.filterCheckbox} ${
                      isChecked ? shopStyles.filterCheckboxChecked : ""
                    }`}
                  >
                    {isChecked && (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path
                          d="M1.5 4.5L3.5 6.5L7.5 2.5"
                          stroke="#fff"
                          strokeWidth="1.5"
                        />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                </span>
                <span className={`bh-tnum ${shopStyles.filterCount}`}>{opt.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
