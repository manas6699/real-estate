export const Dispositions: { [key: string]: string } = {
  // Junk
  "Not interested": "Junk",
  "Language barrier": "Junk",
  "Duplicate": "Junk",
  "Fraud": "Junk",
  "Already Booked": "Junk",
  "Network Error": "Junk",
  "Not Valid": "Junk",
  "Location Issue": "Junk",
  "Budget Issue": "Junk",

  // Retry
  "Redirection to voice-mail": "Retry",
  "Not responding": "Retry",
  "Busy": "Retry",
  "Switch Off": "Retry",

  // Cold
  "Under Follow Up": "Cold",
  "Call Back": "Cold",
  "Agent Switch": "Cold",
  "Refer": "Cold",

  // Warm
  "Site Visit Fixed": "Warm",
  "Visited Followup": "Warm",
  "Site Visit Rescheduled": "Warm",
  "Site Visit Cancelled": "Warm",

  // Hot
  "Site Visit Done": "Hot",
  "Booked": "Hot",
  "Sold": "Hot",
};