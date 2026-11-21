// Checks the cleaning engine inside parts-data-cleaner.html.
// Run from the project folder:  node scripts/test-parts-cleaner.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, '..', 'parts-data-cleaner.html'), 'utf8');
const source = html.match(/<script id="engine">([\s\S]*?)<\/script>/)[1];
const mod = { exports: {} };
new Function('module', source)(mod);
const PC = mod.exports;
const cfg = PC.compile({});

let failed = 0;
function check(label, got, want) {
  const a = JSON.stringify(got), b = JSON.stringify(want);
  if (a !== b) { failed++; console.error(`FAIL ${label}\n   got  ${a}\n   want ${b}`); }
}
const fit = r => ({
  part: r.clean,
  years: r.yearStart ? `${r.yearStart}-${r.yearOpen ? 'up' : r.yearEnd}` : '',
  vehicles: r.vehicles.map(v => `${v.make} ${v.model}`.trim()),
  engine: r.engine,
  drive: r.drive,
  body: r.body
});
const row = (part, years = '', vehicles = [], engine = '', drive = '', body = '') => ({ part, years, vehicles, engine, drive, body });

const cases = [
  ['Ceramic Front Disc Brake Pad Set for 2007-2013 Chevy Silverado 1500 5.3L V8 4WD - Brake Pads Front',
    row('Ceramic Front Disc Brake Pad Set', '2007-2013', ['Chevrolet Silverado 1500'], '5.3L V8', '4WD')],
  ['Dorman OE Solutions Front Left Door Lock Actuator Motor Fits 05-10 Honda Odyssey 3.5L V6 Brand New',
    row('Front Left Door Lock Actuator Motor', '2005-2010', ['Honda Odyssey'], '3.5L V6')],
  ['Premium High Quality Radiator Replacement for Toyota Camry 2002 2003 2004 2005 2006 2.4L L4 Sedan Free Shipping',
    row('Radiator', '2002-2006', ['Toyota Camry'], '2.4L L4', '', 'Sedan')],
  ['Moog Front Lower Ball Joint 99-06 Chevrolet Silverado GMC Sierra 1500 4x4 Ball Joint Front Lower',
    row('Front Lower Ball Joint', '1999-2006', ['Chevrolet Silverado 1500', 'GMC Sierra 1500'], '', '4WD')],
  ['Bosch Oxygen Sensor, OE Fitment (Jeep Wrangler 2007-2011 3.8L V6)',
    row('Oxygen Sensor', '2007-2011', ['Jeep Wrangler'], '3.8L V6')],
  ['NEW Alternator for Dodge Ram 1500 2500 3500 5.7L Hemi 2003-2008 160 Amp 1 Year Warranty',
    row('Alternator 160 Amp', '2003-2008', ['Dodge Ram 1500', 'Dodge Ram 2500', 'Dodge Ram 3500'], '5.7L Hemi')],
  ['Gates Timing Belt Kit w/ Water Pump - Subaru Outback Legacy 2.5L H4 SOHC 2000-2009',
    row('Timing Belt Kit w/ Water Pump', '2000-2009', ['Subaru Outback', 'Subaru Legacy'], '2.5L H4 SOHC')],
  ['Leaf Spring Shackle Kit Rear for 1999-2016 Ford F-250 F-350 Super Duty',
    row('Leaf Spring Shackle Kit Rear', '1999-2016', ['Ford F-250 Super Duty', 'Ford F-350 Super Duty'])],
  ['H11 LED Headlight Bulb Low Beam 6000K fits 2016+ Honda Civic',
    row('H11 LED Headlight Bulb Low Beam 6000K', '2016-up', ['Honda Civic'])],
  ['Mazda 3 2010-2013 2.0L Front Wheel Bearing Hub Assembly, Wheel Bearing',
    row('Front Wheel Bearing Hub Assembly', '2010-2013', ['Mazda 3'], '2.0L')],
  ['RAM 1500 Classic 2019 Tail Light', row('Tail Light', '2019-2019', ['Ram 1500 Classic'])],
  ["'05-'09 Mustang 4.6L V8 Cold Air Intake", row('Cold Air Intake', '2005-2009', ['Ford Mustang'], '4.6L V8')],
  ['Chevy Silverado 2500HD / GMC Sierra 2500 HD 6.6L Duramax Diesel 2011-2016 Fuel Filter',
    row('Fuel Filter', '2011-2016', ['Chevrolet Silverado 2500 HD', 'GMC Sierra 2500 HD'], '6.6L Duramax Diesel')],
  ['Front Brake Pads for 2012 Honda CRV', row('Front Brake Pads', '2012-2012', ['Honda CR-V'])],

  // Everyday words that are also model names or engine codes must stay in the part description.
  ['Spark Plug Wire Set 8mm Blue High Performance', row('Spark Plug Wire Set 8mm Blue High Performance')],
  ['Duralast Gold Battery Charger 12V 10 Amp Automatic', row('Battery Charger 12V 10 Amp Automatic')],
  ['Pilot Bearing 10-12 inch clutch', row('Pilot Bearing 10-12 inch clutch')],
  ['Set of 8 Cylinder Head Bolts M12x1.5', row('Set of 8 Cylinder Head Bolts M12x1.5')],
  ['H4 Headlight Bulb 60/55W', row('H4 Headlight Bulb 60/55W')],
  ['Oil Pan Gasket and Oil Pan 5.3L Engine Mount', row('Oil Pan Gasket and Oil Pan Engine Mount', '', [], '5.3L')],
  ['Wiper Blade 22 inch All Season', row('Wiper Blade 22 inch All Season')]
];
for (const [text, want] of cases) check(text, fit(PC.cleanText(cfg, text)), want);

