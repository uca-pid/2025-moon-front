import { ChangePasswordForm } from "@/components/change-password";

export const ChangePassword = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-background">
      <ChangePasswordForm className="lg:w-[35%] w-[80%]" />
    </div>
  );
}

export default ChangePassword;
