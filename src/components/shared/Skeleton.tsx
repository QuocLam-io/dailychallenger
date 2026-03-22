import "./Skeleton.scss";

type SkeletonProps = {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  delay?: number;
};

const Skeleton = ({
  width = "100%",
  height = "16px",
  borderRadius = "4px",
  className = "",
  delay = 0,
}: SkeletonProps) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        animationDelay: delay ? `${delay}s` : undefined,
      }}
    />
  );
};

export default Skeleton;
