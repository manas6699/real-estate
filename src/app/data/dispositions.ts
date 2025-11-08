export const Dispositions: { [key: string]: string } = {
  // Junk
  "Not interested": "Junk",
  "Language barrier": "Junk",
  "Duplicate": "Junk",
  "Fraud": "Junk",
  "Already Booked": "Junk",
  "Not Valid": "Junk",
  "Location Issue": "Junk",
  "Budget Issue": "Junk",

  // Retry
  "Redirection to voice-mail": "Retry",
   "Network Error": "Retry",
  "Not responding": "Retry",
  "Busy": "Retry",
  "Prospect": "Retry",
  "Switch Off": "Retry",

  // Cold
  "Under Follow Up": "Cold",
  "Call Back": "Cold",
  "Agent Switch": "Cold",
  "Refer": "Cold",

  // Warm
  "Site Visit Fixed": "Warm",
  "Site Visit Rescheduled": "Warm",
  "Site Visit Cancelled": "Warm",

  // Hot
  "Site Visit Done": "Hot",
  "Visited Followup": "Hot",
  "Booked": "Hot",
  "Sold": "Hot",
};