// A row's own brand and SKU are cut; separate fitment columns win over what the text says.
const withCols = PC.cleanText(cfg, 'Acme AB-1234 Water Pump Silverado 1500 5.3L', {
  strip: ['Acme', 'AB-1234'], year: '2007-2013', make: 'Chevy', model: 'Silverado 1500', engine: '5.3L V8'
});
check('separate columns', fit(withCols), row('Water Pump', '2007-2013', ['Chevrolet Silverado 1500'], '5.3L V8'));

// Whole-table run: duplicate rows collapse, multi-fit rows split on request.
const table = PC.toTable(PC.parseDelimited(
  'SKU,Title\nA1,"Brake Pads, Front for 2003-2006 Toyota Tundra / Sequoia"\nA1,"Brake Pads, Front for 2003-2006 Toyota Tundra / Sequoia"\n'));
const map = PC.guessColumns(table);
check('column guess', [map.desc, map.strip], [1, [0]]);
const merged = PC.cleanTable(table, map, { dropDuplicateRows: true });
check('duplicate rows', [merged.rows.length, merged.stats.duplicates], [1, 1]);
check('merged cells', merged.rows[0].cells, ['A1', 'Brake Pads, Front', 2003, 2006, 'Toyota', 'Tundra, Sequoia', '', '', '']);
const split = PC.cleanTable(table, map, { dropDuplicateRows: true, split: true });
check('split rows', split.rows.map(r => r.cells[5]), ['Tundra', 'Sequoia']);
check('csv quoting', PC.toDelimited(['a', 'b'], [{ cells: ['x,y', 'say "hi"'] }], ','), 'a,b\r\n"x,y","say ""hi"""');

// Rule options.
const upper = PC.compile({ casing: 'title' });
check('title case', PC.cleanText(upper, 'MOTORCRAFT ENGINE OIL FILTER - 2004-2008 FORD F-150 5.4L V8 TRITON - OIL FILTER').clean, 'Engine Oil Filter');
const custom = PC.compile({ suppliers: 'Acme', filler: '', vehicles: 'Kenworth: T680, W900' });
check('custom make', fit(PC.cleanText(custom, 'Acme Hood Mirror for 2018 Kenworth T680')), row('Hood Mirror', '2018-2018', ['Kenworth T680']));

console.log(failed ? `${failed} check(s) failed` : `All ${cases.length + 9} checks passed`);
process.exit(failed ? 1 : 0);
