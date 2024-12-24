import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRouter } from 'next/router';
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditSongBoxes from "@/components/Dashboard/Songs/Detail/EditBoxes";
import Stats from "@/components/Dashboard/Songs/Detail/Stats";


export const metadata: Metadata = {
  title: "Next.js Song Edit Page | NextAdmin - Next.js Dashboard c",
  description: "This is Next.js Settings page for NextAdmin Dashboard Kit",
};

const SongInfo = () => {
  const router = useRouter();
  const { id } = router.query;
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

export default SongInfo;