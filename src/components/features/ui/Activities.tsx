import { getVideosAction } from "@/app/actions";
import ActivitiesClient from "./ActivitiesClient";

export default async function Activities() {
  const data = await getVideosAction();
  const videos = data?.videos || [];

  return <ActivitiesClient videos={videos} />;
}
