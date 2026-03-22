import Skeleton from "./Skeleton";
import "./DashboardSkeleton.scss";

export const ChallengesSkeleton = () => {
  return (
    <div className="dashboard-skeleton_cards" role="status" aria-label="Loading challenges">
      {[0, 1, 2].map((i) => (
        <div key={i} className="dashboard-skeleton_card">
          <Skeleton width="20px" height="20px" borderRadius="4px" delay={i * 0.15} />
          <div className="dashboard-skeleton_card-text">
            <Skeleton width={`${70 - i * 15}%`} height="20px" delay={i * 0.15} />
            <Skeleton width="80px" height="12px" delay={i * 0.15} />
          </div>
          <Skeleton width="48px" height="20px" borderRadius="4px" delay={i * 0.15} />
        </div>
      ))}
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton" role="status" aria-label="Loading dashboard">
      {/* Time row */}
      <section className="dashboard-skeleton_header">
        <div className="dashboard-skeleton_time">
          <Skeleton width="120px" height="16px" />
          <Skeleton width="90px" height="16px" />
        </div>

        {/* User card */}
        <div className="dashboard-skeleton_user">
          <div className="dashboard-skeleton_name">
            <Skeleton width="80px" height="16px" />
            <Skeleton width="140px" height="30px" borderRadius="6px" />
          </div>
          <div className="dashboard-skeleton_streak">
            <Skeleton width="70px" height="14px" />
            <Skeleton width="50px" height="24px" borderRadius="6px" />
            <Skeleton width="90px" height="14px" />
            <div className="dashboard-skeleton_cheers">
              <Skeleton width="58px" height="14px" />
              <div className="dashboard-skeleton_cheers-avatars">
                <Skeleton width="24px" height="24px" borderRadius="50%" />
                <Skeleton width="24px" height="24px" borderRadius="50%" />
                <Skeleton width="24px" height="24px" borderRadius="50%" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChallengesSkeleton />
    </div>
  );
};

export default DashboardSkeleton;
