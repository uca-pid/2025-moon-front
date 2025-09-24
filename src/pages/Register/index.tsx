import { RegisterForm } from "@/components/register-form";

function Register() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <RegisterForm className="lg:w-[35%] w-[80%]" />
    </div>
  );
}

export default Register;
