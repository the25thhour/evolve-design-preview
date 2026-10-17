// Editorial layer over data/portfolio.json and data/site.json (harvested from the live site, 2026-10-17).
// Every line here traces to the current site: the project page, the About or Services page, or a dated
// News item about the same project (noted in `source`). Typos are fixed, stale counts become dates.
// No em dashes anywhere in site copy.

// Sectors are an editorial grouping of the portfolio (the live site has no categories).
// Order is the order of the runs on the home contact sheet and the work index.
// Within each sector, projects are listed in this order (cleanest single render on white first).
export const leadOrder = [
  'smart-alert-remote-control-alerting-sytem', 'quantum-micro-321-bte-hearing-instrument', 'remote-control-for-hearing-instruments', 'moxi-3g-next-generation-hearing-instrument', 'shift-ultra-small-hearing-instrument', 'smart-alert-remote-control-alerting-system', 'premium-packaging-hearing-instruments',
  'pack-mobile-rechargeable-battery', 'rechargeable-battery-energy-storage-management-system', 'man-portable-skycase-system',
  'resolute-gnss-receiver', 'isotherm-3000-thermostat-c-mac-energy-system', 'concierge-springboard-retail-networks', 'astrostart-remote-key-fob-astroflex', 'mc-series-deskset-controllers-motorola-cml-emergeency-services',
  'monopiece-toddler-eyewear-plastic-frames', 'yuleys-protective-footwear', 'elan-desktop-fan-caframo', 'workmate-375-black-decker', 'kun-solo-violin-shoulder-rest', 'disposable-cutlery-set-industries-sansfacon', 'painting-tray-system-prak-tik', 'workmate-portable-paint-station-black-decker',
  'nvg-arm-visor-shield', 'fixed-arm-visor-shield',
  'mito-office-seating-evolve-italla', 'amisco-zoom-contemporary-dining-table', 'amisco-freestyle-contemporary-stools', 'slim-asymmetric-twister-armrest', 'office-seating-bouty-dharma-teknionvertex-composites',
  'c-pod-dna-sample-collection-container',
  'cross-country-ski-poles-industrie-lafleche', 'pool-security-ladder-waterpik-technologiesacm-olympic',
  'stubby-tubby-premiumshallow-tubs', 'big-book-clip-classroom-spring-loaded-clip', 'classroom-audio-pod-listening-center', 'stack-n-nest-tubs', 'clip-zip-classroom-spring-loaded-clip', 'small-back-back-tabletop-easel', 'premium-classroom-teaching-easel-station', 'classroom-teaching-easel-adjustable-book-ledge', 'safety-cap-classroom-teaching-easel-book-ledge-end-caps', 'chart-caddy-accessory',
];

// Images that are collages or photographs rather than a single render on white: listed for Aldo as
// the first projects where one clean render would help.
export const needsRender = ['man-portable-skycase-system', 'concierge-springboard-retail-networks', 'astrostart-remote-key-fob-astroflex', 'mc-series-deskset-controllers-motorola-cml-emergeency-services', 'office-seating-bouty-dharma-teknionvertex-composites', 'cross-country-ski-poles-industrie-lafleche', 'pool-security-ladder-waterpik-technologiesacm-olympic', 'workmate-portable-paint-station-black-decker', 'classroom-audio-pod-listening-center', 'premium-classroom-teaching-easel-station', 'small-back-back-tabletop-easel', 'clip-zip-classroom-spring-loaded-clip', 'classroom-teaching-easel-adjustable-book-ledge', 'safety-cap-classroom-teaching-easel-book-ledge-end-caps', 'stack-n-nest-tubs', 'chart-caddy-accessory'];

export const sectors = [
  { key: 'hearing', label: 'Hearing instruments', match: 'Hearing instruments' },
  { key: 'power', label: 'Power and batteries', match: 'Power and batteries' },
  { key: 'electronics', label: 'Electronics and controls', match: 'Electronics, telecom and controls' },
  { key: 'consumer', label: 'Consumer products and tools', match: 'Consumer products and tools' },
  { key: 'defence', label: 'Defence and protective equipment', match: 'Defence and protective equipment' },
  { key: 'furniture', label: 'Furniture and office seating', match: 'Furniture and office seating' },
  { key: 'medical', label: 'Medical and laboratory', match: 'Medical and laboratory' },
  { key: 'sport', label: 'Sporting goods and recreation', match: 'Sporting goods and recreation' },
  { key: 'classroom', label: 'Classroom products', match: 'Classroom and education products' },
];

// The two large renders that exist (3000x1245) stand in for these projects' frames on the home sheet.
export const heroRenders = {
  'smart-alert-remote-control-alerting-sytem': { src: 'https://www.evolve-designsolutions.com/wp-content/uploads/2017/09/slider1.png', w: 3000, h: 1245, alt: 'Render of the black Smart Alert remote in front, side and angled views, with its belt clip' },
  'pack-mobile-rechargeable-battery': { src: 'https://www.evolve-designsolutions.com/wp-content/uploads/2017/09/slider3.png', w: 3000, h: 1245, alt: 'Render of the lime-green i-Pack battery from the back and at an angle, with its carry handle and output panel' },
};

