import Forgotform from "./Forgotform";
import forgotimg from "../../../assets/forgot.png";

function Forgot() {
  return (
    <div className="lg:flex  justify-center items-center py-14 px-5">
      <Forgotform />
      <img src={forgotimg} />
    </div>
  );
}

export default Forgot;
