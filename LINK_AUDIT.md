# Link audit

This package contains the local link fixes for the portfolio. GitHub was used only as a read-only source of truth.

## Verified corrections

- The second contact phone now uses `070 550 6150` and `tel:+94705506150`, matching the latest CV in `rakindufernando/rakindufernandoupdatedwebpage`.
- The wedding dance project now links to `https://youtu.be/9UI1FGFzTL8`.
- The HNB Vesak project now links to `https://youtu.be/e6YeyzdLJKc`.
- Social links use explicit `noopener noreferrer` handling for new tabs.
- The fixed scroll-progress bar and decorative hero visual no longer intercept pointer input.

## Read-only source checks

- GitHub profile `https://github.com/rakindufernando` and the public profile README confirm the GitHub profile, email, YouTube and Facebook destinations.
- The latest portfolio repository CV is `public/Rakindu-Fernando-Resume.pdf`. The packaged PDF matches the GitHub blob byte-for-byte and the phone number above is present in its extracted text.
- The three portfolio project pages at `rakindufernando.lk` responded with HTTP 200 during the audit.
- YouTube oEmbed confirmed the five distinct film destinations, including the two corrected IDs.

## Automated coverage

`tests/navigation.test.mjs` checks all rendered internal anchors, packaged asset links, external-link security attributes, the `/work` redirect, the resume and every gallery image. The existing suite checks all five category pages, all 27 projects, 404 handling, metadata, sitemap, robots, reduced motion, TypeScript and build output.

The browser pass exercised desktop, tablet and mobile navigation, category routes, the mobile menu, project dialogs, image controls, Back behavior and all 27 project galleries. External providers such as LinkedIn and Instagram may show authentication or anti-bot pages while still accepting the verified URL.

No GitHub file, commit, branch or repository was modified.
