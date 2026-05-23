import lume from "lume/mod.ts";
import plugins from "./plugins.ts";

const site = lume({
  src: "./src",
  location: new URL("https://paimoe.icu"),
});

site.use(await plugins());

export default site;
