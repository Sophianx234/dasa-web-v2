import { getVideosAction } from "@/app/actions";
import ActivitiesClient from "./ActivitiesClient";

export default async function Activities() {
  const data = await getVideosAction();
  const videos = data?.videos || [];
  console.log("Fetched Videos for Activities:", videos.length, data?.status);

  return <ActivitiesClient videos={videos} />;
}
