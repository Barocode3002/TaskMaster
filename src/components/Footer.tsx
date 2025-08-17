import * as styles from './styles/footerStyle';
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { TiSocialFacebookCircular } from "react-icons/ti";
import { FaCodeBranch } from "react-icons/fa6";


const Footer = () => {
    return (
        <footer className={styles.footerContainer}>
            <p className={styles.copyrightText}>
                &copy; {new Date().getFullYear()} TaskMaster
            </p>
            <div className={styles.socialLinksContainer}>
                <a href="https://fb.com/mohssenmohammedbarokha" className={styles.socialLink}><TiSocialFacebookCircular /></a>
                <a href="https://instagram.com/mohssen_barokha" className={styles.socialLink}><FaInstagram /></a>
                <a href="https://github.com/mohssenbarokha" className={styles.socialLink}><FaGithub /></a>
                <a href="https://linkedin.com/in/mohssen-mohammed-barokha-a5b1b8230" className={styles.socialLink}><FaLinkedin /></a>
            </div>
            <div className={styles.projectSourceContainer}>
            <a href="https://github.com/Barocode3002/TaskMaster" className={styles.projectSourceLink}>
                <span className={styles.projectSourceText}>
                    <code>
                        <span className={styles.inlineIcon}><FaCodeBranch /></span>source code
                    </code>
                </span>
            </a>
            </div>
        </footer>
    );
};

export default Footer;

// ___UPDATED___