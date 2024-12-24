import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditSongBoxes from "@/components/Dashboard/Songs/Detail/EditBoxes";
import Stats from "@/components/Dashboard/Songs/Detail/Stats";

export const metadata: Metadata = {
  title: "Music.AI Song Edit Page",
  description: "",
};

const SongEdit = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Song Details" />
        <div className="mb-8">
          <Stats />
        </div>
        <EditSongBoxes />
      </div>
    </DefaultLayout>
  );
};

export default SongEdit;
