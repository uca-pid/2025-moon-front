import { LoginForm } from "@/components/login-form";

function Login() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-background">
      <LoginForm className="lg:w-[35%] w-[80%]" />
    </div>
  );
}

export default Login;
