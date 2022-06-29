import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const MAPBOX_GL_TOKEN = publicRuntimeConfig.MAPBOX_GL_TOKEN;
