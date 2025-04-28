const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-600 py-4 text-center">
            <p className="text-gray-200">
                &copy; {currentYear} Team_J. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
