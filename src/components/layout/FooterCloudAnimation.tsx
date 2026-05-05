export function FooterCloudAnimation() {
  return (
    <div
      aria-hidden
      className="motion-cloud-drift pointer-events-none absolute inset-x-0 bottom-0 z-0 h-36 [animation:cloud-drift_120s_linear_infinite]"
      style={{
        backgroundImage: "url(/brand/sora/cloud-loop.png)",
        backgroundRepeat: "repeat-x",
        backgroundPosition: "left bottom",
        backgroundSize: "auto 100%",
        mixBlendMode: "multiply",
      }}
    />
  );
}
