import { ArrowUpRight } from "@phosphor-icons/react";
import { ResponsiveImage } from "./ResponsiveImage";

function formatCount(count) {
  return String(count).padStart(2, "0");
}

const ORBIT_DURATION_SECONDS = 14;

export function FriendOrbit({
  anchorTitle,
  friends,
  label = "FRIENDS",
  variant = "affiliation",
}) {
  if (!friends.length) return null;

  return (
    <aside
      className={`friend-orbit friend-orbit--${variant}`}
      aria-label={`${anchorTitle}を周回する相互リンク`}
    >
      <span className="friend-orbit-path" aria-hidden="true" />
      <span className="friend-orbit-caption" aria-hidden="true">
        {label} / {formatCount(friends.length)}
      </span>
      <ul className="friend-orbit-list">
        {friends.map((friend, index) => {
          const phase = (index / friends.length + 0.72) % 1;
          const delay = -(ORBIT_DURATION_SECONDS * phase);

          return (
            <li
              className="friend-satellite"
              key={friend.id}
              style={{
                "--friend-delay": `${delay}s`,
                "--friend-duration": `${ORBIT_DURATION_SECONDS}s`,
              }}
            >
              <a
                href={friend.href}
                target={friend.external === false ? undefined : "_blank"}
                rel={friend.external === false ? undefined : "noreferrer"}
                aria-label={
                  friend.ariaLabel ?? `${friend.title}のサイトを開く`
                }
              >
                <span className="friend-planet" aria-hidden="true">
                  <ResponsiveImage
                    src={friend.image}
                    width={friend.imageWidth}
                    height={friend.imageHeight}
                    widths={friend.imageWidths}
                    sizes="88px"
                    alt=""
                  />
                </span>
                <span className="friend-label">
                  <small>SATELLITE / {formatCount(index + 1)}</small>
                  <strong>{friend.title}</strong>
                  <span>{friend.relationship}</span>
                </span>
                <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
