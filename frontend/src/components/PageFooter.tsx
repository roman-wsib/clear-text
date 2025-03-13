import React from 'react';
import styles from '../styles/PageFooter.module.css';

// Import SVG icons for LinkedIn, X, YouTube, and Instagram
import LinkedInIcon from '../icons/linkedin.svg';
import XIcon from '../icons/x.svg';
import YouTubeIcon from '../icons/youtube.svg';
import InstagramIcon from '../icons/instagram.svg';

const PageFooter: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.column}>
          <div className={styles.columnSection}>
            <div className={styles.item}>Day of Mourning</div>
            <div className={styles.item}>Health and safety statistics</div>
            <div className={styles.item}>Open Data</div>
            <div className={styles.item}>Accessibility</div>
          </div>
          <div className={styles.columnSection}>
            <div className={styles.item}>Privacy</div>
            <div className={styles.item}>Fair Practices Commission</div>
            <div className={styles.item}>Contact us</div>
            <div className={styles.item}>Land acknowledgement</div>
          </div>
          <div className={styles.columnSection}>
            <div className={styles.item}>Health and Safety Index</div>
            <div className={styles.item}>Careers</div>
            <div className={styles.item}>Terms of use</div>
            <div className={styles.item}>Other languages</div>
          </div>
          <div className={styles.contactSection}>
            <div className={styles.contactItem}>Fatal or catastrophic workplace accidents, call us: 1-800-387-0750</div>
            <div className={styles.contactItem}>Contact us: 1-800-387-0750</div>
            <div className={styles.socialIcons}>
              <img src={LinkedInIcon} alt="LinkedIn" className={styles.socialIcon} />
              <img src={XIcon} alt="X" className={styles.socialIcon} />
              <img src={YouTubeIcon} alt="YouTube" className={styles.socialIcon} />
              <img src={InstagramIcon} alt="Instagram" className={styles.socialIcon} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <div className={styles.footerText}>© 2024, Workplace Safety and Insurance Board</div>
      </div>
    </footer>
  );
};

export default PageFooter;
