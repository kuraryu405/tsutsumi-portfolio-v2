import { PageCount } from "../components/PageCount";
import { ResponsiveImage } from "../components/ResponsiveImage";

export function ProfileSection() {
  return (
    <section
      className="viewport-section profile-section"
      id="profile"
      aria-labelledby="profile-title"
    >
      <div className="section-topline dark">
        <span>02 / PROFILE</span>
        <span>TOKYO / STUDENT</span>
      </div>
      <div className="profile-grid">
        <div className="profile-name">
          <p>HELLO, I&apos;M</p>
          <h2 id="profile-title">つつみん。</h2>
          <strong>TSUTSUMIN</strong>
        </div>
        <figure className="profile-portrait">
          <ResponsiveImage
            src="/images/icon_github.webp"
            width={400}
            height={400}
            widths={[128, 256, 400]}
            sizes="(max-width: 760px) 74vw, 24vw"
            alt="つつみんのプロフィールアイコン"
          />
          <figcaption>STUDENT / WEB DEVELOPMENT</figcaption>
        </figure>
        <div className="profile-statement">
          <span>ABOUT ME</span>
          <p>
            東京の情報系学部に所属する大学生。
            <br />
            フロントエンドもバックエンドも、
            <br />
            気になった技術はまず触って試す。
          </p>
          <dl>
            <div>
              <dt>BASED IN</dt>
              <dd>TOKYO</dd>
            </div>
            <div>
              <dt>INTEREST</dt>
              <dd>FRONTEND / BACKEND / WEB</dd>
            </div>
            <div>
              <dt>STATUS</dt>
              <dd>LEARNING BY BUILDING</dd>
            </div>
          </dl>
        </div>
      </div>
      <PageCount current={2} dark />
    </section>
  );
}
