import { useState } from "react";

// גרסה זמנית
export function useAuth() {
  // לשם התחלה: נניח שהמשתמש מחובר
  const [user] = useState({
    name: "Tohar",
    role: "user" // אפשר לשים "admin" או "business"
  });

  // אם אתה רוצה שהמערכת תראה כאילו אף אחד לא מחובר:
  // const [user] = useState(null);

  return { user };
}
