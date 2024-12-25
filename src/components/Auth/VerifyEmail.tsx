"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {useState,useEffect} from "react";
import { UserVerifyData } from "@/types/UserVerifyData"
import { revalidatePath } from "next/cache"; // Cache invalidation
//import Loader from "@/components/common/Loader";

export default function VerifyEmail({length}:{length:number}) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<UserVerifyData | null>(null);
  const router = useRouter();
  const [inputValues, setInputValues] = useState(Array(length).fill(''));





  const handleSubmit = () => {
    const enteredCode = inputValues.join("");
    if (enteredCode === data?.verificationCode) {
      toast.success("Verified Successfully");
      fetch('/api/verify/user',{method:"POST"}).catch((e)=>{console.log(e)})
        
      return router.push("/")
    } else {
        toast.error("The Code is Invalid")
        console.log("The Code is Invalid: " + data?.verificationCode);
    }
};
  

const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const value = e.target.value.toUpperCase();
  
  // Create a copy of the input values
  const newInputValues = [...inputValues];

  // Check if the length of the pasted value exceeds the length of the input
  if (value.length > 1) {
    // Split the pasted value into individual characters and fill the input values array
    const valueArray = value.split("");
    valueArray.forEach((char, i) => {
      if (index + i < length) {
        newInputValues[index + i] = char;
      }
    });
    setInputValues(newInputValues);

    // Move focus to the next input field
    const nextInput = document.getElementById(`input-${index + valueArray.length - 1}`) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  } else {
    // Handle single character input
    newInputValues[index] = value;
    setInputValues(newInputValues);

    if (value && index < length - 1) {
      // Move focus to the next input field
      const nextInput = document.getElementById(`input-${index + 1}`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    } else if (!value && index > 0) {
      // Move focus to the previous input field if the backspace is hit
      const previousInput = document.getElementById(`input-${index - 1}`) as HTMLInputElement;
      if (previousInput) {
        previousInput.focus();
      }
    }
  }
};


useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/verify/fetch");
      if (!response.ok) {
        const errorData = await response.json();
        console.log(response);
        console.log(errorData.message);
        return router.push('/auth/signin')
      }
      const userData: UserVerifyData = await response.json();
      if (userData.emailVerified) {
        router.push("/");
      } else {
        setData(userData);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("Please check your network connection then try again.");
      console.error('error: ', error);
      setIsLoading(false);
    }
  };

  fetchUser();
}, []);


//if (isLoading) {
//  return <Loader />;
//}

return(
<div className="rounded-xl bg-white p-4 shadow-card-10 dark:bg-gray-dark lg:p-7.5 xl:p-12.5">
<Link href="/" className="mx-auto mb-7.5 inline-flex">
  <Image
    width={176}
    height={32}
    src={"/images/logo/logo-dark.svg"}
    alt="Logo"
    priority
    className="dark:hidden"
  />
  <Image
    width={176}
    height={32}
    src={"/images/logo/logo.svg"}
    alt="Logo"
    priority
    className="hidden dark:block"
  />
</Link>

<h1 className="mb-2.5 text-3xl font-black leading-[48px] text-dark dark:text-white">
  Verify Your Email
</h1>

<p className="mb-7.5 font-medium text-dark-4 dark:text-dark-6">
  Enter the {length} digit code sent to your email.
</p>

<form>
  <div className="flex items-center gap-4.5">
    {Array.from({ length: length }).map((_, index) => (
      <input
        key={index}
        id={`input-${index}`}
        onChange={(e) => handleChange(e, index)}
        value={inputValues[index]}
        type="text"
        className="h-12.5 w-full rounded-md border-[1.5px] border-stroke bg-transparent px-5 py-1 text-center text-2xl text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
      />
    ))}
  </div>

  <p className="mb-5 mt-4 text-left font-medium text-dark dark:text-white">
    Did not receive a code?{" "}
    <button className="text-primary"> Resend</button>
  </p>

  <button className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-bold text-gray hover:bg-opacity-90"
  onClick={()=>handleSubmit()}>
    Verify
  </button>
</form>
</div>
)};