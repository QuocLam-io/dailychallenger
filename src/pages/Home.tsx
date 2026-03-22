//React
import { useEffect, useState, useMemo } from "react";
//Utils
import { getGreeting } from "@/utils/getGreeting";
import { calculateCurrentStreak } from "@/utils/calculateStreak";
//Styles
import "./Home.scss";
import { AnimatePresence, motion } from "framer-motion";
import plusCircle from "@/assets/images/plus-black-circle-white.png";
import plusSoft from "@/assets/icons/plus-white-circle-grey.svg";
//Auth
import { useUser } from "@clerk/clerk-react";
//Zustand
import { useUserStore } from "@/stores/user";
import { useChallengesStore, useDashboardStore, useSocialStore } from "@/stores";
//Supabase
import { supabase } from "@/supabase-client";
//Components
import { NavSpacer, CarraigeLoader, Button } from "@/components/shared";
import { ChallengerForm, ChallengeCard } from "@/components/challenges";
import { DashboardEmptyExamples, DashboardCTAFooter } from "@/components/dashboard";
import { CheersAvatarGroup, FriendChallengeCard } from "@/components/social";

const Home = () => {
  const {
    challenges,
    currentChallenges,
    pastChallenges,
    fetchChallenges,
  } = useChallengesStore();

  const [isChallengerFormOpen, setIsChallengerFormOpen] = useState(false);
  const isNewUser = challenges.length === 0;
  const greeting = useMemo(() => getGreeting(isNewUser), [isNewUser]);
  const currentStreak = useMemo(() => calculateCurrentStreak(challenges), [challenges]);

  const clerkId = useUserStore((s) => s.clerkId);
  const supabaseId = useUserStore((s) => s.supabaseId);
  const longestStreak = useUserStore((s) => s.longestStreak);
  const firstName = useUserStore((s) => s.firstName);
  const lastName = useUserStore((s) => s.lastName);
  const setFirstName = useUserStore((s) => s.setFirstName);
  const setLastName = useUserStore((s) => s.setLastName);
  const { user } = useUser();
  const standinUserName = user?.primaryEmailAddress?.emailAddress.split("@")[0];

  const { activeTab } = useDashboardStore();

  // Name edit state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  /* ----------------------------- Social State ------------------------------ */

  const {
    friends,
    friendsChallenges,
    fetchFriends,
    fetchFriendsChallenges,
    fetchReceivedCheers,
    addCheer,
    removeCheer,
  } = useSocialStore();

  const [myCheerSet, setMyCheerSet] = useState<Set<string>>(new Set());

  /* ----------------------- Fetch Challenges useEffect ----------------------- */

  useEffect(() => {
    // TODO: Add skeleton state
    if (!supabaseId) return; // ensures valid UUID before fetching
    fetchChallenges(supabaseId);
    fetchFriends(supabaseId);
  }, [supabaseId]);

  useEffect(() => {
    if (friends.length === 0) return;
    fetchFriendsChallenges(friends.map((f) => f.id));
  }, [friends]);

  useEffect(() => {
    if (currentChallenges.length === 0) return;
    fetchReceivedCheers(currentChallenges.map((c) => c.id));
  }, [currentChallenges]);

  useEffect(() => {
    if (!supabaseId || friendsChallenges.length === 0) return;
    const logIds = friendsChallenges.map((fc) => fc.id);
    supabase
      .from("cheers")
      .select("challenge_log_id")
      .eq("user_id", supabaseId)
      .in("challenge_log_id", logIds)
      .then(({ data, error }) => {
        if (!error && data) {
          setMyCheerSet(new Set(data.map((d) => d.challenge_log_id)));
        }
      });
  }, [supabaseId, friendsChallenges]);

  const handleToggleCheer = async (challengeLogId: string) => {
    if (!supabaseId) return;
    if (myCheerSet.has(challengeLogId)) {
      setMyCheerSet((prev) => {
        const next = new Set(prev);
        next.delete(challengeLogId);
        return next;
      });
      await removeCheer(challengeLogId, supabaseId);
    } else {
      setMyCheerSet((prev) => new Set(prev).add(challengeLogId));
      await addCheer(challengeLogId, supabaseId);
    }
  };

  /* -------------------------- Name Edit Functions --------------------------- */

  const handleEditName = () => {
    setEditFirstName(firstName || "");
    setEditLastName(lastName || "");
    setIsEditingName(true);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditFirstName("");
    setEditLastName("");
  };

  const handleSaveName = async () => {
    if (!supabaseId) return;

    setIsSavingName(true);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          first_name: editFirstName || null,
          last_name: editLastName || null,
        })
        .eq("id", supabaseId);

      if (error) {
        console.error("Error updating name:", error);
        alert("Failed to update name. Please try again.");
      } else {
        // Update Zustand store
        setFirstName(editFirstName || null);
        setLastName(editLastName || null);
        setIsEditingName(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Failed to update name. Please try again.");
    } finally {
      setIsSavingName(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  if (!supabaseId) return <CarraigeLoader />;
  return (
    <main className="home_wrapper">
      <NavSpacer />
      <section className="dashboard-header">
        <div className="dashboard-time">
          <p>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p>
            {new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              timeZoneName: "short",
            })}
          </p>
        </div>
        <div className="dashboard-user">
          <div className="dashboard-user_name">
            <p>{greeting}</p>
            <AnimatePresence mode="wait">
              {isEditingName ? (
                <motion.div
                  key="edit-mode"
                  className="dashboard-user_name-edit"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    placeholder="First name"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    disabled={isSavingName}
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    disabled={isSavingName}
                  />
                  <div className="dashboard-user_name-edit-buttons">
                    <button onClick={handleSaveName} disabled={isSavingName}>
                      {isSavingName ? "Saving..." : "Save"}
                    </button>
                    <button onClick={handleCancelEdit} disabled={isSavingName}>
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  key="display-mode"
                  onClick={handleEditName}
                  style={{ cursor: "pointer" }}
                  title="Click to edit"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {firstName || lastName
                    ? `${firstName || ""} ${lastName || ""}`.trim()
                    : standinUserName ?? clerkId}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div className="dashboard-user_streak">
            <p>Current streak</p>
            <p>{currentStreak} days</p>
            <p>Longest streak: {longestStreak} days</p>
            <div className="dashboard-user_streak-cheers">
              <CheersAvatarGroup />
            </div>
          </div>
        </div>
      </section>
      {!challenges.length ? (
        <DashboardEmptyExamples />
      ) : (
        <>
          <section className="dashboard_challenges-display">
            <div className="dashboard_challenges-display_header">
              <h2>{activeTab === "past" && "Past"} Challenges</h2>
              {activeTab === "current" ? (
                <h3>Show your fellow chaps you are true to your word</h3>
              ) : (
                <h3>Come to admire your work, I see.</h3>
              )}
            </div>
            <div className={activeTab === "current" ? "visible" : "hidden"}>
              {currentChallenges.length === 0 ? (
                <div className="dashboard_challenges-display_new-cta">
                  <p>You’ve done it! Splendid work.</p>
                  <p>Now then — pip pip, and on to the next!</p>
                  <Button
                    icon={plusCircle}
                    onClick={() => setIsChallengerFormOpen(true)}
                  >
                    Create a challenge
                  </Button>
                </div>
              ) : (
                <div className="dashboard_challenges-display_cards-container">
                  {currentChallenges.map((c) => {
                    return <ChallengeCard key={c.id} challenge={c} />;
                  })}
                  <button
                    onClick={() => setIsChallengerFormOpen(true)}
                    className="dashboard_challenges-display_cards-container_new-challenge-card"
                  >
                    <img src={plusSoft} />
                    <span>New challenge</span>
                  </button>
                </div>
              )}
            </div>
            <div className={activeTab === "past" ? "visible" : "hidden"}>
              <div className="dashboard_challenges-display_cards-container">
                {pastChallenges.map((c) => {
                  return <ChallengeCard key={c.id} challenge={c} />;
                })}
              </div>
            </div>
          </section>
          {friendsChallenges.length > 0 && (
            <section className="dashboard_friends-challenges">
              <div className="dashboard_friends-challenges_header">
                <h2>Friends’ Challenges</h2>
                <h3>Give your mates a jolly good cheer</h3>
              </div>
              <div className="dashboard_friends-challenges_cards-container">
                {friendsChallenges.map((fc) => (
                  <FriendChallengeCard
                    key={fc.id}
                    challenge={fc}
                    isCheered={myCheerSet.has(fc.id)}
                    onToggleCheer={() => handleToggleCheer(fc.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Footer */}
      {!challenges.length ? (
        <section className="dashboard-kyurem_cta">
          <h2>New are you? Start here:</h2>
          <Button
            icon={plusCircle}
            onClick={() => setIsChallengerFormOpen(true)}
            // iconPosition="right"
            // disabled={true}
          >
            Create a challenge
          </Button>
        </section>
      ) : (
        // {/* TODO: Add a Footer Spacer */}
        <DashboardCTAFooter />
      )}

      {/* Modals */}
      <AnimatePresence>
        {isChallengerFormOpen && (
          <ChallengerForm onClose={() => setIsChallengerFormOpen(false)} />
        )}
      </AnimatePresence>
    </main>
  );
};

export default Home;
