export const processResponse = async (r) => {
  let data = await r.json();

  if (r.ok) {
    return data;
  } else {
    throw data;
  }
};

export const AWSBackends = {
  development: {
    rest: "http://localhost:3333",
    ws: "ws://localhost:3333",
  },
  staging: {
    rest: "https://b7zq1axq3i.execute-api.us-west-2.amazonaws.com",
    ws: "wss://89hbkmvydi.execute-api.us-west-2.amazonaws.com/staging",
  },
  production: {
    rest: "https://r9hdnojia7.execute-api.us-west-2.amazonaws.com",
    ws: "wss://3um2jcl7x3.execute-api.us-west-2.amazonaws.com/production",
  },
};

export const Frontends = {
  development: {
    rest: "http://localhost:3000",
  },
  staging: {
    rest: "https://tool.agape.land",
  },
  production: {
    rest: "https://tool.agape.land",
  },
};

export const RunnerEnds = {
  development: {
    rest: "http://localhost:3003",
  },
  staging: {
    rest: "https://agape-stack-turbo-ugc-gui.vercel.app",
  },
  production: {
    rest: "https://agape-stack-turbo-ugc-gui.vercel.app",
  },
};

export const getBackendBaseURL = () => {
  // let services = await arc.services();

  // console.log(services, "process.env.NODE_ENV", process.env.ARC_ENV);
  if (
    process.env.ARC_ENV === "production" ||
    process.env.NODE_ENV === "production"
  ) {
    return AWSBackends["production"];
  } else if (
    process.env.ARC_ENV === "testing" ||
    process.env.NODE_ENV === "testing" ||
    process.env.NODE_ENV === "development"
  ) {
    return AWSBackends["development"];
  } else if (
    process.env.ARC_ENV === "staging" ||
    process.env.NODE_ENV === "staging"
  ) {
    return AWSBackends["staging"];
  }
};

export const getFrontendBaseURL = () => {
  // console.log(services, "process.env.NODE_ENV", process.env.ARC_ENV);
  if (
    process.env.ARC_ENV === "production" ||
    process.env.NODE_ENV === "production"
  ) {
    return Frontends["production"];
  } else if (
    process.env.ARC_ENV === "testing" ||
    process.env.NODE_ENV === "testing" ||
    process.env.NODE_ENV === "development"
  ) {
    return Frontends["development"];
  } else if (
    process.env.ARC_ENV === "staging" ||
    process.env.NODE_ENV === "staging"
  ) {
    return Frontends["staging"];
  }
};

export const PostProcessingModes = [
  {
    key: "wireframe",
    name: "Wireframe",
  },
  {
    key: "standard",
    name: "Standard",
  },

  {
    key: "postproc",
    name: "PostProcessing",
  },

  {
    key: "inspect",
    name: "Inspect",
  },

  {
    key: "game",
    name: "Game",
  },
];

export const InsepctionModes = [
  {
    key: "combined",
    name: "Combined",
  },
  {
    key: "color",
    name: "Color",
  },
  {
    key: "normal",
    name: "Normal",
  },
  {
    key: "ao",
    name: "Ambient Occlusion",
  },
  {
    key: "roughnessMetalness",
    name: "Roughness Metalic",
  },
];

export const GameModes = [
  {
    key: "orbit",
    label: "Product",
  },
  {
    key: "street",
    label: "World",
  },
  {
    key: "room",
    label: "Room",
  },
];
