import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 w-full py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 text-white flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Tokpred. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-green-500">Privacy Policy</a>
          <a href="#" className="hover:text-green-500">Terms of Service</a>
          <a href="#" className="hover:text-green-500">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
