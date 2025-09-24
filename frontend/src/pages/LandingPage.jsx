

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Header */}
      <header className="text-align-left text-cyan-700 p-4 flex justify-between items-center">
        < container >
      
          <h1 className="text-4xl font-bold">InCo.</h1>
            <p className="text-lg italic"> Your goodies under control</p>
       
        </container>
      </header>

      {/* Main Sections */}
      <main className="flex-grow grid grid-cols-1 gap-6 px-8 py-12">
                     
            <h2 className="text-3xl text-align-center font-bold mb-2">About us</h2>
            <p > Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris id hendrerit diam. Quisque cursus imperdiet leo, sit amet rutrum neque faucibus faucibus. Nam at aliquet sem. Vivamus mi lorem, consectetur ac hendrerit sit amet, laoreet in diam. Duis in leo eu odio mollis commodo eu ut risus. 
                Mauris euismod nunc nisl, convallis facilisis elit vestibulum vel..</p>
       
            
    <div className="row">
       <container className="text-align-center grid grid-cols-1 md:grid-cols-3 gap-16 px-8 py-12"> 
        <div>
          <h2 className="text-xl font-bold mb-2">Features</h2>
          <ul className="list-disc ml-5">
            <p>Alert Dashboard</p>
            <p>Product Details</p>
            <p>Order Placement</p>
          </ul>
        </div>
        
             
        <div>
          <h2 className="text-xl font-bold mb-2">Memberships</h2>
          
            <p>Starter</p>
            <p>Advanced</p>
            <p>Pro Master</p>
          
        </div>
      </container>
      </div>

      </main>

    <footer>
     </footer>
    </div>
  );
};

export default LandingPage;