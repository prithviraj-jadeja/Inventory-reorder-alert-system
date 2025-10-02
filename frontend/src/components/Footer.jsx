

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-cyan-700 to-cyan-500 text-white py-8 mt-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Executive Team */}
        <div>
          <h3 className="font-bold mb-2">Executive Team</h3>
          <p className="font-bold">Group 30</p>
          <p>Monica Nunes _ N12240672</p>
          <p>Prithvirajsingh Jadeja _ N0000000</p>
        </div>

        {/* Column 2: Company Info */}
        <div>
          <h3 className="font-bold mb-2">Inventory Control S.A.</h3>
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
          <div className="flex space-x-3 mt-2">
            <p>Youtube</p>
            <p>Facebook</p>
            <p>Linkedin</p>
            <p>Instagram</p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
