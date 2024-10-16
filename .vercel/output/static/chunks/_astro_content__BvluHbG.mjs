import { Traverse } from 'neotraverse/modern';
import pLimit from 'p-limit';
import { r as removeBase, i as isRemotePath, V as VALID_INPUT_FORMATS, A as AstroError, U as UnknownContentCollectionError, p as prependForwardSlash } from './astro/assets-service_BirIaONZ.mjs';
import { a as createComponent, i as renderUniqueStylesheet, j as renderScriptElement, k as createHeadAndContent, r as renderTemplate, d as renderComponent, u as unescapeHTML } from './astro/server_gDiTGxCh.mjs';
import 'kleur/colors';
import * as devalue from 'devalue';

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1);
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

class DataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('./_astro_data-layer-content_BcEe_9wP.mjs');
      if (data.default instanceof Map) {
        return DataStore.fromMap(data.default);
      }
      const map = devalue.unflatten(data.default);
      return DataStore.fromMap(map);
    } catch {
    }
    return new DataStore();
  }
  static async fromMap(data) {
    const store = new DataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = DataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://screwfast.uk", "SSR": true};
function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport,
  cacheEntriesByCollection
}) {
  return async function getCollection(collection, filter) {
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('./_astro_asset-imports_D9aVaOQr.mjs');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        const entry = {
          ...rawEntry,
          data,
          collection
        };
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Ensure a collection directory with this name exists.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign(__vite_import_meta_env__, { _: process.env._ })?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = cacheEntriesByCollection.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (hasFilter) {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new Traverse(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        ctx.update(imported);
      } else {
        ctx.update(src);
      }
    }
  });
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const contentDir = '/src/content/';

const contentEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/en/post-1.md": () => import('./post-1_D2Muvkfq.mjs'),"/src/content/blog/en/post-2.md": () => import('./post-2_DZgHUBMi.mjs'),"/src/content/blog/en/post-3.md": () => import('./post-3_CsmdhBcj.mjs'),"/src/content/blog/fr/post-1.md": () => import('./post-1_CDyjdkC3.mjs'),"/src/content/blog/fr/post-2.md": () => import('./post-2_Cdtg_0Gr.mjs'),"/src/content/blog/fr/post-3.md": () => import('./post-3_BD9R0kub.mjs'),"/src/content/docs/advanced/technical-specifications.mdx": () => import('./technical-specifications_UWuVY2Eg.mjs'),"/src/content/docs/construction/custom-solutions.mdx": () => import('./custom-solutions_C_JoZ7F1.mjs'),"/src/content/docs/construction/project-planning.mdx": () => import('./project-planning_DNAWVpMK.mjs'),"/src/content/docs/construction/safety.mdx": () => import('./safety_DPwf8nRC.mjs'),"/src/content/docs/construction/service-overview.mdx": () => import('./service-overview_C10vyEBE.mjs'),"/src/content/docs/de/guides/first-project-checklist.mdx": () => import('./first-project-checklist_Cimq2MU2.mjs'),"/src/content/docs/de/guides/getting-started.mdx": () => import('./getting-started_BohGB3Ot.mjs'),"/src/content/docs/de/guides/intro.mdx": () => import('./intro_C_TLBUzP.mjs'),"/src/content/docs/de/welcome-to-docs.mdx": () => import('./welcome-to-docs_DqcBsRbA.mjs'),"/src/content/docs/es/guides/first-project-checklist.mdx": () => import('./first-project-checklist_ejSFpVMW.mjs'),"/src/content/docs/es/guides/getting-started.mdx": () => import('./getting-started_DC1Dvw3j.mjs'),"/src/content/docs/es/guides/intro.mdx": () => import('./intro_-ag5PlX9.mjs'),"/src/content/docs/es/welcome-to-docs.mdx": () => import('./welcome-to-docs_D8Vig0Kd.mjs'),"/src/content/docs/fa/guides/first-project-checklist.mdx": () => import('./first-project-checklist_DOFLGUAP.mjs'),"/src/content/docs/fa/guides/getting-started.mdx": () => import('./getting-started_Bre82ZOI.mjs'),"/src/content/docs/fa/guides/intro.mdx": () => import('./intro_BUPiy35s.mjs'),"/src/content/docs/fa/welcome-to-docs.mdx": () => import('./welcome-to-docs_DduQ5XK2.mjs'),"/src/content/docs/fr/guides/first-project-checklist.mdx": () => import('./first-project-checklist_D1vQZ8W0.mjs'),"/src/content/docs/fr/guides/getting-started.mdx": () => import('./getting-started_Dgk0hbk6.mjs'),"/src/content/docs/fr/guides/intro.mdx": () => import('./intro_Cy6Rbpig.mjs'),"/src/content/docs/fr/welcome-to-docs.mdx": () => import('./welcome-to-docs_BiAWpUFm.mjs'),"/src/content/docs/guides/first-project-checklist.mdx": () => import('./first-project-checklist_Dy-JodkG.mjs'),"/src/content/docs/guides/getting-started.mdx": () => import('./getting-started_D48IVyLn.mjs'),"/src/content/docs/guides/intro.mdx": () => import('./intro_D3qLlKt_.mjs'),"/src/content/docs/ja/guides/first-project-checklist.mdx": () => import('./first-project-checklist_COloD39-.mjs'),"/src/content/docs/ja/guides/getting-started.mdx": () => import('./getting-started_BaHzUFpG.mjs'),"/src/content/docs/ja/guides/intro.mdx": () => import('./intro_BfmGcy9K.mjs'),"/src/content/docs/ja/welcome-to-docs.mdx": () => import('./welcome-to-docs_CtvIGqRg.mjs'),"/src/content/docs/tools/equipment-care.mdx": () => import('./equipment-care_D9rUZnUD.mjs'),"/src/content/docs/tools/tool-guides.mdx": () => import('./tool-guides_CRe91CBb.mjs'),"/src/content/docs/welcome-to-docs.mdx": () => import('./welcome-to-docs_Wij9CU32.mjs'),"/src/content/docs/zh-cn/guides/first-project-checklist.mdx": () => import('./first-project-checklist__zliwdqQ.mjs'),"/src/content/docs/zh-cn/guides/getting-started.mdx": () => import('./getting-started_zSxsX4n_.mjs'),"/src/content/docs/zh-cn/guides/intro.mdx": () => import('./intro_Bgn1pVgD.mjs'),"/src/content/docs/zh-cn/welcome-to-docs.mdx": () => import('./welcome-to-docs_C7fTk95A.mjs'),"/src/content/insights/en/insight-1.md": () => import('./insight-1_Mk3yqGPK.mjs'),"/src/content/insights/en/insight-2.md": () => import('./insight-2_Cv2Sz3Z4.mjs'),"/src/content/insights/en/insight-3.md": () => import('./insight-3_BYYVnsgV.mjs'),"/src/content/insights/fr/insight-1.md": () => import('./insight-1_CWzhu4DA.mjs'),"/src/content/insights/fr/insight-2.md": () => import('./insight-2_CFgL3ME0.mjs'),"/src/content/insights/fr/insight-3.md": () => import('./insight-3_DYTEsaJ7.mjs'),"/src/content/products/a765.md": () => import('./a765_CODnQJ23.mjs'),"/src/content/products/b203.md": () => import('./b203_B34pOHll.mjs'),"/src/content/products/f303.md": () => import('./f303_LfdSBIpL.mjs'),"/src/content/products/t845.md": () => import('./t845_CBdlj381.mjs')});
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = /* #__PURE__ */ Object.assign({});
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {"products":{"type":"content","entries":{"b203":"/src/content/products/b203.md","a765":"/src/content/products/a765.md","f303":"/src/content/products/f303.md","t845":"/src/content/products/t845.md"}},"docs":{"type":"content","entries":{"welcome-to-docs":"/src/content/docs/welcome-to-docs.mdx","advanced/technical-specifications":"/src/content/docs/advanced/technical-specifications.mdx","construction/custom-solutions":"/src/content/docs/construction/custom-solutions.mdx","construction/project-planning":"/src/content/docs/construction/project-planning.mdx","construction/safety":"/src/content/docs/construction/safety.mdx","construction/service-overview":"/src/content/docs/construction/service-overview.mdx","es/welcome-to-docs":"/src/content/docs/es/welcome-to-docs.mdx","fa/welcome-to-docs":"/src/content/docs/fa/welcome-to-docs.mdx","de/welcome-to-docs":"/src/content/docs/de/welcome-to-docs.mdx","fr/welcome-to-docs":"/src/content/docs/fr/welcome-to-docs.mdx","guides/first-project-checklist":"/src/content/docs/guides/first-project-checklist.mdx","guides/getting-started":"/src/content/docs/guides/getting-started.mdx","guides/intro":"/src/content/docs/guides/intro.mdx","ja/welcome-to-docs":"/src/content/docs/ja/welcome-to-docs.mdx","tools/equipment-care":"/src/content/docs/tools/equipment-care.mdx","tools/tool-guides":"/src/content/docs/tools/tool-guides.mdx","zh-cn/welcome-to-docs":"/src/content/docs/zh-cn/welcome-to-docs.mdx","de/guides/first-project-checklist":"/src/content/docs/de/guides/first-project-checklist.mdx","de/guides/getting-started":"/src/content/docs/de/guides/getting-started.mdx","de/guides/intro":"/src/content/docs/de/guides/intro.mdx","es/guides/first-project-checklist":"/src/content/docs/es/guides/first-project-checklist.mdx","es/guides/getting-started":"/src/content/docs/es/guides/getting-started.mdx","es/guides/intro":"/src/content/docs/es/guides/intro.mdx","fa/guides/first-project-checklist":"/src/content/docs/fa/guides/first-project-checklist.mdx","fa/guides/getting-started":"/src/content/docs/fa/guides/getting-started.mdx","fa/guides/intro":"/src/content/docs/fa/guides/intro.mdx","fr/guides/first-project-checklist":"/src/content/docs/fr/guides/first-project-checklist.mdx","fr/guides/getting-started":"/src/content/docs/fr/guides/getting-started.mdx","fr/guides/intro":"/src/content/docs/fr/guides/intro.mdx","ja/guides/first-project-checklist":"/src/content/docs/ja/guides/first-project-checklist.mdx","ja/guides/getting-started":"/src/content/docs/ja/guides/getting-started.mdx","ja/guides/intro":"/src/content/docs/ja/guides/intro.mdx","zh-cn/guides/getting-started":"/src/content/docs/zh-cn/guides/getting-started.mdx","zh-cn/guides/first-project-checklist":"/src/content/docs/zh-cn/guides/first-project-checklist.mdx","zh-cn/guides/intro":"/src/content/docs/zh-cn/guides/intro.mdx"}},"blog":{"type":"content","entries":{"en/post-1":"/src/content/blog/en/post-1.md","en/post-2":"/src/content/blog/en/post-2.md","en/post-3":"/src/content/blog/en/post-3.md","fr/post-1":"/src/content/blog/fr/post-1.md","fr/post-2":"/src/content/blog/fr/post-2.md","fr/post-3":"/src/content/blog/fr/post-3.md"}},"insights":{"type":"content","entries":{"en/insight-1":"/src/content/insights/en/insight-1.md","en/insight-2":"/src/content/insights/en/insight-2.md","en/insight-3":"/src/content/insights/en/insight-3.md","fr/insight-1":"/src/content/insights/fr/insight-1.md","fr/insight-2":"/src/content/insights/fr/insight-2.md","fr/insight-3":"/src/content/insights/fr/insight-3.md"}}};