// Per project, keyed by the live site's slug.
// slug: the new URL (typos in the old slugs fixed). name: page title. short: the tag on the sheet.
// era: 'evolve' (Evolve Design Solutions, since 2005) or 'earlier' (Aldo Balatti at a previous firm).
export const projects = {
  'pack-mobile-rechargeable-battery': {
    alt: 'Lime-green i-Pack battery seen from the side and from the front, with its carry handle and output panel',
    slug: 'i-pack-mobile-battery', name: 'i-Pack Mobile Rechargeable Battery', short: 'i-Pack battery',
    description: 'A rugged mobile rechargeable battery that brings electricity to people living in off-grid rural and remote villages. It works only with the i-Kabin, a solar-powered battery recharging kiosk.',
    details: ['The i-Pack powers lighting and phone charging, along with small electrical products such as fans, radios, a refrigerator and TVs.'],
    source: 'Portfolio page; News, August 17, 2016',
  },
  'nvg-arm-visor-shield': {
    alt: 'Clear ballistic visor shield on its adjustable mounting arm, with an inset of the visor fitted to a helmet',
    slug: 'nvg-arm-visor-shield', name: 'NVG Arm for Visor Shield', short: 'NVG visor arm',
    description: 'An adjustable night vision goggle (NVG) arm that mounts a ballistic visor shield to a special operations helmet system, for eye and face protection in unstable environments.',
    details: ['Designed for an international solutions provider specializing in protective equipment. The arm mounts to the helmet system’s NVG shroud and clips in directly, quickly and securely.'],
    source: 'Portfolio page; News, May 17, 2016',
  },
  'fixed-arm-visor-shield': {
    alt: 'Tinted ballistic visor shield on its fixed mounting arm',
    slug: 'fixed-arm-visor-shield', name: 'Fixed Arm for Visor Shield', short: 'Fixed visor arm',
    description: 'A fixed arm that locks a ballistic visor shield to a special operations helmet system, for eye and face protection in unstable environments.',
    details: ['The fixed arm works with equipment mounted to the helmet system’s shroud. It was developed with the adjustable NVG arm for the same helmet system.'],
    source: 'Portfolio page; News, May 17, 2016',
  },
  'resolute-gnss-receiver': {
    alt: 'Concept renders of a square grey receiver with rubber corners, in front, side, top and angled views',
    slug: 'resolute-gnss-receiver', name: 'Resolute GNSS Receiver', short: 'Resolute GNSS',
    client: 'Xeos Technologies',
    description: 'Conceptual design exploration for the Resolute GNSS (Global Navigation Satellite System) receiver: autonomous, low power and small.',
    details: ['Evolve presented several design concepts. Xeos Technologies selected one for its engineering team to engineer and implement for production.'],
    credit: 'Conceptual design by Evolve Design Solutions',
    source: 'Portfolio page; News, November 17, 2015',
  },
  'kun-solo-violin-shoulder-rest': {
    alt: 'Kun Solo shoulder rest in two views, with gold folding legs and a black shoulder pad, and fitted to a violin',
    slug: 'kun-solo-violin-shoulder-rest', name: 'Kun Solo Violin Shoulder Rest', short: 'Kun Solo',
    description: 'A sleek, two-tone violin shoulder rest with a contoured body, quick-adjust finger levers and a collapsing mechanism that folds it flat for storage.',
    details: ['The finger levers replace the traditional screws. A sponge rubber shoulder support with cut-outs improves grip and lets air flow around the shoulder and neck.'],
    source: 'Portfolio page; News, July 17, 2015',
  },
  'rechargeable-battery-energy-storage-management-system': {
    alt: 'Dark green Energy SharePack battery units with orange status panels, one in a camouflage carry pouch',
    slug: 'energy-sharepack', name: 'Energy SharePack', short: 'Energy SharePack',
    client: 'Panacis',
    description: 'A rechargeable battery and energy storage management system for demanding military applications and advanced electronic battlefield equipment.',
    details: ['The lightweight lithium-ion system powers equipment such as networked radios, night vision systems, GPS units, phones and laptops. Evolve worked closely with the electronic and mechanical development team.'],
    materials: 'Lithium-ion energy storage',
    source: 'Portfolio page; News, October 17, 2013',
  },
  'amisco-zoom-contemporary-dining-table': {
    alt: 'Zoom dining table with a dark top on brushed metal legs',
    slug: 'amisco-zoom-dining-table', name: 'Amisco Zoom Dining Table', short: 'Zoom table',
    client: 'Amisco',
    description: 'A contemporary extendable dining table that seats eight and opens easily by one person, thanks to its ball-bearing slide mechanism.',
    details: ['Launched at the High Point Market in High Point, North Carolina. Designed for Amisco, one of North America’s leading manufacturers of residential furniture.'],
    launch: ['Launched', 'High Point Market, 2013'],
    source: 'Portfolio page; News, April 17, 2013',
  },
  'amisco-freestyle-contemporary-stools': {
    alt: 'Two Freestyle stools on cantilevered metal legs, one backless with a teal seat, one with a grey back',
    slug: 'amisco-freestyle-stools', name: 'Amisco Freestyle Stools', short: 'Freestyle stools',
    client: 'Amisco',
    description: 'Contemporary cantilevered stools on metal legs: lightweight, comfortable, and offered with or without a back.',
    details: ['The non-swivel 30-inch stools have a cushioned seat and a footrest, and are light and easy to move.'],
    launch: ['Launched', 'High Point Market, 2012'],
    source: 'Portfolio page; News, April 20, 2012',
  },
  'man-portable-skycase-system': {
    alt: 'Rugged open carrying case with a control panel inside, photographed on grass',
    slug: 'man-portable-skycase-system', name: 'Man-Portable SkyCase System', short: 'SkyCase',
    description: null, // the live page shows the Freestyle stools text by mistake; flagged in the README
    source: 'Portfolio page (description withheld: it is copied from another project on the live site)',
  },
  'c-pod-dna-sample-collection-container': {
    alt: 'Blue C-POD molded flat in one piece, its collector and two housings linked in a line',
    slug: 'c-pod-dna-sample-container', name: 'C-POD DNA Sample Collection Container', short: 'C-POD',
    description: 'A DNA sample collection container that preserves genetic material such as buccal cells, tissue and blood or liquid spots before laboratory testing.',
    details: ['The C-POD is molded flat as a single piece: a buccal collector, a bottom housing and a top housing, linked by folding break-away tabs. It serves human and animal genetic sampling, and was patent pending in 2012.'],
    materials: 'Single-piece molded plastic',
    source: 'Portfolio page; News, March 17, 2012',
  },
  'monopiece-toddler-eyewear-plastic-frames': {
    alt: 'Two toddler eyewear frames, one lilac and one dark red with a head strap',
    slug: 'monopiece-toddler-eyewear', name: 'Monopiece Toddler Eyewear Frames', short: 'Toddler eyewear',
    client: 'iGoggles Eyewear',
    description: 'Single-piece eyewear frames for toddlers: flexible yet very sturdy, and molded in five bright colours.',
    details: ['Evolve handled the industrial design and plastics engineering. The frames come in two sizes, 3¾ inches for children under two and 4½ inches for ages two to five, with a snap-on head strap also designed by Evolve.'],
    materials: 'Injection-molded thermoplastic, one piece',
    source: 'Portfolio page; News, January 12, 2012',
  },
  'quantum-micro-321-bte-hearing-instrument': {
    alt: 'Pair of dark grey behind-the-ear hearing instruments with clear tubes',
    slug: 'quantum-micro-321-hearing-instrument', name: 'Quantum Micro 321 Hearing Instrument', short: 'Quantum Micro 321',
    client: 'Unitron',
    description: 'A discreet micro behind-the-ear (BTE) wireless hearing instrument, designed around Unitron’s latest generation of sound processing.',
    source: 'Portfolio page',
  },
  'remote-control-for-hearing-instruments': {
    alt: 'Black hearing instrument remote control with large plus, minus and program buttons',
    slug: 'remote-control-for-hearing-instruments', name: 'Remote Control for Hearing Instruments', short: 'Remote control',
    client: 'Unitron',
    description: 'A sleek, straightforward remote control for hearing instruments, with an easy-to-hold shape, large buttons and simple functions.',
    details: ['Unveiled at the 2011 EUHA congress in Nuremberg, Germany. It was the third remote control program Evolve designed for Unitron.'],
    launch: ['Unveiled', 'EUHA congress, Nuremberg, 2011'],
    source: 'Portfolio page; News, October 8, 2011',
  },
  'moxi-3g-next-generation-hearing-instrument': {
    alt: 'Moxi 3G hearing instruments in two finishes, graphite and silver, each shown as a pair',
    slug: 'moxi-3g-hearing-instrument', name: 'Moxi 3G Hearing Instrument', short: 'Moxi 3G',
    description: 'A wireless 312 CRT (canal receiver technology) hearing instrument that puts advanced technology into a small, discreet design.',
    details: ['The Moxi 3G carries the design language of the Swift, and gives hearing professionals fitting options for mild to moderately severe hearing loss.'],
    launch: ['Launched', '2010'],
    source: 'Portfolio page; News, October 12, 2010',
  },
  'yuleys-protective-footwear': {
    alt: 'Pair of blue one-piece protective overshoes, one turned to show the sole',
    slug: 'yuleys-protective-footwear', name: 'Yuleys Protective Footwear', short: 'Yuleys footwear',
    description: 'Patented one-piece protective footwear in thermoplastic rubber (TPR) for tradespeople’s work boots, to protect floors from dirt and damage.',
    materials: 'Thermoplastic rubber (TPR), one piece',
    awards: ['2011, 2nd place, Javelin/SolidWorks “Cool” Design Contest'],
    source: 'Portfolio page; About (awards); News, January 1, 2012',
  },
  'smart-alert-remote-control-alerting-sytem': {
    alt: 'Black Smart Alert remote control with a red button and icon keys',
    slug: 'smart-alert-remote-control', name: 'Smart Alert Remote Control', short: 'Smart Alert remote',
    client: 'Unitron',
    description: 'The remote control for Unitron’s Smart Alert, the first fully integrated hearing and household alerting system, developed with Bellman & Symfon of Sweden.',
    details: ['When the doorbell, telephone or smoke detector sounds, the remote shows an event-specific icon, vibrates and sends beeps directly to the hearing instruments. At night it sits in a nightstand charger connected to a bed shaker, so alerts continue around the clock.'],
    source: 'Portfolio page; News, May 12, 2010',
  },
  'mito-office-seating-evolve-italla': {
    alt: 'Three MITO chairs: dark green on a cantilever frame, blue on a swivel base, black on four legs',
    slug: 'mito-office-seating', name: 'MITO Office Seating, Evolve Italla', short: 'MITO seating',
    description: 'An office seating line designed to be comfortable, ergonomic, simple and elegant: strong yet lightweight, flexible and affordable.',
    source: 'Portfolio page',
  },
  'shift-ultra-small-hearing-instrument': {
    alt: 'Two Shift hearing instruments, one silver and one dark plum, with receiver wires',
    slug: 'shift-ultra-small-hearing-instrument', name: 'Shift Ultra-Small Hearing Instrument', short: 'Shift',
    client: 'Unitron',
    description: 'A tiny, virtually invisible behind-the-ear hearing instrument that is comfortable to wear.',
    details: ['Announced by Unitron at AudiologyNOW! 2009 in Dallas. Its shells and spines can be interchanged in the office to match skin tone, hair colour or personal style.'],
    launch: ['Introduced', 'AudiologyNOW!, Dallas, 2009'],
    source: 'Portfolio page; News, April 14 and June 14, 2009',
  },
  'big-book-clip-classroom-spring-loaded-clip': {
    alt: 'Big Book clips in purple, green and orange, with an inset of clips holding a big book in a classroom',
    slug: 'big-book-clip', name: 'Big Book Classroom Spring-Loaded Clip', short: 'Big Book clip',
    description: 'A spring-loaded plastic clip with an elastomeric overmold, for clipping and hanging big books in classrooms.',
    materials: 'Plastic with elastomeric overmold',
    source: 'Portfolio page',
  },
  'classroom-audio-pod-listening-center': {
    alt: 'Blue Audio Pod listening centre with headphones arranged around a portable CD player',
    slug: 'classroom-audio-pod', name: 'Classroom Audio Pod Listening Centre', short: 'Audio Pod',
    description: 'A rugged classroom multimedia player and listening centre, in tabletop and rolling models.',
    source: 'Portfolio page',
  },
  'stubby-tubby-premiumshallow-tubs': {
    alt: 'Stack of grey shallow tubs beside one tub filled with building bricks',
    slug: 'stubby-tubby-shallow-tubs', name: 'Stubby Tubby Shallow Tubs', short: 'Stubby Tubby',
    description: 'Premium low-profile, multi-purpose utility tubs for schools, daycares and libraries.',
    source: 'Portfolio page',
  },
  'slim-asymmetric-twister-armrest': {
    alt: 'Black slim Twister armrest in three views',
    slug: 'twister-armrest', name: 'Slim Asymmetric Twister Armrest', short: 'Twister armrest',
    description: 'A slim, asymmetric armrest that pivots a full 360 degrees, created for one of North America’s leading manufacturers of office seating.',
    details: ['The armrest stops or locks in any position. Its mechanism combines structural die-cast zinc and polyurethane foam components, and its final design was validated with structural FEA (finite element analysis) and 3D rapid prototyping.'],
    materials: 'Structural die-cast zinc, polyurethane foam',
    launch: ['Launched', 'NeoCon, Chicago, 2008'],
    source: 'Portfolio page; News, April 14, 2007 and June 14, 2008',
  },
  'premium-packaging-hearing-instruments': {
    alt: 'Black hard case for hearing instruments shown open and closed, with a blue case concept rendering',
    slug: 'premium-packaging-hearing-instruments', name: 'Hearing Instrument Packaging', short: 'Instrument packaging',
    description: 'Premium hard-case packaging for carrying and storing hearing instruments.',
    details: ['A three-part system: an injection-molded hard case with soft molded elastomeric inlays, a large thermoformed EVA carrying case and a small case.'],
    materials: 'Injection-molded hard case, elastomeric inlays, thermoformed EVA',
    source: 'Portfolio page; News, January 14, 2008',
  },
  'premium-classroom-teaching-easel-station': {
    alt: 'Teaching easel station in use in a classroom, with close-ups of its storage bins',
    slug: 'classroom-teaching-easel-station', name: 'Classroom Teaching Easel Station', short: 'Teaching easel',
    description: 'A premium classroom easel station that makes teaching and learning easier and more efficient.',
    source: 'Portfolio page',
  },
  'small-back-back-tabletop-easel': {
    alt: 'Blue and white folding tabletop easel with dry-erase surfaces, shown open, folded and in use by a child',
    slug: 'back-to-back-tabletop-easel', name: 'Small Back-to-Back Tabletop Easel', short: 'Tabletop easel',
    description: 'A compact, portable and lightweight folding plastic tabletop easel with magnetic dry-erase surfaces.',
    source: 'Portfolio page',
  },
  'clip-zip-classroom-spring-loaded-clip': {
    alt: 'Clip-A-Zip clips in purple, green and yellow, with insets of a child using them',
    slug: 'clip-a-zip', name: 'Clip-A-Zip Classroom Spring-Loaded Clip', short: 'Clip-A-Zip',
    description: 'A clipping and hanging system for classroom zip-closure bags.',
    source: 'Portfolio page',
  },
  'smart-alert-remote-control-alerting-system': {
    alt: 'Black remote printed “smart control” with a green key, with insets of other views and concept renders',
    slug: 'smart-control-remote', name: 'Smart Control Remote', short: 'Smart Control remote',
    description: 'A compact, ergonomic wireless handheld remote control for hearing instruments.',
    source: 'Portfolio page (listed on the live site as a second “Smart Alert Remote Control Alerting System”; the remote in the image is printed “smart control”; identity and client to confirm with Aldo)',
  },
  'concierge-springboard-retail-networks': {
    alt: 'Concierge touch-screen handle mounted on a shopping cart, in three photographs',
    slug: 'concierge-shopping-cart-handle', name: 'Concierge Shopping Cart Handle', short: 'Concierge',
    client: 'Springboard Retail Networks',
    description: 'A smart, wireless, interactive touch-screen computer built into a shopping cart handle.',
    credit: 'Design and engineering development collaboration by Evolve Design Solutions with Vervian Design Group',
    source: 'Portfolio page',
  },
  'classroom-teaching-easel-adjustable-book-ledge': {
    alt: 'Blue book ledge holding a big book and markers, with insets of a teacher at the easel and a part render',
    slug: 'teaching-easel-book-ledge', name: 'Adjustable Book Ledge', short: 'Book ledge',
    description: 'A spring-loaded, removable and adjustable plastic book ledge for the classroom teaching easel, holding big books and dry-erase markers.',
    source: 'Portfolio page',
  },
  'safety-cap-classroom-teaching-easel-book-ledge-end-caps': {
    alt: 'Blue book ledge with its end cap, with insets of the easel in use and a black end cap render',
    slug: 'safety-cap-end-caps', name: 'Safety Cap Book Ledge End Caps', short: 'Safety Cap',
    description: 'Plastic end caps for the spring-loaded, removable and adjustable book ledge of the classroom teaching easel.',
    source: 'Portfolio page',
  },
  'stack-n-nest-tubs': {
    alt: 'Stack ’N’ Nest tubs in green, yellow and blue holding books, with insets of stacked and nested tubs',
    slug: 'stack-n-nest-tubs', name: 'Stack ’N’ Nest Tubs', short: 'Stack ’N’ Nest',
    description: 'A line of three plastic multi-purpose utility tubs for schools, daycares and libraries.',
    source: 'Portfolio page',
  },
  'chart-caddy-accessory': {
    alt: 'Gold rendering of the Chart Caddy hanging accessory, with photographs of charts hanging from it',
    slug: 'chart-caddy', name: 'Chart Caddy Accessory', short: 'Chart Caddy',
    description: 'A plastic hanging accessory for classroom charts, maps and posters.',
    source: 'Portfolio page',
  },
  'astrostart-remote-key-fob-astroflex': {
    alt: 'Black Astrostart key fob held in a hand, with insets of its keypad lit in blue and coloured fobs',
    slug: 'astrostart-remote-key-fob', name: 'Astrostart Remote Key Fob', short: 'Astrostart fob',
    client: 'Astroflex',
    description: 'A smart RF remote control and engine starter for cars.',
    source: 'Portfolio page',
  },
  'isotherm-3000-thermostat-c-mac-energy-system': {
    alt: 'White wall-mounted Isotherm thermostat with a small digital display',
    slug: 'isotherm-3000-thermostat', name: 'Isotherm 3000 Thermostat', short: 'Isotherm 3000',
    client: 'C-MAC Energy & System',
    description: 'A sophisticated electronic wall-mounted thermostat for homes. More than one million units have been manufactured and installed.',
    source: 'Portfolio page',
  },
  'office-seating-bouty-dharma-teknionvertex-composites': {
    alt: 'Office chairs from the two seating lines, in purple, orange, blue and grey, on dark studio grounds',
    slug: 'office-seating-bouty-dharma', name: 'Bouty Dharma Office Seating', short: 'Dharma seating',
    client: 'Bouty, and Teknion (Vertex Composites)',
    description: 'Two lines of office chairs: a line of ergonomic office chairs (left), and an award-winning line of dynamic-movement task and general office chairs (right).',
    awards: ['1991, two SPI Awards of Excellence, Business Equipment and Innovation'],
    source: 'Portfolio page; About (awards)',
  },
  'workmate-375-black-decker': {
    alt: 'Grey Workmate 375 with red clamps, shown as a worktop and standing on its folding legs',
    slug: 'workmate-375', name: 'Workmate 375', short: 'Workmate 375',
    client: 'Black & Decker',
    description: 'An award-winning portable project centre that is easy to deploy and folds for storage.',
    awards: ['2003, National Post Design Exchange (DX), Bronze Award'],
    source: 'Portfolio page; About (awards)',
  },
  'cross-country-ski-poles-industrie-lafleche': {
    alt: 'Illustrations of a cross-country skier racing with the poles',
    slug: 'cross-country-ski-poles', name: 'Cross-Country Ski Poles', short: 'Ski poles',
    client: 'Industrie Lafleche',
    description: 'Ultralight, high-performance cross-country ski poles for competition.',
    source: 'Portfolio page',
  },
  'elan-desktop-fan-caframo': {
    alt: 'White Elan desktop fan with five clear blades edged in blue',
    slug: 'elan-desktop-fan', name: 'Elan Desktop Fan', short: 'Elan fan',
    client: 'Caframo',
    description: 'A personal electric desktop fan with five soft-edged aerodynamic blades.',
    source: 'Portfolio page',
  },
  'disposable-cutlery-set-industries-sansfacon': {
    alt: 'Five-piece white disposable cutlery set on a dark textured ground',
    slug: 'disposable-cutlery-set', name: 'Disposable Cutlery Set', short: 'Cutlery set',
    client: 'Industries Sansfacon',
    description: 'A line of five-piece, medium-weight disposable plastic cutlery for the fast food industry, made in high volume.',
    awards: ['1997, I.D. Magazine Annual Design Review, Excellence Award'],
    source: 'Portfolio page; About (awards)',
  },
  'painting-tray-system-prak-tik': {
    alt: 'Blue painting tray with a roller on an extension handle',
    slug: 'painting-tray-system', name: 'Painting Tray System', short: 'Painting tray',
    client: 'Prak-Tik',
    description: 'A novel plastic painting tray system.',
    source: 'Portfolio page',
  },
  'pool-security-ladder-waterpik-technologiesacm-olympic': {
    alt: 'White all-plastic above-ground pool ladder, with a close-up detail of the ladder',
    slug: 'pool-security-ladder', name: 'Pool Security Ladder', short: 'Pool ladder',
    client: 'Waterpik Technologies (ACM Olympic)',
    description: 'An all-plastic security ladder for above-ground swimming pools.',
    materials: 'All plastic',
    source: 'Portfolio page',
  },
  'workmate-portable-paint-station-black-decker': {
    alt: 'Paint station with red paint trays on a black folding stand, with insets of the trays being stowed',
    slug: 'workmate-paint-station', name: 'Workmate Portable Paint Station', short: 'Paint station',
    client: 'Black & Decker',
    description: 'A stowable paint station that folds compactly and stores painting tools.',
    awards: ['2005, National Post Design Exchange (DX), Bronze Award'],
    source: 'Portfolio page; About (awards)',
  },
  'mc-series-deskset-controllers-motorola-cml-emergeency-services': {
    alt: 'Black MC Series deskset telephones, with insets of an exploded part view and a keypad layout',
    slug: 'mc-series-deskset-controllers', name: 'MC Series Deskset Controllers', short: 'MC deskset',
    client: 'Motorola (CML Emergency Services)',
    description: 'A line of modular, rugged deskset telephones for radio dispatch and emergency response.',
    source: 'Portfolio page',
  },
};

