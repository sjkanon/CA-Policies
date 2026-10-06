/**
 * Tests for scripts/lib/organisation.js — what differs per organisation (prefix and own service
 * provider tenants). set-organisation.js finds the service provider exclusion back as text, so its
 * shape must be exactly reproducible; and an organisation file in the old form (one
 * serviceProviderTenantId) must still be read, otherwise a mirror from before the list breaks.
 */

const assert = require("node:assert");
const { test } = require("node:test");
const {
  filePrefixOf,
  tenantIdsOf,
  serviceProviderExclusion,
  serviceProviderTenantsOf,
  wantsServiceProviderExclusion,
} = require("./lib/organisation");

const A = "c49ed456-5b96-40d7-b0a9-018e2e631e07";
const B = "a4346625-ecc9-4a10-bb76-26184a0e862b";

test("de bestandsvorm volgt uit het voorvoegsel", () => {
  assert.strictEqual(filePrefixOf("CA - "), "CA__");
  assert.strictEqual(filePrefixOf("CXNM - STANDARD - "), "CXNM__STANDARD__");
});

test("tenant-id's: lijst, oude vorm met één id, en leeg", () => {
  assert.deepStrictEqual(tenantIdsOf({ serviceProviderTenantIds: [A, B] }), [A, B]);
  assert.deepStrictEqual(tenantIdsOf({ serviceProviderTenantId: A }), [A]);
  assert.deepStrictEqual(tenantIdsOf({ serviceProviderTenantId: null }), []);
  assert.deepStrictEqual(tenantIdsOf({}), []);
  assert.throws(() => tenantIdsOf({ serviceProviderTenantIds: [A, A] }), /verschillende/);
  assert.throws(() => tenantIdsOf({ serviceProviderTenantIds: [A.toUpperCase()] }), /kleine letters/);
});

test("de uitsluiting is terug te lezen, met de volgorde van de lijst", () => {
  assert.deepStrictEqual(serviceProviderTenantsOf(serviceProviderExclusion([A, B])), [A, B]);
  assert.deepStrictEqual(serviceProviderTenantsOf(serviceProviderExclusion([A])), [A]);
  const gasten = { guestOrExternalUserTypes: "internalGuest,b2bCollaborationGuest", externalTenants: { membershipKind: "all" } };
  assert.strictEqual(serviceProviderTenantsOf(gasten), null, "een gewone gastenuitsluiting is niet van ons");
  assert.strictEqual(serviceProviderTenantsOf(null), null);
});

test("de uitsluiting hoort op gebruikerspolicies, niet op agents, gasten of een eigen gastenuitsluiting", () => {
  const policy = (users) => ({ conditions: { users: { includeUsers: [], includeGroups: [], includeRoles: [], ...users } } });
  assert.ok(wantsServiceProviderExclusion(policy({ includeUsers: ["All"] })));
  assert.ok(wantsServiceProviderExclusion(policy({ includeRoles: ["x"] })));
  assert.ok(wantsServiceProviderExclusion(policy({ includeGroups: ["g"], excludeGuestsOrExternalUsers: serviceProviderExclusion([A]) })));
  assert.ok(!wantsServiceProviderExclusion(policy({ includeUsers: ["None"] })));
  assert.ok(!wantsServiceProviderExclusion(policy({ includeGuestsOrExternalUsers: { guestOrExternalUserTypes: "b2bCollaborationGuest" } })));
  assert.ok(!wantsServiceProviderExclusion(policy({ includeGroups: ["g"], excludeGuestsOrExternalUsers: { guestOrExternalUserTypes: "internalGuest" } })));
});
