import Home from "./components/Home";
import Login from "./components/Login";

function page() {

  
  return (
    <div>
      <Home></Home>
      <div className="bg-customPalette-lightBlue text-black p-4">Light Blue</div>
<div className="bg-customPalette-purpleLight text-white p-4">Purple Light</div>
<div className="bg-customPalette-blue text-white p-4">Blue</div>
<div className="bg-customPalette-red text-white p-4">Red</div>

    </div>
  );
}
export default page
