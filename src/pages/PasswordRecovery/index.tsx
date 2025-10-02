import { PasswordRecoveryForm } from "@/components/password-recovery";

function PasswordRecovery() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-background">
      <PasswordRecoveryForm className="lg:w-[35%] w-[80%]" />
    </div>
  );
}

export default PasswordRecovery;
