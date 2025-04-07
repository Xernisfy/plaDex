const regionNames = ['og', 'rs', 'kk', 'kh', 'wf', 'rz'] as const;
const dexRegions: Record<
  typeof regionNames[number],
  (number | [number, number])[]
> = {
  og: [[10, 83], [86, 88], [127, 129], [154, 156], 226, 233],
  rs: [
    [10, 11],
    [34, 36],
    [39, 40],
    [43, 48],
    [53, 57],
    [66, 71],
    [89, 132],
    [136, 138],
    [140, 141],
    227,
    234,
  ],
  kk: [
    [10, 14],
    [18, 22],
    [25, 33],
    [37, 38],
    [41, 50],
    [53, 57],
    [68, 71],
    [78, 88],
    [95, 96],
    [99, 100],
    [127, 129],
    [140, 141],
    [143, 176],
    228,
    232,
  ],
  kh: [
    [15, 17],
    [34, 36],
    [43, 50],
    [53, 54],
    [66, 69],
    [72, 75],
    [80, 81],
    [89, 92],
    [97, 100],
    [105, 108],
    [110, 124],
    [136, 138],
    [154, 156],
    [166, 167],
    [177, 204],
    230,
  ],
  wf: [
    [10, 11],
    [25, 38],
    [43, 52],
    [58, 60],
    [64, 65],
    [78, 79],
    [86, 88],
    [101, 104],
    [125, 126],
    [136, 138],
    [152, 156],
    [158, 160],
    [166, 167],
    [180, 189],
    [195, 198],
    [202, 207],
    [212, 225],
    229,
    231,
  ],
  rz: [[1, 9], [133, 135], [208, 211]],
};
const regions: Record<string, string[]> = {};
for (const region of regionNames) {
  const dexRegion = dexRegions[region];
  for (const indexes of dexRegion) {
    let f, t;
    if (Array.isArray(indexes)) [f, t] = indexes;
    else f = indexes, t = indexes;
    for (let i = f; i <= t; ++i) {
      const index = i.toString();
      if (!regions[index]) regions[index] = [];
      regions[index].push(region);
    }
  }
}
for (let i = 1; i <= 242; ++i) {
  const index = i.toString();
  if (!regions[index]) regions[index] = ['??'];
}
Deno.writeTextFileSync(
  import.meta.dirname + '/regions.json',
  JSON.stringify(regions, null, 2),
);
