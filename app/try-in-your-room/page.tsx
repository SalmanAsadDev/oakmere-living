import { Metadata } from "next";
import { RoomPlanner } from "@/components/previews/room-planner";

export const metadata: Metadata = {
  title: "Try In Your Room | Oakmere Living",
  description: "See how our sofas look in your own living space using our private browser-local room planner.",
};

export default function TryInYourRoomPage() {
  return (
    <div className="container section max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="display text-4xl mb-4">Try it in your room</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Not sure if that corner sofa will fit? Curious how the colour matches your walls? 
          Upload a photo of your space to visualise our furniture directly in your home.
        </p>
      </div>

      <RoomPlanner />
    </div>
  );
}
