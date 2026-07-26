import { useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { FriendOrbit } from "../components/FriendOrbit";
import { PageCount } from "../components/PageCount";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { affiliations, mutualLinks } from "../data/portfolio";

function MobileFriends() {
  return (
    <aside className="mobile-friends" aria-labelledby="mobile-friends-title">
      <div className="mobile-friends-heading">
        <span>07 / FRIENDS</span>
        <h3 id="mobile-friends-title">FRIENDS</h3>
        <p>コミュニティからつながった、ものづくりの仲間。</p>
      </div>
      {mutualLinks.map((friend, index) => {
        const affiliation = affiliations.find(
          (item) =>
            friend.orbit.type === "affiliation" &&
            item.id === friend.orbit.id,
        );
        const connection = affiliation
          ? `${affiliation.title}からつながった友人`
          : "コミュニティを越えてつながった友人";

        return (
          <a
            className="mobile-friend"
            href={friend.href}
            target={friend.external === false ? undefined : "_blank"}
            rel={friend.external === false ? undefined : "noreferrer"}
            key={friend.id}
          >
            <ResponsiveImage
              src={friend.image}
              width={friend.imageWidth}
              height={friend.imageHeight}
              widths={friend.imageWidths}
              sizes="76px"
              alt=""
            />
            <span>
              <small>
                FRIEND / {String(index + 1).padStart(2, "0")}
              </small>
              <strong>{friend.title}</strong>
              <em>{connection}</em>
            </span>
            <ArrowUpRight size={20} weight="bold" aria-hidden="true" />
          </a>
        );
      })}
    </aside>
  );
}

export function CommunitySection() {
  const [active, setActive] = useState(0);
  const fieldRef = useRef(null);
  const independentFriends = mutualLinks.filter(
    (friend) => friend.orbit.type === "system",
  );

  const moveField = (event) => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    fieldRef.current.style.setProperty("--community-x", x.toFixed(3));
    fieldRef.current.style.setProperty("--community-y", y.toFixed(3));
  };

  const resetField = () => {
    fieldRef.current?.style.setProperty("--community-x", 0);
    fieldRef.current?.style.setProperty("--community-y", 0);
  };

  return (
    <section
      className="viewport-section affiliations-section"
      id="affiliations"
      aria-labelledby="affiliations-title"
    >
      <div className="section-topline">
        <span>06 / COMMUNITY</span>
        <span>MOVE + HOVER THE SIGNAL</span>
      </div>
      <h2 id="affiliations-title">
        ひとりでは、
        <br />
        つくれない。
      </h2>
      <div
        className="community-field"
        ref={fieldRef}
        onPointerMove={moveField}
        onPointerLeave={resetField}
      >
        <div className="community-orbit" aria-hidden="true" />
        <div className="community-copy" aria-live="polite">
          <span>CONNECTED / 0{active + 1}</span>
          <strong>{affiliations[active].title}</strong>
          <p>{affiliations[active].description}</p>
        </div>
        <FriendOrbit
          anchorTitle="コミュニティ全体"
          friends={independentFriends}
          label="INDEPENDENT"
          variant="system"
        />
        {affiliations.map((item, index) => {
          const orbitingFriends = mutualLinks.filter(
            (friend) =>
              friend.orbit.type === "affiliation" &&
              friend.orbit.id === item.id,
          );

          return (
            <div
              className={`community-node-wrap node-${index + 1}${
                orbitingFriends.length ? " has-satellites" : ""
              }`}
              key={item.id}
            >
              <a
                className={
                  index === active ? "community-node active" : "community-node"
                }
                href={item.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
              >
                <ResponsiveImage
                  src={item.image}
                  width={item.imageWidth}
                  height={item.imageHeight}
                  widths={item.imageWidths}
                  sizes="110px"
                  alt={`${item.title}のロゴ`}
                />
                <span>
                  <small>AFFILIATION / 0{index + 1}</small>
                  <strong>{item.title}</strong>
                </span>
                <ArrowUpRight size={22} weight="bold" />
              </a>
              <FriendOrbit
                anchorTitle={item.title}
                friends={orbitingFriends}
              />
            </div>
          );
        })}
        <MobileFriends />
      </div>
      <PageCount current={6} />
    </section>
  );
}
