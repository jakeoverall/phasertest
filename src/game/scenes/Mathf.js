
export const Mathf = {
  clamp(val, low, high) {
    val = Math.round(val);
    if (val < low) {
      return low;
    }
    if (val > high) {
      return high;
    }
    return val;
  }
};