new Set(Object.keys(lookupMap));

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/en/post-1.md": () => import('./post-1_C0X0chMC.mjs'),"/src/content/blog/en/post-2.md": () => import('./post-2_6J5RIwIn.mjs'),"/src/content/blog/en/post-3.md": () => import('./post-3_BYslOXPc.mjs'),"/src/content/blog/fr/post-1.md": () => import('./post-1_C9HDWBM7.mjs'),"/src/content/blog/fr/post-2.md": () => import('./post-2_BUukjbDD.mjs'),"/src/content/blog/fr/post-3.md": () => import('./post-3_B0vK_vqF.mjs'),"/src/content/docs/advanced/technical-specifications.mdx": () => import('./technical-specifications_Dn45lHMQ.mjs'),"/src/content/docs/construction/custom-solutions.mdx": () => import('./custom-solutions_Cwq5MP4v.mjs'),"/src/content/docs/construction/project-planning.mdx": () => import('./project-planning_p2yEZnRV.mjs'),"/src/content/docs/construction/safety.mdx": () => import('./safety_0eoMS1_z.mjs'),"/src/content/docs/construction/service-overview.mdx": () => import('./service-overview_CHju3-xU.mjs'),"/src/content/docs/de/guides/first-project-checklist.mdx": () => import('./first-project-checklist_Bih8ZB5M.mjs'),"/src/content/docs/de/guides/getting-started.mdx": () => import('./getting-started_DLvDsdmB.mjs'),"/src/content/docs/de/guides/intro.mdx": () => import('./intro_DUFJgrgh.mjs'),"/src/content/docs/de/welcome-to-docs.mdx": () => import('./welcome-to-docs_Cmtn1YYZ.mjs'),"/src/content/docs/es/guides/first-project-checklist.mdx": () => import('./first-project-checklist_D5wal5Ko.mjs'),"/src/content/docs/es/guides/getting-started.mdx": () => import('./getting-started_BaouSYmU.mjs'),"/src/content/docs/es/guides/intro.mdx": () => import('./intro_DBYHWm5c.mjs'),"/src/content/docs/es/welcome-to-docs.mdx": () => import('./welcome-to-docs_DAdJF3vI.mjs'),"/src/content/docs/fa/guides/first-project-checklist.mdx": () => import('./first-project-checklist_Cbt5olbF.mjs'),"/src/content/docs/fa/guides/getting-started.mdx": () => import('./getting-started_BFRCdAJD.mjs'),"/src/content/docs/fa/guides/intro.mdx": () => import('./intro_Dn6nDjaX.mjs'),"/src/content/docs/fa/welcome-to-docs.mdx": () => import('./welcome-to-docs_Dwib-3Z8.mjs'),"/src/content/docs/fr/guides/first-project-checklist.mdx": () => import('./first-project-checklist_D7Rletxi.mjs'),"/src/content/docs/fr/guides/getting-started.mdx": () => import('./getting-started_C1av3cSS.mjs'),"/src/content/docs/fr/guides/intro.mdx": () => import('./intro_D2cePili.mjs'),"/src/content/docs/fr/welcome-to-docs.mdx": () => import('./welcome-to-docs_CpBGyJEI.mjs'),"/src/content/docs/guides/first-project-checklist.mdx": () => import('./first-project-checklist_o4wMsf8U.mjs'),"/src/content/docs/guides/getting-started.mdx": () => import('./getting-started_IHCftuQk.mjs'),"/src/content/docs/guides/intro.mdx": () => import('./intro_C2XRRA3M.mjs'),"/src/content/docs/ja/guides/first-project-checklist.mdx": () => import('./first-project-checklist_CUSpvaAK.mjs'),"/src/content/docs/ja/guides/getting-started.mdx": () => import('./getting-started_BDol620n.mjs'),"/src/content/docs/ja/guides/intro.mdx": () => import('./intro_BdI4FJE4.mjs'),"/src/content/docs/ja/welcome-to-docs.mdx": () => import('./welcome-to-docs_BTfHmjso.mjs'),"/src/content/docs/tools/equipment-care.mdx": () => import('./equipment-care_BOQ068Mn.mjs'),"/src/content/docs/tools/tool-guides.mdx": () => import('./tool-guides_EhQw0nkJ.mjs'),"/src/content/docs/welcome-to-docs.mdx": () => import('./welcome-to-docs_DYJyD3F5.mjs'),"/src/content/docs/zh-cn/guides/first-project-checklist.mdx": () => import('./first-project-checklist_ClZQSt9p.mjs'),"/src/content/docs/zh-cn/guides/getting-started.mdx": () => import('./getting-started_3rX8V71-.mjs'),"/src/content/docs/zh-cn/guides/intro.mdx": () => import('./intro_DdYD6Dil.mjs'),"/src/content/docs/zh-cn/welcome-to-docs.mdx": () => import('./welcome-to-docs_BTqcrOak.mjs'),"/src/content/insights/en/insight-1.md": () => import('./insight-1_DIT73gXp.mjs'),"/src/content/insights/en/insight-2.md": () => import('./insight-2_BxQBmnc5.mjs'),"/src/content/insights/en/insight-3.md": () => import('./insight-3_s-pG1FVL.mjs'),"/src/content/insights/fr/insight-1.md": () => import('./insight-1_2xwylu-1.mjs'),"/src/content/insights/fr/insight-2.md": () => import('./insight-2_C0hgLvwY.mjs'),"/src/content/insights/fr/insight-3.md": () => import('./insight-3_C-2d3k1n.mjs'),"/src/content/products/a765.md": () => import('./a765_DWE11Cr3.mjs'),"/src/content/products/b203.md": () => import('./b203_CZVIpQDr.mjs'),"/src/content/products/f303.md": () => import('./f303_W-ySTkZ7.mjs'),"/src/content/products/t845.md": () => import('./t845_DZNRhRJb.mjs')});
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const cacheEntriesByCollection = new Map();
const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	cacheEntriesByCollection,
});

export { getCollection as g };
