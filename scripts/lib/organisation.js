/**
 * Wat per organisatie verschilt — het naamvoorvoegsel van de CA-policies — uit
 * CATemplate/_organisation.json. Geen script noemt het voorvoegsel letterlijk: zo kan een kopie van
 * deze repo met scripts/set-organisation.js een eigen voorvoegsel krijgen.
 */

const fs = require("fs");
const path = require("path");

const ORGANISATION_PATH = path.resolve(__dirname, "..", "..", "CATemplate", "_organisation.json");

/** In bestandsnamen op Windows, en in de JSON-strings en regexen die de scripts bouwen, breekt dit. */
const FORBIDDEN = /["\\/:*?<>|_]/;

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
  return { prefix: org.prefix };
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const { prefix: PREFIX } = readOrganisation();
const FILE_PREFIX = filePrefixOf(PREFIX);

/** `<prefix><nummer> - <TYPE> - <Naam>`; groep 1 is het nummer, 2 het type, 3 de naam. */
const DISPLAY_NAME_RE = new RegExp(`^${escapeRegExp(PREFIX)}(\\d+) - (\\w+) - (.+)$`);

module.exports = { ORGANISATION_PATH, PREFIX, FILE_PREFIX, DISPLAY_NAME_RE, readOrganisation, validPrefix, filePrefixOf, escapeRegExp };
