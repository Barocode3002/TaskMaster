import * as styles from './styles/footerStyle';
import { FaGithub, FaInstagram, FaLinkedin, FaCodeMerge } from "react-icons/fa";
import { TiSocialFacebookCircular } from "react-icons/ti";


const Footer = () => {
    return (
        <footer className={styles.footerContainer}>
            <p className={styles.copyrightText}>
                &copy; {new Date().getFullYear()} TaskMaster
            </p>
            <div className={styles.socialLinksContainer}>
                <a href="https://fb.com/mohssenmohammedbarokha" className={styles.socialLink}><TiSocialFacebookCircular /></a>
                <a href="https://instagram.com/mohssenmbarokha" className={styles.socialLink}><FaInstagram /></a>
                <a href="https://github.com/Barocode3002" className={styles.socialLink}><FaGithub /></a>
                <a href="https://linkedin.com/in/mohssenmbarokha" className={styles.socialLink}><FaLinkedin /></a>
            </div>
            <div className='m-2 hover:text-red-500 cursor-pointer'>
            <a href="https://github.com/Barocode3002/TaskMaster"><FaCodeMerge />source code</a>
            </div>
        </footer>
    );
};

export default Footer;
