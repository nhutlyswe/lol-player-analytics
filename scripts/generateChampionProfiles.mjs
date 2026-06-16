const DATA_DRAGON_ROUTING = "ddragon.leagueoflegends.com";

const roleTagMap = {
  Marksman: ["adc"],
  Mage: ["mid", "support"],
  Assassin: ["mid", "jungle", "top"],
  Fighter: ["top", "jungle"],
  Tank: ["top", "support", "jungle"],
  Support: ["support"]
};

const traitWeightsByTag = {
  Marksman: { ADC: 0.95, Carry: 0.9, Poke: 0.6, Skirmisher: 0.4 },
  Mage: { Mage: 0.95, Poke: 0.8, Utility: 0.6, Burst: 0.7 },
  Assassin: { Assassin: 0.95, Burst: 0.9, Mobility: 0.8, Squishy: 0.3 },
  Fighter: { Bruiser: 0.9, Skirmisher: 0.7, SustainedDamage: 0.6, Engage: 0.5 },
  Tank: { Tank: 0.95, Engage: 0.8, Peel: 0.6, Utility: 0.5 },
  Support: { Support: 0.95, Enchanter: 0.8, Utility: 0.75, Peel: 0.65 }
};

function mergeTraitWeights(target, source) {
  for (const [trait, weight] of Object.entries(source)) {
    target[trait] = Math.max(target[trait] ?? 0, weight);
  }
}

async function getLatestDdragonVersion() {
  const response = await fetch(`https://${DATA_DRAGON_ROUTING}/api/versions.json`);
  const versions = await response.json();
  return versions[0];
}

async function getChampionData(version) {
  const response = await fetch(
    `https://${DATA_DRAGON_ROUTING}/cdn/${version}/data/en_US/champion.json`
  );
  const data = await response.json();
  return Object.values(data.data);
}

function buildRoles(tags) {
  const roles = new Set();
  for (const tag of tags) {
    const mapped = roleTagMap[tag];
    if (mapped) {
      mapped.forEach((role) => roles.add(role));
    }
  }
  return Array.from(roles);
}

async function generateChampionProfiles() {
  const version = await getLatestDdragonVersion();
  const championData = await getChampionData(version);

  const champions = championData.map((champ) => {
    const roles = buildRoles(champ.tags);
    const suggestedTraits = {};

    for (const tag of champ.tags) {
      const weights = traitWeightsByTag[tag];
      if (weights) mergeTraitWeights(suggestedTraits, weights);
    }

    return {
      champion: champ.name,
      roles,
      suggestedTraits
    };
  });

  console.log(JSON.stringify({ champions }, null, 2));
}

generateChampionProfiles().catch((error) => {
  console.error(error);
  process.exit(1);
});