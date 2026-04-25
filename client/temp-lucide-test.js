import * as lucide from "lucide-react";
console.log(
  Object.keys(lucide)
    .sort()
    .filter((name) =>
      ["Facebook", "Linkedin", "Twitter", "Instagram", "ArrowRight"].includes(
        name,
      ),
    ),
);
