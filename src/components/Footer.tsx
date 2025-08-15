import { TiSocialFacebookCircular } from "react-icons/ti";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

import { footerStyle, footerText, footerYear, socialIcons, socialIcon } from "./styles/footerStyle";

const Footer = () => {
    return (
        <footer className={footerStyle}>
            <p className={`${footerText} ${footerYear}`}>
                &copy; {new Date().getFullYear()} TaskMaster. All rights reserved.
            </p>
            <div className={socialIcons}>
                <a href="https://fb.com/mohssenmohammedbarokha" className={socialIcon}><TiSocialFacebookCircular /></a>
                <a href="https://instagram.com/mohssenmbarokha" className={socialIcon}><FaInstagram /></a>
                <a href="https://github.com/Barocode3002" className={socialIcon}><FaGithub /></a>
                <a href="https://linkedin.com/in/mohssenmbarokha" className={socialIcon}><FaLinkedin /></a>
            </div>
        </footer>
    );
};

export default Footer;