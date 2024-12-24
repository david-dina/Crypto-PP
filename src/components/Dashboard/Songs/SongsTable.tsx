"use client"
import Image from "next/image";
import SongPagination from "./SongPagination";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import { dashboardSong } from "@/types/song";
import { formatSeconds } from "@/libs/utils";
import Loader from "@/components/common/Loader"
import {useEffect, useState} from "react"
import { useRouter } from "next/navigation";
import {toast} from "react-hot-toast";
import {numberFormater}from "@/libs/numberFormater"



// const songDataPublic: dashboardSong[] = [
//   {
//     logo: "/images/placeholders/square-placeholder.jpg",
//     title: "Song 1",
//     played: 3.5,
//     playslistCount: "5,768",
//     likes: 590,
//     explicit: false,
//     duration: 80,
//     visibility: true,
//   },
//   {
//     logo: "/images/placeholders/square-placeholder.jpg",
//     title: "Song 2",
//     played: 3.9,
//     playslistCount: "2,768",
//     likes: 203,
//     explicit: true,
//     duration: 187,
//     visibility: true,
//   },
//   {
//     logo: "/images/placeholders/square-placeholder.jpg",
//     title: "Song 4",
//     played: 0,
//     playslistCount: "0",
//     likes: 0,
//     explicit: true,
//     duration: 130,
//     visibility: false,
//   },
// ];

const SongsTable = () => {
  const [songDataPublic, setSongDataPublic] = useState<dashboardSong[]>([]);
  const [isLoading,setIsLoading] = useState(true);
  const router = useRouter();

useEffect(() => {
  const fetchMySongs = async () => {
    try{
    const response = await fetch("/api/songs/mysongs");
    if (response.redirected) {
      router.push(response.url);
      return;
    }
    const data = await response.json();
    setSongDataPublic(data.publicSongs.concat(data.privateSongs));
    setIsLoading(false);
      }catch(e){
        toast.error("An error occurred, please try again later.");
        console.error(`There was a problem with the fetch operation: ${e}`);
      }
    }
  fetchMySongs();
}, []);
if(isLoading){
  return(
    <Loader />
  )
}
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Top Channels
      </h4> */}
      <div className="flex flex-col">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Song
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Streams
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Likes
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center md:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Playlists
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Actions
            </h5>
          </div>
        </div>

        {songDataPublic.map((song, key) => (
          <div
            className={`flex items-center justify-between sm:grid sm:grid-cols-4 md:grid-cols-5 ${
              key === songDataPublic.length - 1
                ? ""
                : "border-b border-stroke dark:border-dark-3"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3.5 px-2 py-4">
              <div className="flex-shrink-0 overflow-hidden rounded">
                <Image src={song.logo} alt="Brand" width={56} height={56} />
              </div>
              <div>
                <p className="font-medium text-dark dark:text-white sm:block">
                  {song.title}
                </p>
                <span className="text-sm">
                  {formatSeconds(song.duration)} &bull;{" "}
                  {song.visibility}{" "}
                  {song.explicit ? (
                    <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-sm bg-slate-300 font-bold text-gray-7">
                      E
                    </span>
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark dark:text-white">
                {numberFormater({numberString:song.played})}
              </p>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark dark:text-white">
                {numberFormater({numberString:song.likes})}
              </p>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 md:flex">
              <p className="font-medium text-dark dark:text-white">
                {numberFormater({numberString:song.playslistCount})}
              </p>
            </div>

            <div className="flex items-center sm:justify-center sm:px-2 sm:py-4">
              <ButtonDefault
                label="Edit"
                link={`/dashboard/songs/${song.id}/edit`}
                customClasses="flex items-center justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
              />
            </div>
          </div>
        ))}
      </div>
      <SongPagination />
    </div>
  );
};

export default SongsTable;
