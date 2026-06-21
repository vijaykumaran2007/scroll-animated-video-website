const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

content = content.replace(
  '<Hero heroOpacity={heroOpacity} heroTranslateY={heroTranslateY} />\r\n      <Projects />\r\n      <Skills />\r\n      <Education />\r\n      <Certifications />',
  '<Hero heroOpacity={heroOpacity} heroTranslateY={heroTranslateY} />\r\n      <Skills />\r\n      <Projects />\r\n      <Certifications />'
);
content = content.replace(
  '<Hero heroOpacity={heroOpacity} heroTranslateY={heroTranslateY} />\n      <Projects />\n      <Skills />\n      <Education />\n      <Certifications />',
  '<Hero heroOpacity={heroOpacity} heroTranslateY={heroTranslateY} />\n      <Skills />\n      <Projects />\n      <Certifications />'
);

content = content.replace(
  /const EDUCATION: ReadonlyArray<\{[\s\S]*?\];\r?\n\r?\nconst HONORS: ReadonlyArray<string> = \[\r?\n  "Finalist, GDG Hackathonic 2\.0",\r?\n  "Finalist, Yuktha Hackathon",\r?\n\];\r?\n/,
  ''
);

content = content.replace(
  /function Projects\(\) \{[\s\S]*?className="relative z-10 bg-\[#0a0a0b\] border-t border-\[#1f1f23\] rounded-t-\[2rem\] shadow-\[0_-30px_60px_rgba\(0,0,0,0\.75\)\]"/g,
  `function Projects() {\n  return (\n    <section\n      id="projects"\n      className="relative z-10 bg-[#0a0a0b] border-t border-[#1f1f23]"`
);

content = content.replace(
  /function Skills\(\) \{[\s\S]*?className="relative z-10 bg-\[#0a0a0b\] border-t border-\[#1f1f23\]"/g,
  `function Skills() {\n  return (\n    <section\n      id="about"\n      className="relative z-10 bg-[#0a0a0b] border-t border-[#1f1f23] rounded-t-[2rem] shadow-[0_-30px_60px_rgba(0,0,0,0.75)]"`
);

content = content.replace(
  /\/\* ---------- EDUCATION ----------------------------------------------------- \*\/[\s\S]*?\/\* ---------- CERTIFICATIONS ------------------------------------------------ \*\//,
  '/* ---------- CERTIFICATIONS ------------------------------------------------ */'
);

fs.writeFileSync('src/app/page.tsx', content);
console.log('Done');
