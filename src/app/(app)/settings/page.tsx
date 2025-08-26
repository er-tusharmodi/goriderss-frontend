import type { Metadata } from "next";
import SettingsClient, { SettingsState } from "./SettingsClient";

export const metadata: Metadata = {
  title: "GoRiderss — Settings",
  description: "Tune your GoRiderss experience",
};

async function getInitialSettings(): Promise<SettingsState> {
  // TODO: replace with real DB/API fetch (JWT -> userId)
  return {
    isEmailDisplay: true,
    isMobileNumberDisplay: false,
    isExpensesDisplay: true,
    notifTripInvites: true,
    notifMentions: true,
    notifTripReminders: true,
    wifiAutoDl: true,
    twoFA: false,
    blocked: ["Spam Rider", "Fake Profile"],
    sessions: [
      { device: "Chrome on Windows", loc: "Jaipur, IN", last: "Now", current: true },
      { device: "Android App", loc: "Udaipur, IN", last: "2 days ago", current: false },
    ],
    lang: "English (India)",
    region: "India",
    unit: "Kilometers",
    user: {
      name: "TuSharthi",
      role: "XPulse Rider",
      avatar:
        "https://ik.imagekit.io/goriderss/Extra/Untitled%20design%20(1).png?updatedAt=1754718803330",
    },
  };
}

export default async function Page() {
  const initial = await getInitialSettings();

  return (
    <main className="bg-slatebg text-white min-h-screen">
      <header className="sticky top-0 z-30 bg-slatebg/90 backdrop-blur pt-5">
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
          
          <div className="ml-auto flex items-center gap-2">
            {/* top save handled inside client via ref */}
            <button
              id="btnSaveTop"
              className="px-4 py-2 bg-accent text-white rounded-2xl font-semibold "
              form="settingsForm"
              type="submit"
            >
              Save Changes
            </button>
          </div>
        </div>
      </header>

      <SettingsClient initial={initial} />
    </main>
  );
}
