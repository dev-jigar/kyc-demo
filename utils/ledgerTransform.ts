import dayjs from "dayjs";
import { formatDate } from "./constants";
import { VerifiedBadgeProps } from "@/components/VerifiedBadge";
import {
  AttributeItemModelType,
  LedgerAuditResponse,
  WhoSectionData,
  MetadataItem,
  BadgeMetadata,
} from "./touchAuditData";

export function getRefIdFromItem(
  item: AttributeItemModelType,
): string | undefined {
  if (item.a_id && typeof item.a_id === "string") return item.a_id;
  const v = item.value;
  if (v && typeof v === "object" && "id" in v && typeof v.id === "string") {
    return v.id;
  }
  if (v && typeof v === "object" && "path" in v && typeof v.path === "string") {
    return v.path.replace(/\.json$/, "");
  }
  return undefined;
}

export function findRefIdInAttributes(
  attrs: AttributeItemModelType[] = [],
): string | undefined {
  for (const a of attrs) {
    const isRef = (a.type || "").toUpperCase() === "REFERENCE" || !!a.a_id;
    if (isRef) {
      const id = getRefIdFromItem(a);
      if (id) return id;
    }
  }
  return undefined;
}

export function resolveSectionWithReference(
  ledger: LedgerAuditResponse | null | undefined,
  section: "what" | "where" | "when" | "who",
  sectionData: AttributeItemModelType[] | WhoSectionData[] | undefined,
  deepResolve?: boolean,
): AttributeItemModelType[] | undefined {
  if (!ledger || !sectionData) return undefined;

  function collectSectionAttrs(
    ledgerObj: LedgerAuditResponse | null | undefined,
    sectionKey: "what" | "where" | "when" | "who",
    attrs: AttributeItemModelType[] | WhoSectionData[] | undefined,
    visited: Set<string> = new Set(),
    deepResolveFlag: boolean = false,
  ): AttributeItemModelType[] {
    if (!ledgerObj || !attrs) return [];

    // Special handling for 'who' section with WhoSectionData[]
    if (
      sectionKey === "who" &&
      Array.isArray(attrs) &&
      attrs.length > 0 &&
      attrs[0] &&
      "attributes" in attrs[0] &&
      Array.isArray((attrs[0] as WhoSectionData).attributes)
    ) {
      const parentAttrs = (attrs as WhoSectionData[]).flatMap(
        (w) => w.attributes || [],
      );
      const refId = findRefIdInAttributes(parentAttrs);
      let result = [...parentAttrs];
      if (refId && ledgerObj[refId] && !visited.has(refId)) {
        visited.add(refId);
        const child = ledgerObj[refId] as Partial<LedgerAuditResponse>;
        const childSection = child[sectionKey] as WhoSectionData[] | undefined;
        if (Array.isArray(childSection) && childSection.length > 0) {
          if (deepResolveFlag) {
            const childAttrs = collectSectionAttrs(
              ledgerObj,
              sectionKey,
              childSection,
              visited,
              deepResolveFlag,
            );

            result = result.concat(childAttrs);
          } else {
            result = result.concat(childSection[0].attributes || []);
          }
        }
      }
      return result;
    }

    // Generic reference resolution for other sections
    const items = Array.isArray(attrs)
      ? (attrs as AttributeItemModelType[])
      : [];
    const refId = findRefIdInAttributes(items);
    let result = [...items];
    if (refId && ledgerObj[refId] && !visited.has(refId)) {
      visited.add(refId);
      const child = ledgerObj[refId] as Partial<LedgerAuditResponse>;
      const childSection = child[sectionKey] as
        | AttributeItemModelType[]
        | undefined;
      if (Array.isArray(childSection)) {
        if (deepResolveFlag) {
          const childAttrs = collectSectionAttrs(
            ledgerObj,
            sectionKey,
            childSection,
            visited,
            deepResolveFlag,
          );

          result = result.concat(childAttrs);
        } else {
          result = result.concat(childSection);
        }
      }
    }
    return result;
  }

  let result = collectSectionAttrs(
    ledger,
    section,
    sectionData,
    new Set(),
    !!deepResolve,
  );

  if (deepResolve) {
    const allRefIds = findAllRefIdsInLedger(ledger);
    const globalVisited = new Set<string>();
    for (const refId of allRefIds) {
      const childLedger = ledger[refId] as LedgerAuditResponse | undefined;
      if (childLedger && childLedger[section] && !globalVisited.has(refId)) {
        const childAttrs = collectSectionAttrs(
          ledger,
          section,
          childLedger[section],
          globalVisited,
          true,
        );
        result = result.concat(childAttrs);
      }
    }
  }

  return result;
}

