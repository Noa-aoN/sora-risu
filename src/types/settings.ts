import type { GeoLocation } from "./location";
import type { UserProfile } from "./recommendation";
import type { DisplayTarget, TimelineRange } from "./timeline";

export type AppSettings = {
  location: GeoLocation | null;
  profile: UserProfile;
  timelineRange: TimelineRange;
  displayTarget: DisplayTarget;
  carryChecks: Record<string, boolean>;
};
