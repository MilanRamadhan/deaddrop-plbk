import { calculateDistance } from "./distance";

export function verifyLocation(currentLat: number, currentLng: number, targetLat: number, targetLng: number, radius: number) {
  const distance = calculateDistance(currentLat, currentLng, targetLat, targetLng);

  return {
    valid: distance <= radius,
    distance,
  };
}
