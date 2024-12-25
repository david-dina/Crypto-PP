import VerifyEmail from "@/components/Auth/VerifyEmail";

// Verification Page Component
const VerificationPage: React.FC = () => {
  return (
    <div className="overflow-hidden bg-gray-4 px-4 dark:bg-dark-2 sm:px-8">
      <div className="flex h-screen flex-col items-center justify-center overflow-hidden">
        <div className="no-scrollbar overflow-y-auto py-20">
          <div className="mx-auto w-full max-w-[480px]">
            <div className="text-center">
              <VerifyEmail length={6}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
