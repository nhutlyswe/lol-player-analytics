const DATA_DRAGON_ROUTING = "ddragon.leagueoflegends.com";

const roleTagMap = {
  Marksman: ["adc"],
  Mage: ["mid", "adc", "support"],
  Assassin: ["top", "jungle", "mid"],
  Fighter: ["top", "jungle"],
  Tank: ["top", "jungle", "support"],
  Support: ["support"]
};

const traitWeightsByTag = {
  Marksman: {
    Scaling: 0.9,
    Teamfight: 0.8,
    AntiTank: 0.8,
    Siege: 0.7,
    Skirmish: 0.6,
    Poke: 0.5,
    Waveclear: 0.4
  },

  Mage: {
    Burst: 0.8,
    Poke: 0.8,
    Teamfight: 0.7,
    Waveclear: 0.7,
    ZoneControl: 0.6,
    Siege: 0.5,
    Scaling: 0.5
  },

  Assassin: {
    Burst: 0.95,
    Pick: 0.9,
    Mobility: 0.8,
    Roaming: 0.7,
    Skirmish: 0.7,
    EarlyGame: 0.5
  },

  Fighter: {
    Skirmish: 0.9,
    Dive: 0.7,
    Frontline: 0.6,
    EarlyGame: 0.6,
    Sustain: 0.6,
    SplitPush: 0.5,
    Teamfight: 0.4
  },

  Tank: {
    Frontline: 0.95,
    Engage: 0.85,
    Peel: 0.8,
    Teamfight: 0.8,
    AntiBurst: 0.6,
    AntiDive: 0.6,
    CC: 0.6
  },

  Support: {
    Utility: 0.9,
    Peel: 0.8,
    VisionControl: 0.7,
    Disengage: 0.6,
    Engage: 0.5,
    AntiDive: 0.5,
    CC: 0.5
  }
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