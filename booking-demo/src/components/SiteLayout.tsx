import type { ReactNode } from 'react';
import { IS_SHOWCASE_MODE } from '@shared/showcaseMode';
import Seo from './Seo';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import { ShowcaseBanner, ShowcasePitchBar } from './ShowcaseChrome';

interface SiteLayoutProps {
  title: string;
  description: string;
  path: string;
  bodyClass?: string;
  hero?: ReactNode;
  children: ReactNode;
  mainClassName?: string;
}

export default function SiteLayout({
  title,
  description,
  path,
  bodyClass,
  hero,
  children,
  mainClassName,
}: SiteLayoutProps) {
  return (
    <>
      <Seo title={title} description={description} path={path} bodyClass={bodyClass} />
      <div className={`site-chrome-sticky${IS_SHOWCASE_MODE ? ' site-chrome-sticky--showcase' : ''}`}>
        {IS_SHOWCASE_MODE && <ShowcaseBanner />}
        <SiteHeader />
        {IS_SHOWCASE_MODE && <ShowcasePitchBar />}
      </div>
      {hero}
      <main className={mainClassName}>{children}</main>
      <SiteFooter />
    </>
  );
}
