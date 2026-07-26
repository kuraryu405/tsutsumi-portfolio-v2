import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import { PageCount } from "../components/PageCount";
import { socialLinks } from "../data/portfolio";

export function LinksSection() {
  return (
    <section
      className="viewport-section links-section"
      id="links"
      aria-labelledby="links-title"
    >
      <div className="section-topline dark">
        <span>07 / FIND ME ONLINE</span>
        <span>TOKYO, JAPAN</span>
      </div>
      <div className="links-heading">
        <p>NEXT CONNECTION</p>
        <h2 id="links-title">
          また、
          <br />
          どこかで。
        </h2>
      </div>
      <div className="social-rows">
        {socialLinks.map((link) => (
          <a href={link.href} target="_blank" rel="noreferrer" key={link.title}>
            <img src={link.image} alt="" />
            <strong>{link.title}</strong>
            <small>{link.handle}</small>
            <ArrowUpRight size={42} weight="bold" />
          </a>
        ))}
      </div>
      <div className="links-footer">
        <p>© 2026 TSUTSUMIN</p>
        <a href="https://me.tenelol.dev/" target="_blank" rel="noreferrer">
          FRIEND / MATSUDA <ArrowUpRight size={15} />
        </a>
        <a href="#intro">
          BACK TO TOP <ArrowDown className="upside" size={15} />
        </a>
      </div>
      <PageCount current={7} dark />
    </section>
  );
}
