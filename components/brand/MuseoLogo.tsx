"use client";

type MuseoLogoProps = {
  className?: string;
};

export default function MuseoLogo({
  className = "",
}: MuseoLogoProps) {
  return (
    <div className={className}>
      museo.
    </div>
  );
}