import LoginForm from "./LoginForm";
import loginimg from "../../../assets/Login.png";

function Login() {
  return (
    <div className=" lg:flex  justify-center items-center py-14 px-5">
      <LoginForm />
      <img src={loginimg} />
    </div>
  );
}

export default Login;
