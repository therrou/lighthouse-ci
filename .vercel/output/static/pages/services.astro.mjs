/* empty css                                 */
import { a as createComponent, r as renderTemplate, d as renderComponent } from '../chunks/astro/server_gDiTGxCh.mjs';
import 'kleur/colors';
import { a as $$MainLayout, S as SITE } from '../chunks/MainLayout_BlUcfOJK.mjs';
import { $ as $$MainSection, a as $$RightSection, b as $$LeftSection, c as $$FeaturesStats, d as blueprints, p as personWorking, e as beforeAfter, f as constructionWorkers, g as aerialView, u as usingTools, h as progressBuilding, i as underConstruction } from '../chunks/under-construction_2RnjrU2N.mjs';
export { renderers } from '../renderers.mjs';

const $$Services = createComponent(($$result, $$props, $$slots) => {
  const articles = [
    {
      isRightSection: true,
      title: "Delivering Expert Guidance",
      subTitle: "Embarking on a construction project can be overwhelming. With our professional consultation services, we guide you through every stage, ensuring you make informed decisions. Whether you are a DIY enthusiast or a skilled contractor, our experts are on hand to offer tailored advice on product selection, project scope, and compliance with local regulations.",
      single: false,
      imgOne: blueprints,
      imgOneAlt: "Blueprints and digital tablet with construction plans.",
      imgTwo: personWorking,
      imgTwoAlt: "Person working in the office"
    },
    {
      isRightSection: false,
      title: "Transforming Designs into Reality",
      subTitle: "Our skilled craftsmen bring precision and excellence to every construction project. From minor installations to substantial structural work, ScrewFast offers reliable construction services to turn your plans into tangible outcomes. We ensure the highest standards of safety and workmanship, utilizing top-quality tools and materials from our extensive inventory.",
      img: beforeAfter,
      imgAlt: "Construction site before and after",
      btnExists: true,
      btnTitle: "Learn More",
      btnURL: "#"
    },
    {
      isRightSection: true,
      title: "Navigating Projects with Professional Oversight",
      subTitle: "Effective project management is at the heart of any successful build. ScrewFast provides thorough planning and robust management services that keep your project on time and within budget. Let us handle the complexities of workflow coordination, resource allocation, and stakeholder communication while you focus on your vision.",
      single: false,
      imgOne: constructionWorkers,
      imgOneAlt: "Construction workers orchestrating a project",
      imgTwo: aerialView,
      imgTwoAlt: "Aerial view of managed construction"
    },
    {
      isRightSection: false,
      title: "Ensuring Long-lasting Performance",
      subTitle: "Our commitment to your project doesn't end at completion. ScrewFast offers ongoing maintenance and support services to ensure your construction's longevity and performance. From regular check-ups to emergency assistance, our responsive team is there to provide seamless support.",
      img: usingTools,
      imgAlt: "Man in orange and black vest wearing white helmet holding yellow and black power tool"
    },
    {
      isRightSection: true,
      title: "Crafting Bespoke Strategies for Unique Challenges",
      subTitle: "For our larger enterprise clients, ScrewFast offers custom solutions designed to meet specific industry challenges. By understanding your unique needs, we engineer tailored strategies aimed at optimizing your operations, enhancing efficiency, and driving your business forward.",
      single: false,
      imgOne: progressBuilding,
      imgOneAlt: "In progress building structure",
      imgTwo: underConstruction,
      imgTwoAlt: "Brown and gray building under construction",
      btnExists: true,
      btnTitle: "Read more",
      btnURL: "#"
    }
  ];
  const pageTitle = `Services | ${SITE.title}`;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": pageTitle, "structuredData": {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://screwfast.uk/services",
    "url": "https://screwfast.uk/services",
    "name": "Expert Consultation Services | ScrewFast",
    "description": "Uniting expertise with your vision, ScrewFast provides exceptional service and comprehensive solutions in the hardware and construction industry, from consultation to project completion.",
    "isPartOf": {
      "@type": "WebSite",
      "url": "https://screwfast.uk",
      "name": "ScrewFast",
      "description": "ScrewFast offers top-tier hardware tools and expert construction services to meet all your project needs."
    },
    "inLanguage": "en-US"
  } }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "MainSection", $$MainSection, { "title": "Uniting Expertise with Your Vision", "subTitle": "At ScrewFast, we take pride in providing comprehensive solutions and exceptional service in the hardware and construction industry. Our experienced team is dedicated to supporting your project from inception to completion with a range of specialized services.", "btnExists": true, "btnTitle": "Schedule a Consultation", "btnURL": "#" })}  ${articles.map((article) => {
    return article.isRightSection ? renderTemplate`${renderComponent($$result2, "RightSection", $$RightSection, { "title": article.title, "subTitle": article.subTitle, "single": article.single, "imgOne": article.imgOne, "imgOneAlt": article.imgOneAlt, "imgTwo": article.imgTwo, "imgTwoAlt": article.imgTwoAlt, "btnExists": article.btnExists, "btnTitle": article.btnTitle, "btnURL": article.btnURL })}` : renderTemplate`${renderComponent($$result2, "LeftSection", $$LeftSection, { "title": article.title, "subTitle": article.subTitle, "img": article.img, "imgAlt": article.imgAlt, "btnExists": article.btnExists, "btnTitle": article.btnTitle, "btnURL": article.btnURL })}`;
  })} ${renderComponent($$result2, "FeaturesStats", $$FeaturesStats, { "title": "By the Numbers", "subTitle": "Our commitment to quality and reliability is evident in every project we undertake. At ScrewFast, we are dedicated to delivering industry-leading services that ensure your construction projects are built to last.", "mainStatTitle": "96%", "mainStatSubTitle": "of our clients rate their experience with ScrewFast as exceptional", "stats": [
    {
      stat: "99.8%",
      description: "project completion rate"
    },
    {
      stat: "5,000+",
      description: "successful installations"
    },
    {
      stat: "85%",
      description: "client growth year-over-year"
    }
  ] })} ` })}`;
}, "/Users/Tomas.Herrou/ScrewFast-main/src/pages/services.astro", void 0);

const $$file = "/Users/Tomas.Herrou/ScrewFast-main/src/pages/services.astro";
const $$url = "/services";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Services,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