export function transformSection(
  section: "what" | "where" | "when" | "who",
  sectionData: AttributeItemModelType[] | WhoSectionData[] | undefined,
  ledger: LedgerAuditResponse | null,
  allowedSlugs: Set<string>,
  deepResolve?: boolean,
  refAssociatedTransform: boolean = false,
) {
  const resolved = refAssociatedTransform
    ? resolveSectionWithReference(ledger, section, sectionData, deepResolve)
    : sectionData;

  let allAttrs: AttributeItemModelType[] = [];
  if (Array.isArray(resolved)) {
    allAttrs =
      section === "who"
        ? (resolved as WhoSectionData[]).flatMap((w) => w.attributes || [])
        : (resolved as AttributeItemModelType[]);
  }
  const filtered = allAttrs.filter((i) => i.slug && allowedSlugs.has(i.slug));
  return filtered;
}

export function renderAttributeValue(item: AttributeItemModelType): string {
  const { type, value } = item;
  if (value == null) return "N/A";

  const upperType = (type || "").toUpperCase();

  switch (upperType) {
    case "BOOLEAN":
      return (value as boolean) ? "Yes" : "No";
    case "STRING":
      if (typeof value === "object" && value !== null) {
        try {
          return JSON.stringify(value);
        } catch (err) {
          console.error(err);
          // Fallback to string conversion if JSON.stringify fails
          return String(value);
        }
      }
      return String(value);
    case "INTEGER":
      return String(value);
    case "DATE":
      return formatDate(value as string | Date) || String(value);
    case "COORDINATES":
      if (
        typeof value === "object" &&
        value !== null &&
        "latitude" in value &&
        "longitude" in value &&
        typeof (value as { latitude: unknown; longitude: unknown }).latitude ===
          "number" &&
        typeof (value as { latitude: unknown; longitude: unknown })
          .longitude === "number"
      ) {
        const coords = value as { latitude: number; longitude: number };
        return `Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`;
      }
      return "Invalid coordinates";
    default:
      return typeof value === "object" ? JSON.stringify(value) : String(value);
  }
}

export function findAllRefIdsInLedger(
  ledger: LedgerAuditResponse | null | undefined,
): string[] {
  if (!ledger) return [];
  const refIds = new Set<string>();
  for (const key in ledger) {
    const value = ledger[key];
    if (Array.isArray(value)) {
      if (key === "who" && value.length > 0 && "attributes" in value[0]) {
        const attrs = (value as WhoSectionData[]).flatMap(
          (w) => w.attributes || [],
        );
        const id = findRefIdInAttributes(attrs);
        if (id) refIds.add(id);
      } else {
        const id = findRefIdInAttributes(value as AttributeItemModelType[]);
        if (id) refIds.add(id);
      }
    }
  }
  return Array.from(refIds);
}

export function getBadgeStatusFromMetadata(metadata: MetadataItem[]): {
  verifiedBadges: string[];
  unverifiedBadges: string[];
  hasAnyBadges: boolean;
} {
  if (!Array.isArray(metadata)) {
    return { verifiedBadges: [], unverifiedBadges: [], hasAnyBadges: false };
  }

  if (metadata.length === 0) {
    return { verifiedBadges: [], unverifiedBadges: [], hasAnyBadges: false };
  }

  const verifiedBadges: string[] = [];
  const unverifiedBadges: string[] = [];

  for (const item of metadata) {
    if (
      !item ||
      typeof item !== "object" ||
      !("type" in item) ||
      item.type !== "BADGE"
    ) {
      continue;
    }

    const badgeItem = item as BadgeMetadata;

    const deriveLabelFromItem = (it: BadgeMetadata): string | null => {
      if (it.label) {
        return (it.label.truthy || it.label.falsy) ?? null;
      }
      if ("slug" in it && it.slug && typeof it.slug === "string") {
        const parts = it.slug.split("_");
        const last = parts.pop();
        if (last) return `${last.toUpperCase()} Verified`;
      }
      return null;
    };

    if (badgeItem.value === true) {
      const text = badgeItem.label?.truthy ?? deriveLabelFromItem(badgeItem);
      if (text) verifiedBadges.push(text);
    } else if (badgeItem.value === false) {
      const text =
        badgeItem.label?.falsy ??
        badgeItem.label?.truthy ??
        deriveLabelFromItem(badgeItem);
      if (text) unverifiedBadges.push(text);
    }
  }

  return {
    verifiedBadges,
    unverifiedBadges,
    hasAnyBadges: verifiedBadges.length > 0 || unverifiedBadges.length > 0,
  };
}

