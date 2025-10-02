import { FaYoutube, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-cyan-700 to-cyan-500 text-white py-8 mt-10">
      <div className="flex flex-col md:flex-row justify-between gap-8 px-12">
        {/* Column 1: Executive Team */}
        <div>
          <h3 className="font-bold mb-2">Executive Team</h3>
          <p className="font-bold">Group 30</p>
          <p>Monica Nunes _ N12240672</p>
          <p>Prithvirajsingh Jadeja _ N12131563</p>
          <p>Gurleen Kaur Arneja _ N12258415</p>
        </div>

        {/* Column 2: Company Info */}
        <div>
          <h3 className="font-bold">Inventory Control S.A.</h3>
          <p>
            <span className="font-bold">Address:</span> 123 Student Street,
            Awesomeness, QLD.
          </p>
          <p className="flex items-center">
            <span className="font-bold mr-1">Phone:</span> 0432 198 765

          </p>
        </div>

        {/* Column 3: Extra Info */}
        <div>
          <h3 className="font-bold mb-2">About</h3>
          <p>Career</p>
          <p>News</p>
          <h3 className="font-bold mt-4">Follow us:</h3>
          <div className="flex space-x-4 mt-2 text-2xl">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="hover:text-red-500 transition-colors" />
            </a>

            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="hover:text-blue-500 transition-colors" />
            </a>
              
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="hover:text-blue-700 transition-colors" />
            </a>
            
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
               <FaInstagram className="hover:text-pink-500 transition-colors" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
