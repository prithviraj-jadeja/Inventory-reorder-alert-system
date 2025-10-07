

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white ">
      {/* Header */}
      <header className="text-align-left text-cyan-700 p-4 flex justify-between items-center">
        <div className="container mx-auto">

          <h1 className="text-4xl font-bold">InCo.</h1>
          <p className="text-lg italic"> Your goodies under control</p>

        </div>
      </header>

      {/* Main Sections */}
      <main className="flex-grow grid grid-cols-1 gap-6 px-8 py-12">

        <h2 className="text-3xl text-center text-cyan-700 font-bold mb-2">About us</h2>
        <p className="text-lg text-gray-600 text-justify leading-relaxed">     The Inventory Reorder Alert System enables users to manage their inventory items effectively streamlining business operations. Built with a user-friendly interface, the system enables users to create, view, update, and delete product items. Users can also manage inventory items at their threshold level. Once the product item quantity drops below its threshold, the item is highlighted on the alert dashboard. Furthermore, the system includes secure user authentication, allowing individuals to sign up and log in to their accounts. It provides profile management and product details. The design ensures a seamless user experience and boosts productivity in both personal and professional workspaces.</p>


        {/* Features & Memberships */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 text-center text-cyan-700">
          {/* Features */}
          <div>
            <h2 className="text-xl font-bold mb-6">FEATURES</h2>
            <div className="flex justify-center gap-6">
              {/* Alert Dashboard (real page) */}
              <a
               
                href="/dashboard"
                className="w-32 h-40 flex flex-col items-center justify-center bg-white shadow-md rounded-lg hover:shadow-lg transition"
              >
                <p className="font-light">Alert Dashboard</p>
                <img src="/dash.png" alt="Alert Dashboard" className="w-16 h-16 mb-2" />
                
              </a>

              {/* Product Details placeholder*/}
              <div className="w-32 h-40 flex flex-col items-center justify-center bg-white shadow-md rounded-lg cursor-not-allowed">
                <p className="font-light">Product Details</p>
                <img src="/detail.jpg" alt="Product Details" className="w-16 h-16 mb-2" />
                
              </div>

              {/* Order Placement placeholder */}
              <div className="w-32 h-40 flex flex-col items-center justify-center bg-white shadow-md rounded-lg cursor-not-allowed">
                <p className="font-light">Order Placement</p>
                <img src="/shop.png" alt="Order Placement" className="w-16 h-16 mb-2" />
              </div>
            </div>
          </div>

          {/* Memberships */}
          <div>
            <h2 className="text-xl text-cyan-700 font-bold mb-6">MEMBERSHIPS</h2>
            <div className="flex justify-center gap-6">
           {/* Starter placeholder*/}
              <div className="w-32 h-40 flex flex-col items-center justify-center bg-white shadow-md rounded-lg cursor-not-allowed">
                <p className="font-light">Starter</p>
                <img src="/1 start.png" alt="1 Star" className="w-16 h-16 mb-2" />
              </div>

            {/* Advanced placeholder*/}
              <div className="w-32 h-40 flex flex-col items-center justify-center bg-white shadow-md rounded-lg cursor-not-allowed">
                <p className="font-light">Advanced</p>
                <img src="/3 starts.png" alt="3 Star" className="w-16 h-16 mb-2" />
              </div>

              {/* Pro Master placeholder*/}
              <div className="w-32 h-40 flex flex-col items-center justify-center bg-white shadow-md rounded-lg cursor-not-allowed">
                <p className="font-light">Pro Master</p>
                <img src="/5 stars.png" alt="5 Star" className="w-16 h-16 mb-2" />
              </div>
          </div>
          </div>
        </section>


      </main>

      <footer >
      </footer>
    </div>
  );
}

export default LandingPage;