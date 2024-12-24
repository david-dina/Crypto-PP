import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProfileBox from "@/components/ProfileBox";
import axios from "axios";
import { User } from "@/types/user";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Next.js Profile Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Profile page for NextAdmin Dashboard Kit",
};

const fetchUser = async (username: string) => {
  return axios
    .get(`https://data.musicaicentral.com/profile/${username}`)
    .then((response) => {
      let userData: User = response.data;
      if (userData.avatarUrl === null){
        userData.avatarUrl = '/images/placeholders/profile.png'
      }else{userData.avatarUrl = `https://ubdclxojnftwcnowsgfr.supabase.co/storage/v1/object/public/images/${userData.avatarUrl}`;}

      return userData;
    })
    .catch((e) => {
      notFound();
    });
};

const Profile = async ({ params }: { params: { username: string } }) => {
  const user = await fetchUser(params.username);

  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />

        <ProfileBox user={user} />
      </div>
    </DefaultLayout>
  );
};

export default Profile;
