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
  return { prefix: org.prefix, serviceProviderTenantIds: tenantIdsOf(org, file) };
}

/**
 * De service provider-tenants uit een _organisation.json, in de volgorde waarin ze er staan. Ook de
 * oude vorm met één `serviceProviderTenantId`, zodat een spiegel van vóór de lijst gewoon meegaat.
 */
function tenantIdsOf(org, file = ORGANISATION_PATH) {
  const ids = org.serviceProviderTenantIds ?? (org.serviceProviderTenantId ? [org.serviceProviderTenantId] : []);
  if (!Array.isArray(ids) || ids.some((id) => !GUID_RE.test(id)) || new Set(ids).size !== ids.length) {
    throw new Error(`${file}: "serviceProviderTenantIds" moet een lijst van verschillende tenant-id's in kleine letters zijn (nu: ${JSON.stringify(ids)})`);
  }
  return ids;
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * De uitsluiting van de eigen service provider-tenants: technici die via GDAP in een klant-tenant
 * werken. Alleen deze tenants, niet elke partner; members in de volgorde van _organisation.json.
 * Vaste sleutelvolgorde: set-organisation.js zoekt hem als tekst terug om hem weer weg te halen.
 */
const serviceProviderExclusion = (tenantIds) => ({
  guestOrExternalUserTypes: "serviceProvider",
  externalTenants: {
    "@odata.type": "#microsoft.graph.conditionalAccessEnumeratedExternalTenants",
    membershipKind: "enumerated",
    members: [...tenantIds],
  },
});

/** Is dit de uitsluiting hierboven, voor welke tenants dan ook? Geeft dan de tenant-id's, anders null. */
function serviceProviderTenantsOf(exclusion) {
  if (!exclusion || exclusion.guestOrExternalUserTypes !== "serviceProvider") return null;
  const members = exclusion.externalTenants?.members || [];
  return members.length > 0 && JSON.stringify(exclusion) === JSON.stringify(serviceProviderExclusion(members)) ? members : null;
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
  const ownGuestExclusion = Boolean(u.excludeGuestsOrExternalUsers) && !serviceProviderTenantsOf(u.excludeGuestsOrExternalUsers);
  return onUsers && !u.includeGuestsOrExternalUsers && !ownGuestExclusion;
}

const { prefix: PREFIX, serviceProviderTenantIds: SERVICE_PROVIDER_TENANT_IDS } = readOrganisation();
const FILE_PREFIX = filePrefixOf(PREFIX);

/** `<prefix><nummer> - <TYPE> - <Naam>`; groep 1 is het nummer, 2 het type, 3 de naam. */
const DISPLAY_NAME_RE = new RegExp(`^${escapeRegExp(PREFIX)}(\\d+) - (\\w+) - (.+)$`);

module.exports = {
  ORGANISATION_PATH,
  PREFIX,
  FILE_PREFIX,
  DISPLAY_NAME_RE,
  SERVICE_PROVIDER_TENANT_IDS,
  GUID_RE,
  readOrganisation,
  tenantIdsOf,
  validPrefix,
  filePrefixOf,
  escapeRegExp,
  serviceProviderExclusion,
  serviceProviderTenantsOf,
  wantsServiceProviderExclusion,
};
