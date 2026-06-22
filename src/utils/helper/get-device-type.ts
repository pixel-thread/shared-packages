/**
 * @file Stub — device type detection helper used by registry templates.
 * Consumers should replace this with an actual device detection implementation.
 *
 * @returns A string identifying the device type (e.g. "mobile", "tablet", "web").
 */
export function getDeviceType(): string {
  return 'web';
}
