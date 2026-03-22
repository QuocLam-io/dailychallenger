import "./CheersAvatarGroup.scss";
import { getInitials, getAvatarColor } from "@/utils/avatar";
import { useSocialStore } from "@/stores";

const CheersAvatarGroup = () => {
  const { receivedCheers } = useSocialStore();

  const uniqueCheerers = receivedCheers.reduce(
    (acc, cheer) => {
      if (!acc.find((c) => c.user_id === cheer.user_id)) {
        acc.push(cheer);
      }
      return acc;
    },
    [] as typeof receivedCheers
  );

  if (uniqueCheerers.length === 0) {
    return <p>No cheers yet</p>;
  }

  const displayCount = Math.min(uniqueCheerers.length, 5);
  const overflow = uniqueCheerers.length - displayCount;

  return (
    <>
      <p>
        {uniqueCheerers.length} cheer{uniqueCheerers.length !== 1 ? "s" : ""}
      </p>
      <div className="cheers-avatar-group_avatars">
        {uniqueCheerers.slice(0, displayCount).map((cheer) => {
          const initials = getInitials(cheer.first_name, cheer.last_name);
          const color = getAvatarColor(cheer.user_id);
          const name =
            `${cheer.first_name ?? ""} ${cheer.last_name ?? ""}`.trim();
          return (
            <div
              key={cheer.user_id}
              className="cheers-avatar-group_avatar"
              style={
                cheer.avatar_url
                  ? undefined
                  : { backgroundColor: color }
              }
              title={name}
            >
              {cheer.avatar_url ? (
                <img src={cheer.avatar_url} alt={name} />
              ) : (
                initials
              )}
            </div>
          );
        })}
        {overflow > 0 && (
          <div className="cheers-avatar-group_avatar cheers-avatar-group_overflow">
            +{overflow}
          </div>
        )}
      </div>
    </>
  );
};

export default CheersAvatarGroup;
