"use client";
import React from "react";
import Image from "next/image";
import { useState,useEffect } from "react";
import toast from "react-hot-toast";
import { getSignedURL } from "@/actions/upload";
import SwitcherFour from "@/components/FormElements/Switchers/SwitcherFour";
import DatePicker from "./DatePicker";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/common/Loader"
import { notFound } from "next/navigation";



const EditSongBoxes = () => {
  const router = useRouter();
  const [isLoading,setIsLoading] = useState(true);
  const [isInvalidSong,setIsInvalidSong] = useState(false);
  const [isLoadingSong,setIsLoadingSong] = useState(false);
  const [isLoadingImage,setIsLoadingImage] = useState(false);
  const [isSongOwner,setIsSongOwner] = useState(true);
  const pathname = usePathname();
  const abs_path = pathname.replace("/dashboard/songs/",'')
  const songID = abs_path.replace("/edit","")
  const [file, setFile] = useState<File>();
  const [data, setData] = useState({
    title: "",
    createdAt: "",
    explicit: false,
    visibility: "",
    songImage: "",
  });
  const [OGdata, setOGData] = useState({
    title: "",
    createdAt: "",
    explicit: false,
    visibility: "",
    songImage: "",
  });

  useEffect(() => {
    const fetchMySongs = async () => {
      fetch(`/api/songs/fetch?songID=${songID}`)
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            console.error('Error:', errorData.message);
            if(response.status===404){setIsInvalidSong(true);setIsLoading(false);return;}
            toast.error(errorData.message)
            return router.push("/auth/signin");
          }
          return response.json();
        })
        .then((data) => {
          //console.log(data);
          setData(data.finalProcessedSong);
          setOGData(data.finalProcessedSong);
          setIsSongOwner(data.isOwner);
          setIsLoading(false);
          //console.log(data)
        })
        .catch((error) => {
          console.log(error)
          if (error.response) {
            const errorData = error.response.data;
            console.error('Error:', errorData.message);
            toast.error(errorData.message);}
        });
    };
    fetchMySongs();
  }, []);

  const handleChangeImage = (e: any) => {
      const file = e.target?.files[0];
      setData({
        ...data,
        songImage: file && URL.createObjectURL(file),
      });
      setFile(file);

  };
  const handleChangeSong = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    //console.log(data);
  };


  const handleFileUpload = async (file: any) => {
    if (!file) {
      return null;
    }
    const signedUrl = await getSignedURL(file.type, file.size);

    if (signedUrl.failure !== undefined) {
      toast.error(signedUrl.failure);
      setFile(undefined);
      setData({
        ...data,
        songImage: "",
      });
      return null;
    }

    const url = signedUrl.success.url;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (res.status === 200) {
        // toast.success("Profile photo uploaded successfully");
        return signedUrl?.success?.key;
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      toast.error("Failed to upload profile photo");
    }

    return null;
  };

  const handleSubmitSong = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingSong(true);
    fetch(`/api/songs/update?songID=${songID}`,{method:"POST",body:JSON.stringify({'title':data.title,'explicit':data.explicit,'visibility':data.visibility})}).then((res)=>{
      if(res.ok){
        toast.success("Successfully saved song.")
      }else{
        toast.error("Error saving song. Please try again later.")
      }
    })
    setIsLoadingSong(false);
    };

  const handleSubmitImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingImage(true);
    const uploadedImageUrl = await handleFileUpload(file);
    setIsLoadingImage(false);
    };

  const handleImageReset = async()=>{
    data.songImage = "/images/placeholders/defaultMedia.png"
  }

  const handleImageCancel = () => {
    setData((prevData) => ({
      ...prevData,
      songImage: OGdata.songImage,
    }));
  };

    if(isLoading){
      return(
        <Loader />
      )}

    if(isInvalidSong){
      return(notFound())
    }
    
    if (!isSongOwner){
      return(notFound())
    }

  return (
    <>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Song Details
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmitSong}>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                    htmlFor="songTitle"
                  >
                    Song Title
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white px-4.5 py-2.5 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="songTitle"
                      id="songTitle"
                      placeholder="Title..."
                      defaultValue={data.title}
                      onChange={handleChangeSong}
                    />
                  </div>
                </div>

                {/* <div className="mb-5.5">
                  <label
                    className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                    htmlFor="songTitle"
                  >
                    Release Date
                  </label>
                  <DatePicker 
                    initialDate={data.createdAt ? new Date(data.createdAt) : undefined} 
                    onDateChange={(date) => {
                      setData(prevData => ({
                        ...prevData,
                        createdAt: date ? date.toString() : ""
                      }));
                    }} 
                  />
                </div> */}

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                      htmlFor="explicitToggle"
                    >
                      Explicit
                    </label>
                    <SwitcherFour
                    id="explicitToggle"
                    active={data.explicit}
                    onToggle={(newState) => setData(prevData => ({ ...prevData, explicit: newState }))}
                  />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                      htmlFor="publicToggle"
                    >
                      Public
                    </label>
                    <SwitcherFour
            id="publicToggle"
            active={data.visibility === "Public"}
            onToggle={(newState) => setData(prevData => ({ ...prevData, visibility: newState ? "Public" : "Private" }))}
          />
                  </div>
                </div>

                <div className="flex justify-start gap-3">
                  <button
                    className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                    type="reset"
                  >
                    Cancel
                  </button>
                  <button
                    className="flex justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                    type="submit"
                  >
                    {isLoadingSong ? (
                      <span className="flex items-center gap-2">
                        Saving{" "}
                        <span
                          className={`h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-dark dark:border-t-transparent`}
                        ></span>
                      </span>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">Image</h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmitImage}>
                <div className="mb-4 flex items-center justify-center gap-3">
                  <div className="h-48 w-48 rounded-full">
                    {data?.songImage && (
                     
                      <>
                        <Image
                          src={data?.songImage}
                          width={192}
                          height={192}
                          alt="Song image"
                          className="overflow-hidden rounded-lg"
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                <button
                    className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                    onClick={(e)=>{{handleImageReset()}}}
                  >
                    Remove
                  </button>
                  <button
                    className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                    onClick={(e)=>{{handleImageCancel()}}}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex items-center justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                    type="submit"
                  >
                    {isLoadingImage ? (
                      <span className="flex items-center gap-2">
                        Saving{" "}
                        <span
                          className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-dark dark:border-t-transparent`}
                        ></span>
                      </span>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSongBoxes;
