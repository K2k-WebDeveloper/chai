import signupimg from "../../../assets/Signup.png";
import Signupform from "./Signupform";

function Signup() {
  return (
    <div className="lg:flex  justify-center items-center py-14 px-5 max-h-screen">
      <img src={signupimg} className="lg:w-[37%]" />
      <Signupform />
    </div>
  );
}

export default Signup;
