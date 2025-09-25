const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-300 bg-opacity-60 text-base-content p-2">
      <aside>
        <p className="text-sm">Copyright © {new Date().getFullYear()} - All right reserved by Dmytro Ovcharenko</p>
      </aside>
    </footer>
  );
};

export default Footer;
