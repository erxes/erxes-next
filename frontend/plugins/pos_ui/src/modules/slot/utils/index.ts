export const getAngle = (
  startVector: { x: number; y: number },
  endVector: { x: number; y: number }
) => {
  const dot = startVector.x * endVector.x + startVector.y * endVector.y;
  const det = startVector.x * endVector.y - startVector.y * endVector.x;
  let angle = (Math.atan2(det, dot) * 180) / Math.PI;
  return angle;
};

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}