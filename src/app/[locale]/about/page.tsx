import { useTranslations } from 'next-intl';
import '../../../components/AboutPage/about-page.css';
import { MY_GITHUB_URL, REACT_COURSE_URL } from '../../../constants/constants';

const AboutPage = () => {
  const t = useTranslations('AboutPage');

  return (
    <div className="about">
      <h2 className="about-title">{t('title')}</h2>
      <div className="about-photo"></div>
      <p className="about-text">
        {t('description')}
        <a
          className="about-me"
          href={MY_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          DmitriyRadovnya
        </a>
      </p>
      <a
        className="about-rss"
        href={REACT_COURSE_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('rss')}
      </a>
    </div>
  );
};

export default AboutPage;