// Credits for Aldo's earlier work, cleaned from the live site's credit lines.
export const earlierCredit = {
  'Developed by Aldo Balatti and design team at DW and Camalor Mfg.': { firm: 'DW', credit: 'Developed by Aldo Balatti and the design team at DW and Camalor Mfg.' },
  'Developed by Aldo Balatti and design team at DW': { firm: 'DW', credit: 'Developed by Aldo Balatti and the design team at DW' },
  'Developed by Aldo Balatti and design team at GID': { firm: 'GID Design', credit: 'Developed by Aldo Balatti and the design team at GID' },
  'Developed by Aldo Balatti at GID': { firm: 'GID Design', credit: 'Developed by Aldo Balatti at GID' },
};

// Services, from the Services page. Lists verbatim with small typo fixes.
export const services = [
  {
    key: 'project-management', name: 'Project management',
    summary: 'Clear expectations, schedules and regular progress updates, for small and Fortune 500 companies alike.',
    image: { src: 'https://www.evolve-designsolutions.com/wp-content/uploads/2016/02/Project_management_image.jpg', w: 1224, h: 868, alt: 'Rendering of a handheld remote with a red alert key, in top, front, side and back views, with its belt clip' },
    body: [
      'A design program starts with planning and due diligence. We define expectations and responsibilities, set communication procedures and schedules, and ask the questions that make the difference between a delay and a job done on time.',
      'You get progress updates at regular intervals, so you know the status of the project at any time. Our methodology tracks milestones to keep the work on task and on budget, for small companies and Fortune 500 companies alike.',
    ],
    items: ['Planning and initial due diligence', 'Responsibilities and expectations', 'Communication procedures and schedules', 'Milestone and progress tracking', 'Regular progress updates'],
  },
  {
    key: 'research', name: 'Research',
    summary: 'Market and user understanding that turns field data into a strategy for the product.',
    image: { src: 'https://www.evolve-designsolutions.com/wp-content/uploads/2016/02/Research_image.jpg', w: 1224, h: 868, alt: 'Two hands holding a grey foam form model of a flat, tablet-shaped device' },
    body: [
      'Information is the start of good design. It defines the problem, finds the opportunity and sets the objectives and design criteria for the design and manufacturing phases.',
      'Our research builds a market and user-centred understanding of your business, and finds what makes a product more appealing to the end user or the buyer: features, ergonomics, aesthetics, colour, graphics or packaging. We turn raw field data into a strategy for product innovation.',
    ],
    items: ['Market and user research', 'Competitive analysis', 'Patent review', 'Design criteria and objectives', 'Field data into product strategy'],
  },
  {
    key: 'industrial-design', name: 'Industrial design',
    summary: 'Concepts, form and design language that add functional, emotional, cultural and social value.',
    image: { src: 'https://www.evolve-designsolutions.com/wp-content/uploads/2016/02/Industrial_design_image.jpg', w: 1224, h: 868, alt: 'Marker renderings of a rugged square device with rubber corner bumpers and a connector panel, in front, side, top and angled views' },
    body: [
      'By finding and strengthening the functional, emotional, cultural and social benefits of a product, we raise its value to the person who uses it.',
      'We observe and brainstorm, develop functional concepts, suggest new features and better materials, and create design languages that encourage ownership and build strong brands, for challenging products and for the simplest ones.',
    ],
    items: ['Conceptual development', 'Ergonomic evaluation', 'Product semantics exploration', 'Product styling', 'Appearance and design language development', 'Form study mock-ups and models', 'Colour and form studies', 'Product graphics'],
  },
  {
    key: 'mechanical-design', name: 'Mechanical design',
    summary: 'Mechanisms and electro-mechanical solutions, from quick proofs of concept to long programs.',
    image: { src: 'https://www.evolve-designsolutions.com/wp-content/uploads/2016/02/Mechanical_design_image.jpg', w: 1224, h: 868, alt: 'Exploded render of a grey Unitron Hearing remote: housing, circuit boards, battery, inner frame and screws' },
    body: [
      'Mechanical design for every stage of development, complementing your own team’s strengths: from quick-turnaround proof-of-concept projects to sustained innovation programs.',
      'Our mechanical design and engineering resources bring experience across many industries and applications.',
    ],
    items: ['Simple to complex mechanism development', 'Electro-mechanical development solutions', '3D CAD virtual mechanical prototyping', 'Physical design intent prototypes', 'Mechanical components sourcing', 'Reverse engineering'],
  },
  {
    key: 'product-engineering', name: 'Product engineering',
    summary: 'Engineering from the start of a project, so the design meets its function and its manufacturing.',
    image: { src: 'https://www.evolve-designsolutions.com/wp-content/uploads/2016/02/Product_engineering_image.jpg', w: 1224, h: 868, alt: 'Finite element stress plot of a ribbed molded part, with the 60.5 MPa peak marked in the overmolding region' },
    body: [
      'Engineering expertise and manufacturing know-how set Evolve apart from other design firms. Our multidisciplinary approach keeps the design intent of the original concept intact in the final product.',
      'Whether the project is a new technology or a new design around an existing platform, engineering is involved from the start, so the design meets its functional requirements and its manufacturing needs. Our team works closely with designers, clients and manufacturing partners.',
    ],
    items: ['Materials, finishes and processes (plastics and metal)', 'Plastics, sheet metal, die casting, extrusion, stamping', 'Tolerance and dimensional analysis', 'DFMA (design for manufacture and assembly)', '3D CAD solid and surface modelling', '2D CAD control drawings and documentation', 'Structural FEA, thermal and CFD analysis', 'Regulatory compliance', 'EMI/RFI and ESD solutions', 'Performance, environmental, quality and safety compliance'],
  },
  {
    key: 'plastics-engineering', name: 'Plastics engineering',
    summary: 'Over 700 injection-molded parts engineered. Part design, materials, mold filling and tooling.',
    image: { src: 'https://www.evolve-designsolutions.com/wp-content/uploads/2016/02/Plastics_engineering_image.jpg', w: 1224, h: 868, alt: 'Mold filling simulation of three plastic parts and their runner system, coloured by fill time' },
    body: [
      'A successful plastic product needs part design optimization, material selection, feasibility, cost evaluation, mold design, process selection and prototyping. Our plastics experience covers a wide range of end-use applications: injection molding, part design, material selection, insert molding, gas assist, assembly, painting and decorating.',
      'Our computer-aided engineering (CAE) makes sure your parts are designed for the resins and processes you choose, which reduces prototyping, tooling and physical testing costs.',
    ],
    items: ['Injection-molded part engineering (over 700 parts)', 'Materials and processes review and selection', 'Mold filling, warping and cooling analysis', 'Impact and cyclic non-linear FEA', 'Part and tooling cost quotation and evaluation', 'Domestic and offshore vendor sourcing and qualification', 'Tooling design and build review and supervision', 'Thermoforming, extrusion, blow molding and rotomolding'],
  },
  {
    key: 'prototyping', name: 'Prototyping',
    summary: 'Mock-ups, models and engineering prototypes that prove form, fit and function before release.',
    image: { src: 'https://www.evolve-designsolutions.com/wp-content/uploads/2016/02/Prototyping_image.jpg', w: 700, h: 496, alt: 'Open blue silicone mold holding an orange cast prototype part' },
    body: [
      'Mock-ups, volumetric and visual models and engineering validation prototypes prove out form, fit, function and user acceptance before engineering is finalized and the design is released to manufacturing.',
      'Prototypes also support marketing and sales while production ramps up.',
    ],
    items: ['Mock-ups, volumetric, visual and functional models', 'MJM, SLA, SLS and FDM rapid prototypes', 'Urethane, epoxy and polyester casting', 'Metal forming and fabrication', 'Plastic and metal CNC machining', 'Thermoforming', 'Finishing, painting, decorating and graphics', 'Assembly and wiring of functional prototypes', 'Prototype build management', 'Small volume production runs'],
  },
  {
    key: 'manufacturing-support', name: 'Manufacturing support',
    summary: 'Sourcing, tooling supervision and launch support that keep the design intent through production.',
    image: { src: 'https://www.evolve-designsolutions.com/wp-content/uploads/2016/02/Manufacturing_support_image.jpg', w: 1224, h: 868, alt: 'Clear dome-shaped part on the core of an injection mold, inside the molding machine' },
    body: [
      'We bring manufacturing insight to specifications, materials and design for manufacturing, so the design intent is preserved through the production launch. We also advise your manufacturing and management teams on supply chain, inventory and production questions.',
      'Our vendor database covers domestic and worldwide tooling and production manufacturers. We can draw on it, or find and qualify new vendors for your project, then set expectations, responsibilities and schedules through production ramp-up.',
    ],
    items: ['Part and tooling cost quotation and evaluation', 'Domestic and offshore vendor sourcing and qualification', 'Tooling design and build review and supervision', 'First article inspection and ECO management', 'In-progress quality inspection and testing', 'Pilot production and rollout supervision'],
  },
];

