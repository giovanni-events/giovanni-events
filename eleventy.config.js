import * as yaml from "js-yaml";
import markdownIt from "markdown-it";

const TZ = "America/Chicago";
const md = markdownIt();

// Event times are entered as Chicago wall-clock time. Return "YYYY-MM-DDTHH:mm".
function wallTime(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 16); // YAML timestamps parse as UTC
  return String(value).slice(0, 16);
}

function nowInChicago() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ, hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    }).formatToParts(new Date()).map((x) => [x.type, x.value])
  );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

// Build a Date at UTC using the wall-clock parts, so formatting in UTC prints them unchanged.
function asUtc(value) {
  return new Date(wallTime(value) + ":00Z");
}

function clock(hhmm) {
  let [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}${m ? ":" + String(m).padStart(2, "0") : ""}${ampm}`;
}

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml,yml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/assets");

  // For rich text fields stored in data files (intro, closing)
  eleventyConfig.addFilter("markdown", (str) => md.render(str || ""));
  eleventyConfig.addFilter("nl2br", (str) => String(str).replace(/\n/g, "<br>"));

  eleventyConfig.addFilter("byRole", (people, role) => (people || []).filter((p) => p.role === role));

  // Generated display text. The client never types these.
  eleventyConfig.addFilter("dayOfWeek", (v) =>
    asUtc(v).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }).toUpperCase());
  eleventyConfig.addFilter("monthDay", (v) =>
    asUtc(v).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).toUpperCase());
  eleventyConfig.addFilter("timeRange", (start, end) => {
    const s = clock(wallTime(start).slice(11));
    return end ? `${s}–${clock(String(end).slice(0, 5))}` : s;
  });

  eleventyConfig.addCollection("events", (api) =>
    api.getFilteredByGlob("src/events/*.md").filter((e) => e.data.published));

  // Published events that start in the future, soonest first. Evaluated at build time.
  eleventyConfig.addCollection("upcomingEvents", (api) => {
    const now = nowInChicago();
    return api.getFilteredByGlob("src/events/*.md")
      .filter((e) => e.data.published && wallTime(e.data.start) > now)
      .sort((a, b) => wallTime(a.data.start).localeCompare(wallTime(b.data.start)));
  });

  return {
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
