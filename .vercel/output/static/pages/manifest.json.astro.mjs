import { g as getImage } from '../chunks/_astro_assets_DAFinSj8.mjs';
import { i as icon } from '../chunks/icon_CZUH5cw5.mjs';
export { renderers } from '../renderers.mjs';

const maskableIcon = new Proxy({"src":"/_astro/icon-maskable.C1A7b-dw.png","width":1024,"height":1024,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/Tomas.Herrou/ScrewFast-main/src/images/icon-maskable.png";
							}
							if (target[name] !== undefined && globalThis.astroAsset) globalThis.astroAsset?.referencedImages.add("/Users/Tomas.Herrou/ScrewFast-main/src/images/icon-maskable.png");
							return target[name];
						}
					});

const sizes = [192, 512];
const favicons = [
  {
    purpose: "any",
    src: icon,
    sizes
  },
  {
    purpose: "maskable",
    src: maskableIcon,
    sizes
  }
];
const GET = async () => {
  const icons = await Promise.all(
    favicons.flatMap(
      (favicon) => favicon.sizes.map(async (size) => {
        const image = await getImage({
          src: favicon.src,
          width: size,
          height: size,
          format: "png"
        });
        return {
          src: image.src,
          sizes: `${image.options.width}x${image.options.height}`,
          type: `image/${image.options.format}`,
          purpose: favicon.purpose
        };
      })
    )
  );
  const manifest = {
    short_name: "ScrewFast",
    name: "ScrewFast",
    icons,
    display: "minimal-ui",
    id: "/",
    start_url: "/",
    theme_color: "#FFEDD5",
    background_color: "#262626"
  };
  return new Response(JSON.stringify(manifest));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
