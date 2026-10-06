/**
 * Wat per organisatie verschilt — het naamvoorvoegsel van de CA-policies en de eigen service
 * provider-tenant — uit CATemplate/_organisation.json. Geen script noemt die letterlijk: zo kan een
 * kopie van deze repo met scripts/set-organisation.js een eigen organisatie krijgen.
 */

const fs = require("fs");
const path = require("path");

const ORGANISATION_PATH = path.resolve(__dirname, "..", "..", "CATemplate", "_organisation.json");

/** In bestandsnamen op Windows, en in de JSON-strings en regexen die de scripts bouwen, breekt dit. */
const FORBIDDEN = /["\\/:*?<>|_]/;

const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function validPrefix(prefix) {
  return typeof prefix === "string" && prefix.endsWith(" - ") && prefix.trim() !== "-" && !FORBIDDEN.test(prefix);
}

/** "CA - " -> "CA__", "CXNM - STANDARD - " -> "CXNM__STANDARD__": de vorm in de bestandsnaam. */
function filePrefixOf(prefix) {
  return prefix.split(" - ").filter(Boolean).map((part) => part.trim().replace(/\s+/g, "_")).join("__") + "__";
}

function readOrganisation(file = ORGANISATION_PATH) {
  const org = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!validPrefix(org.prefix)) {
    throw new Error(`${file}: "prefix" moet een tekst zijn die eindigt op " - ", zonder " \\ / : * ? < > | _ (nu: ${JSON.stringify(org.prefix)})`);
  }
  const tenant = org.serviceProviderTenantId ?? null;
  if (tenant !== null && !GUID_RE.test(tenant)) {
    throw new Error(`${file}: "serviceProviderTenantId" moet null zijn of een tenant-id in kleine letters (nu: ${JSON.stringify(tenant)})`);
  }
  return { prefix: org.prefix, serviceProviderTenantId: tenant };
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * De uitsluiting van de eigen service provider-tenant: technici die via GDAP in een klant-tenant
 * werken. Alleen die ene tenant, niet elke partner. Vaste sleutelvolgorde: set-organisation.js
 * zoekt hem als tekst terug om hem weer weg te halen.
 */
const serviceProviderExclusion = (tenantId) => ({
  guestOrExternalUserTypes: "serviceProvider",
  externalTenants: {
    "@odata.type": "#microsoft.graph.conditionalAccessEnumeratedExternalTenants",
    membershipKind: "enumerated",
    members: [tenantId],
  },
});

/** Is dit de uitsluiting hierboven, voor welke tenant dan ook? Geeft dan het tenant-id, anders null. */
function serviceProviderTenantOf(exclusion) {
  if (!exclusion || exclusion.guestOrExternalUserTypes !== "serviceProvider") return null;
  const members = exclusion.externalTenants?.members || [];
  return members.length === 1 && JSON.stringify(exclusion) === JSON.stringify(serviceProviderExclusion(members[0])) ? members[0] : null;
}

/**
 * Hoort de service provider-uitsluiting op deze policy? Op alles wat op gebruikers richt (iedereen,
 * rollen of groepen) — niet op agent-policies ("None") en niet op policies die zelf op gasten
 * richten. Een policy met een eigen gastenuitsluiting (2125) kan er geen tweede bij hebben: Entra
 * kent er één per policy.
 */
function wantsServiceProviderExclusion(policy) {
  const u = policy.conditions?.users || {};
  const onUsers = (u.includeUsers || []).includes("All") || (u.includeRoles || []).length > 0 || (u.includeGroups || []).length > 0;
  const ownGuestExclusion = Boolean(u.excludeGuestsOrExternalUsers) && !serviceProviderTenantOf(u.excludeGuestsOrExternalUsers);
  return onUsers && !u.includeGuestsOrExternalUsers && !ownGuestExclusion;
}

const { prefix: PREFIX, serviceProviderTenantId: SERVICE_PROVIDER_TENANT_ID } = readOrganisation();
const FILE_PREFIX = filePrefixOf(PREFIX);

/** `<prefix><nummer> - <TYPE> - <Naam>`; groep 1 is het nummer, 2 het type, 3 de naam. */
const DISPLAY_NAME_RE = new RegExp(`^${escapeRegExp(PREFIX)}(\\d+) - (\\w+) - (.+)$`);

module.exports = {
  ORGANISATION_PATH,
  PREFIX,
  FILE_PREFIX,
  DISPLAY_NAME_RE,
  SERVICE_PROVIDER_TENANT_ID,
  GUID_RE,
  readOrganisation,
  validPrefix,
  filePrefixOf,
  escapeRegExp,
  serviceProviderExclusion,
  serviceProviderTenantOf,
  wantsServiceProviderExclusion,
};