// The 4D process, from the 4D Process page.
export const phases = [
  {
    verb: 'Discover', line: 'Discover new opportunities', goal: 'Research new opportunities',
    summary: 'Research the market, the users, the competition and existing patents, then set the target costs and the critical design goals.',
    tasks: ['Collect project information, data and components', 'Review competitive analysis', 'Review existing patents', 'Attend user focus groups or review their data', 'Identify new technology, market trends and customer needs', 'Review objectives, mechanical requirements, target costs and timeline', 'Establish the project’s critical design goals'],
  },
  {
    verb: 'Define', line: 'Define the idea', goal: 'Explore and define new ideas',
    summary: 'Explore concepts and usability, lay out the engineering, study feasibility, and set specifications and preliminary tooling costs.',
    tasks: ['Explore concepts, aesthetics and usability', 'Product engineering layouts', 'Feasibility studies and report', 'Establish product specifications', 'Research technologies, components and suppliers', 'Define preliminary component and tooling costs', 'Explore product graphics, branding and user interface'],
  },
  {
    verb: 'Design', line: 'Design and validate', goal: 'Prove out and validate concepts',
    summary: 'Finalize the form, build the 3D CAD and production drawings, qualify suppliers and prove form, fit and function with working models.',
    tasks: ['Finalize product aesthetics', 'Identify and qualify suppliers', 'Preliminary 3D CAD parts and assemblies', 'Preliminary 2D production documentation', 'Performance, quality and test plan specifications', 'Product standards and certifications to meet', 'Validate form, fit, function and design intent', 'Validate and test functional models', 'Refine product graphics and branding'],
  },
  {
    verb: 'Deliver', line: 'Deliver the launch', goal: 'Ensure a successful product launch',
    summary: 'Run FEA and mold filling analysis, finalize the bill of materials, manage engineering changes and support the production launch.',
    tasks: ['Finalize aesthetics, colours, graphics and finishes', 'Design, quality and safety reviews', 'Final 3D CAD parts and assemblies', 'Final 2D production documentation', 'FEA and mold filling analysis', 'Support the production launch', 'Evaluate manufacturing requests', 'Assist in product testing', 'Implement engineering change orders (ECOs)', 'Finalize the bill of materials (BOM)', 'Benchmark and refine the production process'],
  },
];

// Testimonial order on the About page: site order. The home page shows one as a letter.
export const homeLetter = 'Richard Peters';