export function getBadgeDataFromMetadata(
  metadata: MetadataItem[],
): Array<{ text: string; status: "success" | "error" }> {
  if (!Array.isArray(metadata)) {
    return [];
  }

  const badgeStatus = getBadgeStatusFromMetadata(metadata);

  return [
    ...badgeStatus.verifiedBadges.map((text) => ({
      text,
      status: "success" as const,
    })),
    ...badgeStatus.unverifiedBadges.map((text) => ({
      text,
      status: "error" as const,
    })),
  ];
}

export interface RenderedItemData {
  slug: string;
  label: string;
  value: string | null;
  rawValue?: unknown;
  badges: Array<{ text: string; status: "success" | "error" }>;
}

export function getRenderedItemsBySlugs(
  items: AttributeItemModelType[],
  slugs: string[],
  labels?: Record<string, string>,
  options?: { includeBadges?: boolean },
): RenderedItemData[] {
  const { includeBadges = true } = options || {};

  const slugSet = new Set(slugs);
  const results: RenderedItemData[] = [];
  const foundItems = new Map<string, RenderedItemData>();

  for (const item of items) {
    if (item.slug && slugSet.has(item.slug)) {
      const formatted = renderAttributeValue(item);
      const metadata = Array.isArray(item.metadata) ? item.metadata : [];

      const badges = includeBadges
        ? getBadgeDataFromMetadata((metadata as MetadataItem[]) || [])
        : [];

      foundItems.set(item.slug, {
        slug: item.slug,
        label: labels?.[item.slug] || item.label || item.slug,
        value: formatted,
        rawValue: item.value,
        badges,
      });
    }
  }

  for (const slug of slugs) {
    if (foundItems.has(slug)) {
      results.push(foundItems.get(slug)!);
    } else {
      results.push({
        slug,
        label: labels?.[slug] || slug,
        value: null,
        rawValue: undefined,
        badges: [],
      });
    }
  }

  return results;
}

export function createRenderedItemsMap(
  items: RenderedItemData[],
): Map<string, RenderedItemData> {
  return new Map(items.map((item) => [item.slug, item]));
}

export function findRenderedItemsFast(
  items: RenderedItemData[],
  slugs: string[],
): Record<string, RenderedItemData | undefined> {
  const itemsMap = createRenderedItemsMap(items);
  const result: Record<string, RenderedItemData | undefined> = {};

  for (const slug of slugs) {
    result[slug] = itemsMap.get(slug);
  }

  return result;
}

export function formatLedgerDbDate(date?: string | null, format?: string) {
  if (!date) return undefined;
  return dayjs(date.split("T")[0]).format(format ?? "MM/DD/YYYY");
}

export function formatLedgerDbTime(date?: string | null, format?: string) {
  if (!date) return undefined;
  return (
    dayjs(new Date(date))
      // .tz(dayjs.tz.guess())
      .format(format ?? "hh:mm A")
  );
}

export function formatLedgerDbDateTime(date?: Date | string | null) {
  if (!date) return "-";

  return dayjs(new Date(date)).format("MM/DD/YYYY hh:mm:ss A z");
}

export const getAttributeBySlug = (
  slug: string,
  attributes?: AttributeItemModelType[],
) => {
  const attribute = attributes?.find((attr) => attr.slug === slug);
  return attribute
    ? { ...attribute, value: attribute.value === null ? "" : attribute.value }
    : { value: "" };
};

export const formatDateTimeAttributeValue = (
  attribute?: AttributeItemModelType,
  format?: string,
) => {
  return typeof attribute?.value === "string" && attribute?.value !== ""
    ? (attribute?.type === "DATE" &&
        formatLedgerDbDate(attribute.value?.toString(), format)) ||
        (attribute?.type === "TIME" &&
          formatLedgerDbTime(attribute.value?.toString(), format)) ||
        (["DATETIME", "TIMESTAMP"].includes(attribute?.type || "") &&
          formatLedgerDbDateTime(attribute.value?.toString())) ||
        "-"
    : "-";
};

export const getAttributeMetadataExtras = (
  attribute: AttributeItemModelType,
) => {
  return attribute?.metadata
    ?.filter((meta) => meta.type === "BADGE")
    .map((meta) => {
      if (
        (meta.value && meta.label.truthy) ||
        (!meta.value && meta.label.falsy)
      ) {
        return {
          icon: meta.value
            ? "/public/hexagon-icon.svg"
            : "/public/hexagon-danger-icon.svg",
          status: (meta.value
            ? "success"
            : "error") as VerifiedBadgeProps["status"],
          text: meta.value
            ? String(meta.label.truthy) || "-"
            : String(meta.label.falsy) || "-",
        };
      }
      return null;
    })
    .filter((v) => v !== null);
};
